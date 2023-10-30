import "./frame.css";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyPageLayout = ({children})=>{
    const accessToken = localStorage.getItem("access");
    const userId = JSON.parse(localStorage.getItem('payload')).user_id;
    const navigate = useNavigate();
    return (
        <div className="App">
            <div className="header">
                <h2><a href="/" id="logo">MEETING</a></h2>
                <div>
                <button className="my-btn"onClick={()=>{navigate(`/my/${userId}`)}} >마이페이지</button>
                <button className="my-btn">로그아웃</button>
                </div>
            </div>
            <div className="navi">
                <MyPageNav/>
            </div>
                <div className="body">
                    {children}
                </div>
 
        </div>
    )
}

const MyPageNav = ()=>{

    return(
        <div className="accordion" id="accordionFlushExample">
            <MyGroup/>
            <MyInfo/>
        </div>
    );
}

const MyGroup = ()=> {
    const accessToken = localStorage.getItem("access");
    const navigate = useNavigate();
    const [data,setData]=useState([]);

    useEffect(()=>{
        axios.get('/group/',{headers:{Authorization:`Bearer ${accessToken}`}}).then(
            response =>{
                setData([...response.data]);
            }).catch(
                error =>{
                    console.error(error)
                }
            )
    },[]);

  return (
        <div className="accordion-item">
            <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#group-list" aria-expanded="false" aria-controls="group-list">
                My Group
            </button>
            </h2>
            <div id="group-list" className="accordion-collapse collapse show">
                <div className="accordion-body nav flex-column">
                    {
                      data.map(group=>(
                        <button key={group.id} className="nav-item" style={{width:'100%', fontSize:'18px'}}
                        onClick={()=>{navigate(`/group/${group.id}`)}}>{group.group_name}</button>
                      ))  
                    }
                </div>
            </div>
        </div>
            

  );
}

const MyInfo = ()=>{
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("access");
    const userId = JSON.parse(localStorage.getItem('payload')).user_id;
    return (
        <>
        <div className="accordion-item">
            <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#my-info" aria-expanded="false" aria-controls="group-list">
                개인 정보
            </button>
            </h2>
            <div id="my-info" className="accordion-collapse collapse show">
                <div className="accordion-body nav flex-column">
                    <button className="nav-item" style={{width:'100%', fontSize:'18px'}}
                    onClick={()=>{navigate(`/my/${userId}`)}}>개인정보 수정</button>
                    <button className="nav-item" style={{width:'100%', fontSize:'18px'}}
                    onClick={()=>{navigate(`/group/new`)}}>그룹 만들기</button>
                </div>
            </div>
        </div>

        <div className="accordion-item">
            <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#my-active" aria-expanded="false" aria-controls="group-list">
                나의 활동
            </button>
            </h2>
            <div id="my-active" className="accordion-collapse collapse show">
                <div className="accordion-body nav flex-column">
                    <button className="nav-item" style={{width:'100%', fontSize:'18px'}}
                    onClick={navigate(``)}>내가 작성한 글</button>
                    <button className="nav-item" style={{width:'100%', fontSize:'18px'}}
                    onClick={navigate(``)}>내가 지원한 글</button>
                    <button className="nav-item" style={{width:'100%', fontSize:'18px'}}
                    onClick={navigate(``)}>좋아요한 글</button>
                </div>
            </div>
        </div>
        </>    
  );
}

export {MyPageLayout}