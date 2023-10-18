import React, {useState, useEffect} from "react"
import {useParams, useNavigate} from "react-router-dom"
import axios from "axios"
import moment from "moment";
import "./post.css"

const accessToken = localStorage.getItem("access")

const PostAPI = ()=>{
    const navigate = useNavigate();

    const [data, setData] = useState([]);

    useEffect(()=>{
        axios.get('/post/',{
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
                <button onClick={()=>{navigate('/new/post')}}>글 쓰기</button>
            </div>
        {data.map((post) => (
                <div className="post-item">
                    <b><a href={`/post/${post.id}`}>{post.title}</a></b>
                    { post.author.nickname===""
                    ?(<p> unknown / {moment(post.created_at).format("YYYY-MM-DD")}</p>)
                    :(<p>{post.author.nickname} / {moment(post.created_at).format("YYYY-MM-DD")}</p>)}
                </div>
        ))}
        </div>
        </>
    )
}

const PostDetailAPI = ()=>{
    // css 수정
    const [data, setData] = useState("");
    const {postId} = useParams();

    useEffect(()=>{
        axios.get(`/post/${postId}`,{
            headers:{
                "Authorization" : `Bearer ${accessToken}`
            }
        }).then(
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
            <input className="form-control" value={`제목 : ${data.title}`} readonly/>
            <textarea className="form-control" value={data.content} readonly/>
        </div>
        </>
    )
}

const NewPostAPI = ()=>{
    //추가해야할 부분
    // category 가져와서 select option 추가
    const navigate = useNavigate();

    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const onTitlHandler = (event) => {
        setTitle(event.currentTarget.value);
    }
    const onContentHandler = (event) => {
        setContent(event.currentTarget.value);
    }
    const onCategoryHandler = (event) => {
        setCategory(event.currentTarget.value);
    }

    const writePost = async(category, title, content)=>{
        const res = await axios.post('/post/',{category,title,content},
        {headers:{"Authorization": `Bearer ${accessToken}`}})

        if(res.status===201){
            navigate('/post')
        }else{
            alert(res.data)
        }
    }

    const onWritePost = ()=>{
        writePost(category,title,content)
    }

    return (
        <>
        <div className="post-detail">
            <div>
                <h3 className="text-center">글 작성하기</h3>
                <select class="form-select" aria-label="Default select example" onChange={onCategoryHandler} value={category}>
                    <option selected>Open this select menu</option>
                </select>   
                <input className="form-control" placeholder="제목" onChange={onTitlHandler} value={title}/>
                <textarea className="form-control" rows={15} onChange={onContentHandler} value={content}/>
            </div>
            <button className="my-btn" onClick={onWritePost}>저장하기</button>
        </div>
        </>
    )
}

export {PostAPI,PostDetailAPI,NewPostAPI};