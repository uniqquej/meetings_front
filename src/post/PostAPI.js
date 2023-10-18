import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import axios from "axios"
import "./post.css"

const accessToken = localStorage.getItem("access")

const PostAPI = ()=>{
    const [data, setData] = useState([]);

    useEffect(()=>{
        axios.get('/post/',{
            headers:{
                "Authorization" : `Bearer ${accessToken}`
            }
        }).then(
            response => {
                setData([...response.data]);
            }
        ).catch(error=>{
            console.error('error: ', error)
        })
    },[]);
    return (
        <>
        <div className="post-list">
        {data.map((post) => (
                <div className="post-item">
                    <a href={`/post/${post.id}`}>
                        {post.id}.{post.title}
                    </a>
                </div>
        ))}
        </div>
        </>
    )
}

const PostDetailAPI = ()=>{
    const [data, setData] = useState("");
    const {postId} = useParams();

    useEffect(()=>{
        axios.get(`/post/${postId}`,{
            headers:{
                "Authorization" : `Bearer ${accessToken}`
            }
        }).then(
            response => {
                console.log(response)
                setData(response.data);
            }
        ).catch(error=>{
            console.error('error: ', error)
        })
    },[]);
    return (
        <>
        <div className="post-detail">
            <input className="form-control" value={`제목 : ${data.title}`} readonly/>
            <textarea className="form-control" value={data.content} readonly/>
        </div>
        </>
    )
}

export {PostAPI,PostDetailAPI};