import React, {useState, useEffect} from "react"
import {useParams, useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux";
import axios from "axios"
import moment from "moment";
import "./post.css"
import InputBox from "../components/input";

const accessToken = localStorage.getItem("access");

let userId;
if (accessToken){
    userId = JSON.parse(localStorage.getItem('payload')).user_id;
}

const RecruitmentAPI = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const category = useSelector((state)=> state.selectedCategory);

    const [data, setData] = useState([]);
    const [searchWord, setSearchWord] = useState("");

    const searchHandler = (event) => {
        setSearchWord(event.currentTarget.value);
    }

    const searchKeyword = async(keyword)=>{
        let params = {search:keyword, category:category}
        const res = await axios.get('/post/recruit',
        {params});
        if (res.status === 200){
            setData([...res.data]);
            return (
                <>
                <div className="post-list">
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
                {data.map((recruitment) => (
                        <div className="post-item" key={recruitment.id}>
                            <b><a href={`/recruit/${recruitment.id}`}>{recruitment.title}</a></b>
                            { recruitment.author.nickname===""
                            ?(<p> unknown / {moment(recruitment.created_at).format("YYYY-MM-DD")}</p>)
                            :(<p>{recruitment.author.nickname} / {moment(recruitment.created_at).format("YYYY-MM-DD")}</p>)}
                            <p>({recruitment.applicant_count}/{recruitment.number_of_recruits})</p>
                        </div>
                ))}
                </div>
                </>
            )
        }
    }

    useEffect(()=>{
        let params = {category:category};
        axios.get('/post/recruit',{params}).then(
            response => {
                setData([...response.data]);
                console.log(response)
            }
        ).catch(error=>{
            console.error('error: ', error)
        })
    },[category]);
    return (
        <>
        <div className="post-list text-center">
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
        {data.map((recruitment) => (
                <div className="post-item" key={recruitment.id}>
                    <b><a href={`/recruit/${recruitment.id}`}>{recruitment.title}</a></b>
                    { recruitment.author.nickname===""
                    ?(<p> unknown / {moment(recruitment.created_at).format("YYYY-MM-DD")}</p>)
                    :(<p>{recruitment.author.nickname} / {moment(recruitment.created_at).format("YYYY-MM-DD")}</p>)}
                    <p>({recruitment.applicant_count}/{recruitment.number_of_recruits})</p>
                </div>
        ))}
        </div>
        </>
    )
}

const RecruitmentDetailAPI = ()=>{
    // css 수정
    const {recruitId} = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [numberOfRecruits, setNumberOfRecruits] = useState("");
    const [groupName, setGroupName] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [author, setAuthor] = useState("");

    const onTitlHandler = (event) => {
        setTitle(event.currentTarget.value);
    }
    const onContentHandler = (event) => {
        setContent(event.currentTarget.value);
    }

    const onNumberOfRecruitsHandler = (event) => {
        setNumberOfRecruits(event.currentTarget.value);
    }
    const onGroupNameHandler = (event) => {
        setGroupName(event.currentTarget.value);
    }
    

    useEffect(()=>{
        axios.get(`/post/recruit/${recruitId}`).then(
            response => {
                console.log(response)
                setGroupName(response.data.group.group_name)
                setNumberOfRecruits(response.data.number_of_recruits)
                setTitle(response.data.title)
                setContent(response.data.content)
                setAuthor(response.author)
            }
        ).catch(error=>{
            console.error('error: ', error)
        })
    },[]);

    const editRecruitment = async(number_of_recruits,title,content)=>{
        const res = await axios.put(`/post/recruit/${recruitId}`, {
            number_of_recruits : number_of_recruits,
            title:title,
            content:content
        },{
            headers: {
                "Authorization":`Bearer ${accessToken}`
            }
        })
        console.log('edit res',res)
    }
    return (
        <>
        <div className="post-detail">
               { editMode ? (
                <div>
                    <InputBox readOnly={false} name="groupInput" value={groupName} labelName="모임 이름" change={onGroupNameHandler}/>
                    <InputBox readOnly={false} name="numberInput" value={numberOfRecruits} labelName="모집 인원" change={onNumberOfRecruitsHandler}/>
                    <InputBox readOnly={false} name="titleInput" value={title} labelName="제목" change={onTitlHandler}/>
                    <textarea className="form-control" value={content} onChange={onContentHandler} rows={10}/>
                    <button className="my-btn" onClick={()=>{
                        setEditMode(false)
                        editRecruitment(numberOfRecruits,title,content);
                        }}>저장하기</button>
                </div>
                ):
                (<div>
                    <InputBox readOnly={true} name="groupInput" value={groupName} labelName="모임 이름"/>
                    <InputBox readOnly={true} name="numberInput" value={numberOfRecruits} labelName="모집 인원"/>
                    <InputBox readOnly={true} name="titleInput" value={title} labelName="제목"/>
                    <textarea className="form-control" value={content}  rows={10} readonly/>
                    {userId===author?<button className="my-btn" onClick={()=>{setEditMode(true)}}>수정하기</button>:""}
                </div>
                )
                }
        </div>
        </>
    )
}

const NewRecruitmentAPI = ()=>{
    //추가해야할 부분
    // category 가져와서 select option 추가
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
    const onCategoryHandler = (event) => {
        setCategory(event.currentTarget.value);
    }
    const onNumberOfRecruitsHandler = (event) => {
        setNumberOfRecruits(event.currentTarget.value);
    }
    const onGroupHandler = (event) => {
        setGroup(event.currentTarget.value);
    }

    const writeRecruitment = async(category, title, content, number_of_recruits, group)=>{
        const res = await axios.post('/post/',{category,title,content,number_of_recruits,group},
        {headers:{"Authorization": `Bearer ${accessToken}`}})

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
                <select className="form-select" aria-label="Default select example" onChange={onCategoryHandler} value={category}>
                    <option selected>Open this select category</option>
                </select>
                <select className="form-select" aria-label="Default select example" onChange={onGroupHandler} value={group}>
                    <option selected>Open this select group</option>
                </select>
                <InputBox readOnly={false} name="numberInput" value={numberOfRecruits} labelName="모집 인원" change={onNumberOfRecruitsHandler}/>
                <InputBox readOnly={false} name="titleInput" value={title} labelName="제목" change={onTitlHandler}/>
                <textarea className="form-control" rows={15} onChange={onContentHandler} value={content}/>
            </div>
            <button className="my-btn" onClick={onWriteRecruitment}>저장하기</button>
        </div>
        </>
    )
}


export {RecruitmentAPI, RecruitmentDetailAPI, NewRecruitmentAPI};