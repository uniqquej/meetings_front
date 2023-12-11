import "./frame.css";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, NavLink} from "react-router-dom";
import { checkToken } from "../utils/checkToken";

const activeStyle = {
    width: "100%",
    fontSize:'18px',
    textAlign: "center",
    padding: "3px",
    border: "none",
    borderBottom: "1px solid white",
    backgroundColor: "white",
    color: "#282c34"
}

const MyPageLayout = ({children})=>{
    const accessToken = localStorage.getItem("access");
    let userId;
    const navigate = useNavigate();

    if(checkToken(accessToken)){
        userId = JSON.parse(localStorage.getItem('payload')).user_id;
    }

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
                        <NavLink key={group.id} className="nav-item" style={({isActive})=>(isActive? activeStyle :{})}
                        to='/group/${group.id}'>{group.group_name}</NavLink>
                      ))  
                    }
                </div>
            </div>
        </div>
            

  );
}

const MyInfo = ()=>{
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
                    <NavLink className="nav-item" style={({isActive})=>(isActive? activeStyle :{})}
                    to='/my/${userId}'>개인정보 수정</NavLink>
                    <NavLink className="nav-item" style={({isActive})=>(isActive? activeStyle :{})}
                    to='/group/new'>그룹 만들기</NavLink>
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
                    <NavLink className="nav-item" style={({isActive})=>(isActive? activeStyle :{})}
                    to='/my/${userId}/post'>내가 작성한 글</NavLink>
                    <NavLink className="nav-item" style={({isActive})=>(isActive? activeStyle :{})}
                    to='/my/${userId}/recruitment'>내가 작성한 모집공고</NavLink>
                    <NavLink className="nav-item" style={({isActive})=>(isActive? activeStyle :{})}
                    to='/my/${userId}/apply'>내가 지원한 글</NavLink>
                    <NavLink className="nav-item" style={({isActive})=>(isActive? activeStyle :{})}
                    to='/my/${userId}/like'>좋아요한 글</NavLink>
                    
                </div>
            </div>
        </div>
        </>    
  );
}

export {MyPageLayout}