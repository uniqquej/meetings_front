import React, {useState, useEffect} from "react"
import {useParams, useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux";
import axios from "axios"

import "./post.css"
import { PageButton } from "../components/page";
import { RecruitPage } from "../components/postPage";
import InputBox from "../components/input";
import { SelectBox } from "../components/frame";
import GroupSelector from "../components/groupSelector";
import { checkToken } from "../utils/checkToken";

const RecruitmentAPI = ()=>{
    let userId;
    const accessToken = localStorage.getItem("access");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const category = useSelector((state)=> state.selectedCategory);
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);

    const [data, setData] = useState([]);
    const [searchWord, setSearchWord] = useState("");

    const searchHandler = (event) => {
        setSearchWord(event.currentTarget.value);
    }

    const searchKeyword = async(keyword)=>{
        let params = {search:keyword, category:category}
        const res = await axios.get('/recruit',
        {params});
        if (res.status === 200){
            setData([...res.data.results]);
        }
    }

    userId = checkToken(accessToken);

    useEffect(()=>{
        let config = {
            headers:{Authorization:`Bearer ${accessToken}`},
            params:{
                category:category
            }
        }
        axios.get('/recruit',config).then(
            response => {
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
            console.error('error: ', error)
        })
    },[category]);
    return (
    <>
        <RecruitPage data={data}>
            <div>
                <button className="my-btn" onClick={()=>{navigate('/new/recruit')}}>모집공고 쓰기</button>
                <button className="my-btn" onClick={()=>{
                    navigate('/');
                    dispatch({type:'select_category', selectedCategory:undefined});}}>게시글 보기</button>
                <div className="input-group search-box">
                    <input type="text" className="form-control" placeholder="검색어를 입력해주세요"
                    value={searchWord} onChange={searchHandler}/>
                    <button className="btn btn-outline-secondary" type="button" onClick={()=>{searchKeyword(searchWord)}}>Search</button>
                </div>
            </div>
        </RecruitPage>
        <PageButton count={count} setData={setData} url="/recruit/"></PageButton>
    </>
    )
}
const RecruitmentDetailAPI = ()=>{
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

    const applyRecruitment = async()=>{
        const res = await axios.post(`/recruit/${recruitId}/applicate`,{},{
            headers:{Authorization:`Bearer ${accessToken}`}
        })
        if(res.status === 201){
            setCheckApplicate(true)
        } else if (res.status === 204){
            setCheckApplicate(false)
        }
    }
    return (
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
                    {userId===author
                    ?(<div>
                        <button className="my-btn" onClick={()=>{setEditMode(true)}}>수정하기</button>
                        <button className="my-btn" onClick={()=>{deleteRecruitment(recruitId)}}>삭제하기</button>
                    </div>)
                    :(!checkApplicate?<button className="my-btn" onClick={applyRecruitment}>지원 하기</button>
                                    :<button className="my-btn" onClick={applyRecruitment}>지원 완료</button>)}
                </div>
                )}
        </div>
        </>
    )
}

const NewRecruitmentAPI = ()=>{
    const accessToken = localStorage.getItem("access");
    const navigate = useNavigate();

    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [numberOfRecruits, setNumberOfRecruits] = useState("");
    const [group, setGroup] = useState("");

    const onTitlHandler = (event) => {
        setTitle(event.currentTarget.value);
    }
    const onContentHandler = (event) => {
        setContent(event.currentTarget.value);
    }
    const onCategorySelector = (selectedValue) => {
        setCategory(selectedValue);
    }
    const onNumberOfRecruitsHandler = (event) => {
        setNumberOfRecruits(event.currentTarget.value);
    }
    const onGroupSelector = (selectedValue) => {
        setGroup(selectedValue);
    }

    const writeRecruitment = async(category, title, content, number_of_recruits, group)=>{
        const res = await axios.post('/recruit/',{category,title,content,number_of_recruits,group},
        {headers:{Authorization: `Bearer ${accessToken}`}})

        if(res.status===201){
            navigate('/recruit')
        }else{
            alert(res.data)
        }
    }

    const onWriteRecruitment = ()=>{
        writeRecruitment(category,title,content, numberOfRecruits,group)
    }

    return (
        <>
        <div className="post-detail">
            <div>
                <h3 className="text-center">모집글 작성하기</h3>
                <SelectBox onSelect={onCategorySelector} props={{category:category}}/>
                <GroupSelector onSelect={onGroupSelector}/>
                <InputBox readOnly={false} name="numberInput" value={numberOfRecruits} labelName="모집 인원" onChange={onNumberOfRecruitsHandler}/>
                <InputBox readOnly={false} name="titleInput" value={title} labelName="제목" onChange={onTitlHandler}/>
                <textarea className="form-control" rows={15} onChange={onContentHandler} value={content}/>
            </div>
            <button className="my-btn" onClick={onWriteRecruitment}>저장하기</button>
            <button className="my-btn" onClick={()=>{navigate(-1)}}>취소하기</button>
        </div>
        </>
    )
}


export {RecruitmentAPI, RecruitmentDetailAPI, NewRecruitmentAPI};