import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import {Navigate} from "react-router-dom";
import Editor from '../components/Editor';
import {BASE_URL} from '../helper.js'



const CreatePost = () => {
    const [title,setTitle] = useState('')
    const [summary,setSummary] = useState('')
    const [content,setContent] = useState('')
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false)

    async function createNewPost(e){
        const data = new FormData();
        data.set('title', title);
        data.set('content', content);
        data.set('summary', summary);
        data.set('file', files[0])
        e.preventDefault();
        const response = await fetch(`${BASE_URL}/post`,{
            method:'POST',
            body: data,
            // credentials: 'include'
        });
        if(response.ok){
            setRedirect(true);

        }

    }
    
    if (redirect){
        return <Navigate to={'/'} />
    }

  return (
    <form onSubmit={createNewPost}>
        <input type="title" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
        
        <input type="summary" placeholder='Summary' value={summary} onChange={e => setSummary(e.target.value)}  />

        <input type="file" onChange={(e => setFiles(e.target.files))}  />
        
        <Editor onChange={setContent} value={content} />

        <button type='submit' style={{marginTop: '10px'}}>Create Post</button>
    </form>
  )
} 

export default CreatePost

