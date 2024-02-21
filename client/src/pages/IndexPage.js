import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import {BASE_URL} from '../helper.js'

const IndexPage = () => {

  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetch(`${BASE_URL}/post`).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      })
    })
  },[])

  return (
    <>
      {posts.length>0 && posts.map(post => (
        <Post {...post} key={post._id} />
      ))}
    </>
  )
}

export default IndexPage
