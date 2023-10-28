import React from "react";
import axios from "axios";
import { useState, useEffect} from "react";

import InputBox from "../components/input";

const accessToken = localStorage.getItem("access");

const EditProfile = ()=>{
    const [nickname,setNickname]=useState("");
    const [password,setPassword]=useState("****");
    const [phoneNumber,setPhoneNumber]=useState("");
    const [editMode, setEditMode] = useState(false);

    const onNicknameHandler = (e)=>{
        setNickname(e.currentTarget.value);
    }

    const onPasswordHandler = (e)=>{
        setPassword(e.currentTarget.value);
    }

    const onPhoneNumber = (e)=>{
        setPhoneNumber(e.currentTarget.value);
    }

    useEffect(()=>{
        axios.get('/user/my-page',{headers:{Authorization:`Bearer ${accessToken}`}})
            .then(response=>{
                console.log(response.data)
                setNickname(response.data.nickname)
                setPhoneNumber(response.data.phone_number)})
            .catch(error=>{console.error(error)})

    },[])

    return (
        <>
        {!editMode? (<div className="post-list">
                        <InputBox readOnly={true} name="nicknameInput" value={nickname} labelName="닉네임"/>
                        <InputBox readOnly={true} name="pwInput" value="********" labelName="비밀번호"/>
                        <InputBox readOnly={true} name="phoneNumberInput" value={phoneNumber} labelName="phone"/>
                        <button className="my-btn" onClick={()=>{setEditMode(true)}}>수정 하기</button>
                    </div>)
                :(<div className="post-list">
                <InputBox readOnly={false} name="nicknameInput" onChange={onNicknameHandler} value={nickname} labelName="닉네임"/>
                <InputBox type="password" readOnly={false} name="pwInput" onChange={onPasswordHandler} value={password} labelName="비밀번호"/>
                <InputBox readOnly={false} name="phoneNumberInput" onChange={onPhoneNumber} value={phoneNumber} labelName="phone"/>
                <button className="my-btn" onClick={()=>{setEditMode(false)}}>저장 하기</button>
            </div>
                )}
        </>
    )
}

export {EditProfile};