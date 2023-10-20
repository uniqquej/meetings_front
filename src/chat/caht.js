import React, {useEffect, useState} from "react";


const socket = ()=>{
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(()=>{
        const websocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
        setWs(websocket);
    },[]);

    useEffect(()=>{
        if(ws){
            ws.onmessage= function(e){
                const message = JSON.parse(e.data).message;
                setMessages(prevMessages => [...prevMessages, message]);
            };
        }
    },[ws]);

    return(
        <div>
        {messages.map((message, index) => (
            <div key={index}>{message}</div>
        ))}
        </div>
    );
}