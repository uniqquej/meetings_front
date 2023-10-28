import axios from "axios";
import moment from "moment";
import React,{useState,useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom"

import "../group/group.css"

const accessToken = localStorage.getItem("access");

const GroupList = ()=>{
    const [groups, setGroups] = useState([]);

    useEffect(()=>{
        axios.get('group/',{
            headers:{
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(response=>{
            console.log(response);
            setGroups([...response.data]);
        }).catch(error=>{
            console.error(error)
        });

    },[])

    return (
        <div className="group-info">
        {groups.map(group => (
                <div className="post-item" key={group.id}>
                    <b><a href={`/group/${group.id}`}>{group.group_name}</a></b>
                </div>
        ))}
        </div>
    )
}

const GroupDetail = ()=>{
    const naveigate = useNavigate();
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
                <button className="my-btn" onClick={()=>{naveigate(`/chat/${data.group_name}`)}}>{data.group_name} 채팅방</button>
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

export {GroupList, GroupDetail};