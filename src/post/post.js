import React, {useState, useEffect} from "react"
import { useSelector,useDispatch } from "react-redux"
import {useParams, useNavigate} from "react-router-dom"
import axios from "axios"
import moment from "moment";

import "./post.css"
import { PostPage} from "../components/postPage";
import { checkToken } from "../utils/checkToken";
import { SelectBox } from "../components/frame";
import InputBox from "../components/input";
import { PageButton,CommentPageButton } from "../components/page";

const postLike = async(postId)=>{
    const accessToken = localStorage.getItem("access");

    const res = await axios.post(`/post/${postId}/like`,{},{
        headers:{Authorization:`Bearer ${accessToken}`}
    })

    if(res.status===201 | res.status===204){
            return true
        }
}

const PostAPI = ()=>{
    const accessToken = localStorage.getItem("access");
    let userId;
    const dispatch = useDispatch();
    const category = useSelector((state)=> state.selectedCategory);

    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [data, setData] = useState([]);
    const [searchWord, setSearchWord] = useState("");

    const searchHandler = (event) => {
        setSearchWord(event.currentTarget.value);
    }

    if(checkToken(accessToken)){
        userId = JSON.parse(localStorage.getItem('payload')).user_id;
    }

    const searchKeyword = async(keyword)=>{
        let params = {search:keyword, category:category}
        const res = await axios.get(`/post/`,
        {params});
        if (res.status === 200){
            setData([...res.data.results]);
        }
    }

    useEffect(()=>{
        if (localStorage.getItem("access")===null){
            navigate('/login');
        }
        
        let params = {category:category};
        axios.get('/post/',{params}).then(response => {
                console.log(response.data)
                setData([...response.data.results]);
                setCount(response.data.count);
                if (response.data.next != null){
                    setNext(response.data.next.split("=")[1]);
                }
                if (response.data.previous != null){
                setPrevious(response.data.previous.split("=")[1]);
                }
            }
        ).catch(error=>{
            if (error.response.status === 401){
                navigate('/login');
            }
            console.error('error: ', error)
        })
    },[category]);

    return (
        <>
        <PostPage data={data} userId={userId}>
            <div className="text-center">
                <button className="my-btn" onClick={()=>{navigate('/new/post')}}>글 쓰기</button>
                <button className="my-btn" onClick={()=>{
                    navigate('/recruit');
                    dispatch({type:"select_category", selectedCategory:undefined});}}>모집 공고 보기</button>
                <div className="input-group search-box">
                    <input type="text" className="form-control" placeholder="검색어를 입력해주세요"
                    value={searchWord} onChange={searchHandler}/>
                    <button className="btn btn-outline-secondary" type="button" onClick={()=>{searchKeyword(searchWord)}}>Search</button>
                </div>
            </div>
        </PostPage>
        <PageButton count={count} next={next} previous={previous} setData={setData} url="/post/"></PageButton>
        </>
    )
}


const Comments = (probs)=>{
    const accessToken = localStorage.getItem("access");
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [comments, setComments]=useState([]);
    const [comment, setComment]=useState("");

    const onCommentHandler = (event)=>{
        setComment(event.currentTarget.value)
    }
    useEffect(()=>{
        axios.get(`/post/${probs.postId}/comment`,{headers:{Authorization:`Bearer ${accessToken}`}})
            .then(response=>{
                console.log('comment',response)
                setComments([...response.data.results])
                setCount(response.data.count);
                if (response.data.next != null){
                    setNext(response.data.next.split("=")[1]);
                }
                if (response.data.previous != null){
                setPrevious(response.data.previous.split("=")[1]);
                }})
                
    },[]);
    
    const createComment = (postId,comment)=>{
        axios.post(`/post/${postId}/comment`,{comment},{
                    headers:{Authorization:`Bearer ${accessToken}`}
                })
                .then(response=>{
                    if(response.status===201){
                        window.location.reload();
                    }
                });
    }
    return(
        <div className="comments-box">
            <div className="text-center">
                <InputBox labelName="comment" value={comment} readOnly={false} onChange={onCommentHandler} placeholder="댓글을 남겨주세요"/>
                <button className="my-btn" onClick={()=>{createComment(probs.postId,comment)}}>댓글 달기</button>
            </div>
            {comments.map((data)=>(
               <div key={data.id} className="mb-3 row">   
                <label htmlFor={data.id} className="col-sm-2 col-form-label text-center">{data.author.nickname}</label>
                    <div className="col-sm-8 comment">
                            <p>{data.comment}</p>
                            <p>{moment(data.created_at).format('YYYY-MM-DD HH:MM')}</p>
                    </div>
                </div>
            ))}
            <CommentPageButton count={count} next={next} previous={previous} setComments={setComments}></CommentPageButton>
        </div>
    )
}

const PostDetailAPI = ()=>{
    const accessToken = localStorage.getItem("access");
    const userId = JSON.parse(localStorage.getItem('payload')).user_id;
    const navigate = useNavigate();
    const {postId} = useParams();
    const [author, setAuthor] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [checkLike, setCheckLike] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const onTitleHandler = (event)=>{
        setTitle(event.currentTarget.value);
    }

    const onContentHandler = (event)=>{
        setContent(event.currentTarget.value);
    }

    const editPost = (title, content)=>{
        axios.put(`/post/${postId}`,{title,content},
            {headers:{Authorization:`Bearer ${accessToken}`}})
        .then(response=>{if(response.status ===202){
            setEditMode(false);
            alert('수정완료');
        }})
    }

    useEffect(()=>{
        if(accessToken===null){
            navigate('/login');
        }
        axios.get(`/post/${postId}`,{headers:{Authorization:`Bearer ${accessToken}`}}).then(
            response => {
                console.log(response);
                setTitle(response.data.title);
                setContent(response.data.content);
                setAuthor(response.data.author.id);
                if(response.data.likes.includes(userId)){
                    setCheckLike(true);
                }
            }
        ).catch(error=>{
            console.error('error: ', error)
        })
    },[]);

    const pushLike = async(postId)=>{
        const check = await postLike(postId);
        if(check){setCheckLike(!checkLike);}
    }

    return (
        <div className="post-detail">
            {
                editMode? (<div className="text-center" >
                            <div>
                                <InputBox readOnly={false} name="titleInput" onChange={onTitleHandler} value={title} labelName="제목"/>
                                <textarea className="form-control" rows={5} value={content} onChange={onContentHandler}/>
                            </div>
                            <button className="my-btn" onClick={()=>{
                                editPost(title,content)}}>저장하기</button>
                            </div>)
                        : (
                            <div className="text-center">
                            <div>
                                <InputBox readOnly={true} name="postTitleInput" value={title} labelName="제목"/>
                                <textarea className="form-control" rows={5} value={content} readOnly/>
                            </div>
                            {userId === author? <button className="my-btn" onClick={()=>{setEditMode(true)}}>수정하기</button>
                            : (!checkLike ?<button className="my-btn" onClick={()=>{pushLike(postId)}}>좋아요</button>
                                    :<button className="my-btn" onClick={()=>{pushLike(postId)}}>좋아요 취소</button>)}
                            </div>
                            )
                }
            <Comments postId={postId}/>
        </div>

    )
}

const NewPostAPI = ()=>{
    const accessToken = localStorage.getItem("access");
    const navigate = useNavigate();
    const [category,setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const onTitlHandler = (event) => {
        setTitle(event.currentTarget.value);
    }
    const onContentHandler = (event) => {
        setContent(event.currentTarget.value);
    }
    const onCategorySelector = (selectedValue) => {
        setCategory(selectedValue);
    }

    const writePost = async(category, title, content)=>{
        const res = await axios.post('/post/',{category,title,content},
        {headers:{Authorization: `Bearer ${accessToken}`}})

        if(res.status===201){
            navigate('/')
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
                <SelectBox onSelect={onCategorySelector} props={{category:category}}/>
                <input className="form-control" placeholder="제목" onChange={onTitlHandler} value={title}/>
                <textarea className="form-control" rows={15} onChange={onContentHandler} value={content}/>
            </div>
            <button className="my-btn" onClick={onWritePost}>저장하기</button>
            <button className="my-btn" onClick={()=>{navigate(-1)}}>취소하기</button>
        </div>
        </>
    )
}

export {PostAPI,PostDetailAPI,NewPostAPI};