import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";

import "../chat/chat.css"

const accessToken = localStorage.getItem("access");
let userId;
if (accessToken){
    userId = JSON.parse(localStorage.getItem('payload')).user_id;
}
const Socket = ()=>{
    const {roomName} = useParams();
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
            'sender':userId
        }));
        setTextMessage("");
    }

    useEffect(()=>{
        const socketUrl = `ws://127.0.0.1:8000/ws/chat/${roomName}/?token=${accessToken}`
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
        {messages.map((message, index) => (
            <div key={index}>{message.sender} <span className="chat">{message.message}</span></div>
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