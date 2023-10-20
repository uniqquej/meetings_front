import axios from "axios";
import moment from "moment";
import React,{useState,useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom"

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
        <div className="post-list">
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

    useEffect(()=>{
        axios.get(`/group/${groupId}`).then(response=>{
            console.log(response)
            setData(response.data);
            setMeetings(response.data.meeting_set)
        }).catch(error=>{
            console.error(error);
        })
    },[])

    return (
        <div className="post-list row">
            <div className="col">
                {data.group_name}
                <button className="my-btn" onClick={naveigate(`/chat/${data.group_name}`)}>채팅방 입장</button>
            </div>
            <div className="col">
                {meetings.map((meeting)=>(
                    <p key={meeting.id}>{moment(meeting.time_to_meet).format("YYYY-MM-DD HH:MM")} | {meeting.title}</p>
                ))}
            </div>
        </div>
    )
}

export {GroupList, GroupDetail};