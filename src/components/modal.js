import React, { useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import InputBox from "./input";

const NewNoticeModal = (probs)=>{
    const {groupId} = useParams();
    const {closeModal} = probs;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    
    const onTitleHandler = (event)=>{
        setTitle(event.currentTarget.value);
    }
    
    const onContentHandler = (event)=>{
        setContent(event.currentTarget.value);
    }
    
    const writeNotice = (groupId)=>{
        const accessToken = localStorage.getItem('access');

        axios.post(`/group/${groupId}/notice`,{title, content, group:groupId},
        {headers:{Authorization:`Bearer ${accessToken}`}})
        .then(response=>{if(response.status===201){
                            window.location.reload();}})
    }
    return (
        <div className="my-modal">
            <div>
                <InputBox readOnly={false} name="modalTitle" value={title} labelName="제목" onChange={onTitleHandler}/>
                <textarea className="form-control" rows={5} value={content} onChange={onContentHandler}/>
            </div>
            <div>
                <button className="my-btn" onClick={()=>{writeNotice(groupId)}}>저장하기</button>
            </div>
            
            <button className="my-btn" onClick={()=>{closeModal(false)}}>닫기</button>
        </div>                
    )
}
const NoticeDetailModal = (probs)=>{
    const {noticeId, title, content, date, closeModal, isLeader} = probs;
    const [editMode, setEditMode] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [newContent, setNewContent] = useState(content);

    const onTitleHandler = (event)=>{
        setNewTitle(event.currentTarget.value);
    }

    const onContentHandler = (event)=>{
        setNewContent(event.currentTarget.value);
    }

    const deleteNotice = (noticeId)=>{
        const accessToken = localStorage.getItem('access');

        axios.delete(`/group/notice/${noticeId}`,{headers:{Authorization:`Bearer ${accessToken}`}})
        .then(response=>{if(response.status===204){window.location.reload();}})
    }

    const editNotice = (noticeId)=>{
        const accessToken = localStorage.getItem('access');

        axios.put(`/group/notice/${noticeId}`,{title:newTitle, content:newContent},
        {headers:{Authorization:`Bearer ${accessToken}`}})
        .then(response=>{if(response.status===202){
                            alert('수정완료')
                            window.location.reload();}})
    }
    return (
        <div className="my-modal">
            {editMode ?(<>
                        <div>
                            <InputBox readOnly={false} name="modalTitle" value={newTitle} labelName="제목" onChange={onTitleHandler}/>
                            <textarea className="form-control" rows={5} value={newContent} onChange={onContentHandler}/>
                        </div>
                        <div>
                            <button className="my-btn" onClick={()=>{editNotice(noticeId)}}>수정 완료</button>
                        </div>
                        </>)
                :(<>
                    <div>
                        <InputBox readOnly={true} name="modalDate" value={moment(date).format('YYYY-MM-DD')} labelName="작성일"/>
                        <InputBox readOnly={true} name="modalTitle" value={newTitle} labelName="제목"/>
                        <textarea className="form-control" rows={5} value={newContent} readOnly/>
                    </div>
                    <div>
                        {isLeader ?(<>
                                <button className="my-btn" onClick={()=>{
                                    const checkDelete = window.confirm('정말 삭제하시겠습니까?');
                                    if(checkDelete){deleteNotice(noticeId)}}
                                }>삭제</button>
                                <button className="my-btn" onClick={()=>{setEditMode(true)}}>수정</button>
                                </>)
                            :null}
                        <button className="my-btn" onClick={()=>closeModal(noticeId)}>닫기</button>
                    </div>
                </>)
            }
            
        </div>
    )
}

export {NoticeDetailModal, NewNoticeModal}