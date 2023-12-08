import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { checkToken } from "../utils/checkToken";

const PostPage = (props)=>{
    let {data,userId} = props;
    return (
        <div className="post-list">
        {data.map((post) => (
                <div className="post-item" key={post.id}>
                    <b><a href={`/post/${post.id}`}>{post.title}</a></b>
                    {post.likes.includes(userId)
                        ?<img src="https://cdn-icons-png.flaticon.com/512/138/138533.png" style={{"width":"20px", "marginLeft":"10px"}} />
                        :<img src="https://cdn-icons-png.flaticon.com/512/138/138454.png" style={{"width":"20px","marginLeft":"10px"}} />}
                    { post.author.nickname===""
                    ?(<p> unknown / {moment(post.created_at).format("YYYY-MM-DD")}</p>)
                    :(<p>{post.author.nickname} / {moment(post.created_at).format("YYYY-MM-DD")}</p>)}
                </div>
        ))}
        </div>
    )
}

const RecuitPage = (props)=>{
    let {data} = props;
    return (
        <div className="post-list text-center">
        {data.map((recruitment) => (
        <div className="post-item" key={recruitment.id}>
            <b><a href={`/recruit/${recruitment.id}`}>{recruitment.title}</a></b>
            { recruitment.author.nickname===""
            ?(<p> unknown / {moment(recruitment.created_at).format("YYYY-MM-DD")}</p>)
            :(<p>{recruitment.author.nickname} / {moment(recruitment.created_at).format("YYYY-MM-DD")}</p>)}
            <p>({recruitment.applicant_count}/{recruitment.number_of_recruits})</p>
        </div>
))}
</div>
    )
}

const LikePostAPI = ()=>{
    const accessToken = localStorage.getItem("access");
    let userId;

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    
    if(checkToken(accessToken)){
        userId = JSON.parse(localStorage.getItem('payload')).user_id;
    }
    useEffect(()=>{
        let params = {option:"like"}
        if(checkToken(accessToken)){
            userId = JSON.parse(localStorage.getItem('payload')).user_id;
        }
        
        axios.get(`/post/profile/${userId}`,{params},
        {headers:{Authorization:`Bearer ${accessToken}`}}).then(response => {
                setData([...response.data]);
                console.log(response.data)
            }
        ).catch(error=>{
            if (error.response.status === 401){
                navigate('/login');
            }
            console.error('error: ', error)
        })
    },[]);

    return (
        <>
            <PostPage data={data} userId={userId} />
        </>
    )
}

const ApplyPostAPI = ()=>{
    const accessToken = localStorage.getItem("access");
    let userId;

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    
    if(checkToken(accessToken)){
        userId = JSON.parse(localStorage.getItem('payload')).user_id;
    }
    useEffect(()=>{
        let params = {option:"apply"}
        if(checkToken(accessToken)){
            userId = JSON.parse(localStorage.getItem('payload')).user_id;
        }
        
        axios.get(`/post/profile/${userId}`,{params},
        {headers:{Authorization:`Bearer ${accessToken}`}}).then(response => {
                setData([...response.data]);
                console.log(response.data)
            }
        ).catch(error=>{
            if (error.response.status === 401){
                navigate('/login');
            }
            console.error('error: ', error)
        })
    },[]);

    return (
        <RecuitPage data={data} />
    )
}

const MyRecruitmentAPI = ()=>{
    const accessToken = localStorage.getItem("access");
    let userId;

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    
    if(checkToken(accessToken)){
        userId = JSON.parse(localStorage.getItem('payload')).user_id;
    }
    useEffect(()=>{
        let params = {option:"recruit"}
        if(checkToken(accessToken)){
            userId = JSON.parse(localStorage.getItem('payload')).user_id;
        }
        
        axios.get(`/post/profile/${userId}`,{params},
        {headers:{Authorization:`Bearer ${accessToken}`}}).then(response => {
                setData([...response.data]);
                console.log(response.data)
            }
        ).catch(error=>{
            if (error.response.status === 401){
                navigate('/login');
            }
            console.error('error: ', error)
        })
    },[]);

    return (
        <RecuitPage data={data} />
    )
}

const MyPostAPI = ()=>{
    const accessToken = localStorage.getItem("access");
    let userId;

    const [data, setData] = useState([]);
    
    
    if(checkToken(accessToken)){
        userId = JSON.parse(localStorage.getItem('payload')).user_id;
    }
    useEffect(()=>{
        if(checkToken(accessToken)){
            userId = JSON.parse(localStorage.getItem('payload')).user_id;
        }
        
        axios.get(`/post/profile/${userId}`,
        {headers:{Authorization:`Bearer ${accessToken}`}}).then(response => {
            setData([...response.data]);
            console.log(response.data)
            }
        )
    },[]);

    return (
        <>
            <PostPage data={data} userId={userId} />
        </>
    )
}

export {LikePostAPI, ApplyPostAPI, MyPostAPI, MyRecruitmentAPI}