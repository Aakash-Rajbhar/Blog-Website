const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer');
const fs = require('fs');
const Post = require('./models/Post');
require('dotenv').config();

const uploadMiddleware = multer({ dest: 'uploads/' })

const app = express()
const port = process.env.PORT || 5000;


const salt = bcrypt.genSaltSync(10);
const secretKey = 'aakashrajbhar25'

app.use(cors({credentials:true,origin:'http://localhost:3000'}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))

try {
    mongoose.connect(`${process.env.MONGODB_URI}`)
    console.log('Connected to mongodb');
    
} catch (error) {
    console.log(error)
    
}


app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({username, password:bcrypt.hashSync(password,salt)})
        res.json(userDoc);
        
    } catch (error) {
        res.status(400).json(error)
    }

})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const userDoc = await User.findOne({ username });

        if (!userDoc) {
            return res.status(400).json("User not found");
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        
        if (passOk) {
            // Logged in
            jwt.sign({ username, id:userDoc._id}, secretKey, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id:userDoc._id,
                    username,
                });
            });
        } else {
            res.status(400).json("Invalid Credentials!!");
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json('Internal Server Error');
    }
});


app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secretKey, {}, (err, info) => {
        if(err) throw err;
        res.json(info);

    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
})

// To create a new Post 

app.post('/post',uploadMiddleware.single('file'), async (req,res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split(',');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext
    fs.renameSync(path, newPath); 

    const {token} = req.cookies;
    jwt.verify(token, secretKey, {}, async (err, info) => {
        if(err) throw err;
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,

        })
        res.json(postDoc);
    
    })

})

// To update the existing post with authorisation

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {

    let newPath = null;
      if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split(',');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
      }

    try {
      const { token } = req.cookies;
      jwt.verify(token, secretKey, {}, async (err, info) => {
        if(err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('You are not the Author');
      }
  
      await postDoc.updateOne({ title, summary, content, cover: newPath ? newPath : postDoc.cover });
      
      return res.json(postDoc);
      });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json('Internal Server Error');
    }
  });
  



app.get('/post', async (req,res) => {
    res.json(await Post.find().populate('author', ['username']).sort({createdAt: -1}).limit(20));
})

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`)
})