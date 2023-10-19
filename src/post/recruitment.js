import React, {useState, useEffect} from "react"
import {useParams, useNavigate} from "react-router-dom"
import axios from "axios"
import moment from "moment";
import "./post.css"

const accessToken = localStorage.getItem("access")

const RecruitmentAPI = ()=>{
    const navigate = useNavigate();

    const [data, setData] = useState([]);

    useEffect(()=>{
        axios.get('/post/recruit',{
            headers:{
                "Authorization" : `Bearer ${accessToken}`
            }
        }).then(
            response => {
                setData([...response.data]);
                console.log(response)
            }
        ).catch(error=>{
            console.error('error: ', error)
        })
    },[]);
    return (
        <>
        <div className="post-list">
            <div>
                <button onClick={()=>{navigate('/new/recruit')}}>모집공고 쓰기</button>
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
    const [data, setData] = useState("");
    const {recruitId} = useParams();

    useEffect(()=>{
        axios.get(`/post/recruit/${recruitId}`).then(
            response => {
                console.log(response)
                setData(response.data);
            }
        ).catch(error=>{
            console.error('error: ', error)
        })
    },[]);
    return (
        <>
        <div className="post-detail">
            <div>
                <input className="form-control" value={`모임 이름 :${data.group["group_name"]}`} readonly/>
                <input className="form-control" value={`모집인원 : ${data.number_of_recruits}`} readonly/>
                <input className="form-control" value={`제목 : ${data.title}`} readonly/>
                <textarea className="form-control" value={data.content} readonly/>
            </div>
            <button>수정하기</button>
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
                <input className="form-control" placeholder="모집 인원" onChange={onNumberOfRecruitsHandler} value={numberOfRecruits}/>
                <input className="form-control" placeholder="제목" onChange={onTitlHandler} value={title}/>
                <textarea className="form-control" rows={15} onChange={onContentHandler} value={content}/>
            </div>
            <button className="my-btn" onClick={onWriteRecruitment}>저장하기</button>
        </div>
        </>
    )
}

export {RecruitmentAPI, RecruitmentDetailAPI, NewRecruitmentAPI};