import React from 'react'
import {Link} from 'react-router-dom'
import {format} from 'date-fns'

const Post = ({_id, title, summary, content, cover, createdAt, author}) => {
  return (
    <div className="post">
          <div className="image">
            <Link to={`/post/${_id}`}>
          <img src={'http://localhost:4000/'+cover} alt="cover" />
            </Link>
          </div>
          <div className="texts">
          <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
          </Link>
          <p className="info">
            <Link to="" className="author">{author.username}</Link>
            <time>{format(new Date(createdAt),'MMM dd, yyyy HH:mm')}</time>
          </p>
          <p className="summary">{summary}</p>
          </div>
        </div> 
  )
}

export default Post
