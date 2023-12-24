import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { checkToken } from "../utils/checkToken";
import { PostPage,RecruitPage } from "../components/postPage";
import { PageButton } from "../components/page";

const ProfilePostAPI = ()=>{
    const accessToken = localStorage.getItem("access");
    const {option} = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    let userId = checkToken(accessToken)
    let url = `/post/profile/${userId}?option=${option}`
    useEffect(()=>{
        console.log(userId,option,url)
        axios.get(`${url}`,
        {headers:{Authorization:`Bearer ${accessToken}`}}).then(response => {
                setData([...response.data.results]);
                setCount(response.data.count);
                if (response.data.next != null){
                    setNext(response.data.next.split("=")[1]);
                }
                if (response.data.previous != null){
                setPrevious(response.data.previous.split("=")[1]);
                }
                console.log(response.data.results)
            }
        ).catch(error=>{
            if (error.response.status === 401){
                navigate('/login');
            }
            console.error('error: ', error)
        })
    },[option]);

    if (option==="post" | option === "like"){
        return (  
            <PostPage data={data} userId={userId} >
                <PageButton count={count} next={next} previous={previous} setData={setData} url={url}></PageButton>
            </PostPage>
        )
    } else {
        return (
            <RecruitPage data={data}>
                <PageButton count={count} next={next} previous={previous} setData={setData} url={url}></PageButton>
            </RecruitPage>
        )
    }
}



export {ProfilePostAPI}