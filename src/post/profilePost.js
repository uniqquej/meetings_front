import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { checkToken } from "../utils/checkToken";
import { PostPage,RecruitPage } from "../components/postPage";

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
                setData([...response.data.results]);
                console.log(response.data.results)
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
                setData([...response.data.results]);
                console.log(response.data.results)
            }
        ).catch(error=>{
            if (error.response.status === 401){
                navigate('/login');
            }
            console.error('error: ', error)
        })
    },[]);

    return (
        <RecruitPage data={data} />
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
        
        axios.get(`/post/profile/${userId}`,{params:{option:"recruit"}},
        {headers:{Authorization: `Bearer ${accessToken}`}}).then(response => {
                setData([...response.data.results]);
                console.log(response.data.results)
            }
        ).catch(error=>{
            if (error.response.status === 401){
                navigate('/login');
            }
            console.error('error: ', error)
        })
    },[]);

    return (
        <RecruitPage data={data} />
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
            setData([...response.data.results]);
            console.log(response.data.results)
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