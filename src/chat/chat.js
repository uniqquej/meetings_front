import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../chat/chat.css"
import axios from "axios";

const ChatLog = ()=>{
    const accessToken = localStorage.getItem("access");
    const userName = JSON.parse(localStorage.getItem('payload')).nickname;
    const [messageLogs, setMessageLogs] = useState([]);
    const {roomId} = useParams();
    useEffect(()=>{
        axios.get(`/chat/${roomId}`,{
            headers:{Authorization:`Bearer ${accessToken}`}
        }).then(response=>{
            console.log(response.data)
            setMessageLogs(response.data);
        }).catch(e=>{
            console.error('error:', e)
        })
    },[])
    
    return (
        <>
            {messageLogs.map((message,index)=>(
                userName===message.chatter.nickname
                ?<div key={index}>
                    <div className="chat-right">{message.message}</div>
                </div>
                :<div key={index}>
                    {message.chatter.nickname}
                    <div className="chat-left">{message.message}</div>
                </div>
            ))}
        
        </>
    )

}

const Socket = ()=>{
    const accessToken = localStorage.getItem("access");
    const userName = JSON.parse(localStorage.getItem('payload')).nickname;
    const navigate = useNavigate();
    const {roomId} = useParams();
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);
    const [textMessage, setTextMessage] = useState("");

    const onTextHandler = (event)=>{
        setTextMessage(event.currentTarget.value);
    }

    const sendMessage = (msg)=>{
        ws.send(JSON.stringify({
            'type': 'send_message',
            'message': msg,
            'sender':userName
        }));
        setTextMessage("");
    }

    useEffect(()=>{
        if(accessToken===null){
            navigate('/login');
        }
        const socketUrl = `ws://127.0.0.1:8000/ws/chat/${roomId}/?token=${accessToken}`
        const websocket = new WebSocket(socketUrl);
        setWs(websocket);
    },[]);

    useEffect(()=>{
        if(ws){
            ws.onopen = function(e){
                console.log('open')
            }
            ws.onmessage= function(e){
                const message = JSON.parse(e.data).message;
                const sender = JSON.parse(e.data).sender;
                console.log('m',message,'s',sender)
                setMessages(prevMessages => [...prevMessages, { sender: sender, message: message }]);
            };
        }
    },[ws]);

    return(
        <>
        <div className="chat-box">
        <ChatLog/>
        {messages.map((message, index) => (
            userName===message.sender
            ?<div key={index}>
                <div className="chat-right">{message.message}</div>
            </div>
            :<div key={index}>
                {message.sender}
                <div className="chat-left">{message.message}</div>
            </div>
        ))}
        </div>
        <div>
            <input value={textMessage} onChange={onTextHandler}/>
            <button className="my-btn" onClick={()=>{sendMessage(textMessage)}}>전송</button>
        </div>
        </>
    );
}

export {Socket}