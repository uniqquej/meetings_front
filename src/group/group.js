import axios from "axios";
import moment from "moment";
import React,{useState,useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom"

import "../group/group.css"
import InputBox from "../components/input";

const GroupDetail = ()=>{
    const navigate = useNavigate();
    const {groupId} = useParams();
    const [data, setData] = useState("");
    const [meetings, setMeetings] = useState([]);
    const [notices, setNotices] = useState([]);

    useEffect(()=>{
        axios.get(`/group/${groupId}`).then(response=>{
            console.log(response)
            setData(response.data);
            setMeetings(response.data.meeting_set);
            setNotices(response.data.notice_set)
        }).catch(error=>{
            console.error(error);
        })
    },[groupId])

    return (
        <div className="group-info">
            <div className="group-header">
                <button className="my-btn" onClick={()=>{navigate(`/chat/${data.group_name}`)}}>{data.group_name} 채팅방</button>
            </div>
            <Notice notices={notices}/>
            <Meeting meetings={meetings}/>
            <ToDoList />
            
        </div>
    )
}

const Notice = (probs)=>{
    return (
        <div className="group-notice text-center">
               <h4>{'<'+'notice'+'>'}</h4>
               {probs.notices.map((notice)=>(
                    <button className="list-btn"  key={notice.id}>{notice.title}</button>
                ))}
        </div>
    )
}

const Meeting = (probs)=>{
    return (
        <div className="group-meeting text-center">
               <h4>{'<'+'meeting'+'>'}</h4>
               {probs.meetings.map((meeting)=>(
                    <button className="list-btn" key={meeting.id}>{moment(meeting.time_to_meet).format("YYYY-MM-DD HH:MM")} | {meeting.title}</button>
                ))}
        </div>
    )
}

const ToDoList = (probs)=>{
    return (
        <div className="group-todo text-center">
            <h4>{'<'+'to do list'+'>'}</h4>
            <h4>{moment().format('YYYY-MM-DD')} </h4>
        </div>
    )
}

const CreateGroup = ()=>{
    const accessToken = localStorage.getItem("access");
    const [groupName, setGroupName] = useState(""); 

    const onGroupNameHandler = (event)=>{
        setGroupName(event.currentTarget.value);
    }

    const saveGroup = (groupName)=>{
        axios.post('/group/',{group_name : groupName},{headers:{
            Authorization:`Bearer ${accessToken}`
        }}).then(response =>{
            console.log(response)
            if(response.status ===200 ){
                setGroupName("");
                alert(`${groupName} 생성`);
            }
        })
            .catch(error=>{console.log(error)})
    }
    
    return (
        <div className="post-list text-center">
            <div style={{width:"70%",margin:"50px auto"}}>
                <h3>새로운 그룹 만들기</h3>
                <InputBox readOnly={false} name="groupNameInput" value={groupName}  onChange={onGroupNameHandler} labelName="그룹 이름"/>
                <button className="my-btn" onClick={()=>{saveGroup(groupName)}}>만들기</button>
            </div>
        </div>
    )
}

export {GroupDetail, CreateGroup};