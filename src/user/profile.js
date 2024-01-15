import React from "react";
import axios from "axios";
import { useState, useEffect} from "react";

import InputBox from "../components/input";
import { checkToken } from "../utils/checkToken";

const EditProfile = ()=>{
    const accessToken = localStorage.getItem("access");
    const [nickname,setNickname]=useState("");
    const [password,setPassword]=useState("****");
    const [phoneNumber,setPhoneNumber]=useState("");
    const [editMode, setEditMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const onNicknameHandler = (e)=>{
        setNickname(e.currentTarget.value);
    }

    const onPasswordHandler = (e)=>{
        setPassword(e.currentTarget.value);
    }

    const saveEdit = (nickname,password)=>{
        const editData = {nickname};
        
        if (password !== '****'){
            editData["password"] = password;
        }
        axios.put('/user/my-page',editData,{
            headers:{Authorization:`Bearer ${accessToken}`}
        }).then(response=>{
            if(response.status===202){
                setEditMode(false);
                alert("수정 완료");
            }
        }).catch(error=>{
            setErrorMessage(error.response.data.non_field_errors);
            alert(errorMessage);
        })
    }

    useEffect(()=>{
        checkToken(accessToken);
        axios.get('/user/my-page',{headers:{Authorization:`Bearer ${accessToken}`}})
            .then(response=>{
                setNickname(response.data.nickname)
                setPhoneNumber(response.data.phone_number)})
            .catch(error=>{console.error(error)})

    },[])

    return (
        <>
        {!editMode? (<div className="post-list text-center">
                        <div style={{width:"70%",margin:"50px auto"}}>
                            <InputBox readOnly={true} name="phoneNumberInput" value={phoneNumber} labelName="phone"/>
                            <InputBox readOnly={true} name="nicknameInput" value={nickname} labelName="닉네임"/>
                            <InputBox readOnly={true} name="pwInput" value="********" labelName="비밀번호"/>
                            <button className="my-btn" onClick={()=>{setEditMode(true)}}>수정 하기</button>
                        </div>
                    </div>)
                :(<div className="post-list text-center">
                    <div style={{width:"70%",margin:"50px auto"}}>
                        <InputBox readOnly={false} name="nicknameInput" onChange={onNicknameHandler} value={nickname} labelName="닉네임"/>
                        <InputBox type="password" readOnly={false} name="pwInput" onChange={onPasswordHandler} value={password} labelName="비밀번호"/>
                        <button className="my-btn" onClick={()=>{
                            saveEdit(nickname,password)
                            }}>저장 하기</button>
                        <button className="my-btn" onClick={()=>{setEditMode(false)}}>취소하기</button>
                    </div>
            </div>
                )}
        </>
    )
}

export {EditProfile};