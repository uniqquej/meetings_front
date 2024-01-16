import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { checkToken } from "../utils/checkToken";
import { PageButton } from "../components/page";
import { PostPage, RecruitPage } from "../components/postPage";
import InputBox from "../components/input";
import { SelectBox } from "../components/frame";

const ProfilePostAPI = ()=>{
    const accessToken = localStorage.getItem("access");
    const {option} = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    let userId = checkToken(accessToken)
    let url = `/post/profile/${userId}?option=${option}`
    useEffect(()=>{
        axios.get(url,
        {headers:{Authorization:`Bearer ${accessToken}`}}).then(response => {
                setData([...response.data.results]);
                setCount(response.data.count);
                if (response.data.next != null){
                    setNext(response.data.next.split("=")[1]);
                }
                if (response.data.previous != null){
                setPrevious(response.data.previous.split("=")[1]);
                }
                console.log(response.data.results)
            }
        ).catch(error=>{
            if (error.response.status === 401){
                navigate('/login');
            }
            console.error('error: ', error)
        })
    },[option]);

    if (option==="post" | option === "like"){
        return (
        <>
            <PostPage data={data} userId={userId} >
            </PostPage>
            <PageButton count={count} next={next} previous={previous} setData={setData} url={url}></PageButton>
        </>
        )
    } else {
        return (
        <>
            <RecruitPage data={data}>
            </RecruitPage>
            <PageButton count={count} next={next} previous={previous} setData={setData} url={url}></PageButton>
        </>
        )
    }
}

const RecruitPageLeaderMode = ()=>{
    const accessToken = localStorage.getItem("access");
    const userId = JSON.parse(localStorage.getItem('payload')).user_id;
    const navigate = useNavigate();
    const {recruitId} = useParams();
    const [categoryName, setCategoryName]= useState("");
    const [categoryId, setCategoryId]= useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [numberOfRecruits, setNumberOfRecruits] = useState("");
    const [groupName, setGroupName] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [author, setAuthor] = useState("");
    const [checkApplicate, setCheckApplicate] = useState(false);

    const onTitlHandler = (event) => {
        setTitle(event.currentTarget.value);
    }
    const onContentHandler = (event) => {
        setContent(event.currentTarget.value);
    }
    const onNumberOfRecruitsHandler = (event) => {
        setNumberOfRecruits(event.currentTarget.value);
    }
    const onCategorySelector = (selectedValue) => {
        setCategoryId(selectedValue);
    }
    

    useEffect(()=>{
        axios.get(`/recruit/${recruitId}`).then(
            response => {
                console.log(response)
                setCategoryName(response.data.category.category_name);
                setCategoryId(response.data.category.id);
                setGroupName(response.data.group.group_name);
                setNumberOfRecruits(response.data.number_of_recruits);
                setTitle(response.data.title);
                setContent(response.data.content);
                setAuthor(response.data.author.id);
                setCheckApplicate(response.data.applicant.includes(userId));
            }
        ).catch(error=>{
            console.error('error: ', error)
        })
    },[]);

    const editRecruitment = async(number_of_recruits,title,content,category)=>{
        const res = await axios.put(`/recruit/${recruitId}`, {
            number_of_recruits,title,content,category
        },{
            headers: {Authorization:`Bearer ${accessToken}`}
        })

        if(res.status===202){
            window.location.reload();
        }
    }
    const deleteRecruitment = async(recruitId)=>{
        const res = await axios.delete(`/recruit/${recruitId}`,{
            headers : {Authorization:`Bearer ${accessToken}`}
        })

        if(res.status===204){
            navigate('/recruit')
        }
    }
    return(
        <>
        <div className="post-detail">
            <button className="my-btn" onClick={()=>{navigate(-1);}}>이전 페이지</button>
               { editMode ? (
                   <div className="text-center">
                    <SelectBox onSelect={onCategorySelector} props={{category:categoryId}}/>
                    <InputBox readOnly={true} name="groupInput" value={groupName} labelName="모임 이름"/>
                    <InputBox readOnly={false} name="numberInput" value={numberOfRecruits} labelName="모집 인원" onChange={onNumberOfRecruitsHandler}/>
                    <InputBox readOnly={false} name="titleInput" value={title} labelName="제목" onChange={onTitlHandler}/>
                    <textarea className="form-control" value={content} onChange={onContentHandler} rows={10}/>
                    <button className="my-btn" onClick={()=>{
                        setEditMode(false)
                        editRecruitment(numberOfRecruits,title,content,categoryId);
                        }}>저장하기</button>
                </div>
                ):
                (<div className="text-center">
                    <InputBox readOnly={true} name="categoryInput" value={categoryName} labelName="카테고리"/>
                    <InputBox readOnly={true} name="groupInput" value={groupName} labelName="모임 이름"/>
                    <InputBox readOnly={true} name="numberInput" value={numberOfRecruits} labelName="모집 인원"/>
                    <InputBox readOnly={true} name="titleInput" value={title} labelName="제목"/>
                    <textarea className="form-control" value={content}  rows={10} readOnly/>
                    <div>
                        <button className="my-btn" onClick={()=>{setEditMode(true)}}>수정하기</button>
                        <button className="my-btn" onClick={()=>{deleteRecruitment(recruitId)}}>삭제하기</button>
                    </div>
                    
                </div>
                )}
        </div>
        </>
    )
}



export {ProfilePostAPI, RecruitPageLeaderMode}