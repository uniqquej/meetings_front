import React, {useState, useEffect} from "react"
import { useSelector,useDispatch } from "react-redux"
import {useParams, useNavigate} from "react-router-dom"
import axios from "axios"
import moment from "moment";

import "./post.css"
import { SelectBox } from "../components/frame";
import InputBox from "../components/input";

const accessToken = localStorage.getItem("access");

let userId;
if (accessToken){
    userId = JSON.parse(localStorage.getItem('payload')).user_id;
}

const PostAPI = ()=>{
    const dispatch = useDispatch();
    const category = useSelector((state)=> state.selectedCategory);

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [searchWord, setSearchWord] = useState("");

    const searchHandler = (event) => {
        setSearchWord(event.currentTarget.value);
    }

    const searchKeyword = async(keyword)=>{
        let params = {search:keyword, category:category}
        const res = await axios.get(`/post/`,
        {params});
        if (res.status === 200){
            setData([...res.data]);
            return (
                data.length === 0? <div className="post-list"><div>검색결과 없음</div></div>
                :(<div className="post-list">
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
                {data.map((post) => (
                        <div className="post-item" key={post.id}>
                            <b><a href={`/post/${post.id}`}>{post.title}</a></b>
                            { post.author.nickname===""
                            ?(<p> unknown / {moment(post.created_at).format("YYYY-MM-DD")}</p>)
                            :(<p>{post.author.nickname} / {moment(post.created_at).format("YYYY-MM-DD")}</p>)}
                        </div>
                ))}
                </div>)
            )
        }
    }

    useEffect(()=>{
        let params = {category:category};
        axios.get('/post/',{params}).then(response => {
                setData([...response.data]);
            }
        ).catch(error=>{
            console.error('error: ', error)
        })
    },[category]);

    return (
        <div className="post-list">
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
        {data.map((post) => (
                <div className="post-item" key={post.id}>
                    <b><a href={`/post/${post.id}`}>{post.title}</a></b>
                    { post.author.nickname===""
                    ?(<p> unknown / {moment(post.created_at).format("YYYY-MM-DD")}</p>)
                    :(<p>{post.author.nickname} / {moment(post.created_at).format("YYYY-MM-DD")}</p>)}
                </div>
        ))}
        </div>
    )
}

const Comments = (probs)=>{
    const [comments, setComments]=useState([]);
    const [comment, setComment]=useState("");

    const onCommentHandler = (event)=>{
        setComment(event.currentTarget.value)
    }
    useEffect(()=>{
        axios.get(`/post/${probs.postId}/comment`,{headers:{Authorization:`Bearer ${accessToken}`}})
            .then(response=>{
                console.log('comment',response)
                setComments([...response.data])})
    },[]);
    
    const createComment = (postId,comment)=>{
        axios.post(`/post/${postId}/comment`,{comment},{
                    headers:{Authorization:`Bearer ${accessToken}`}
                })
                .then(response=>{
                    if(response.status===201){
                        setComments([...comments,{author:response.data.author, comment:response.data.comment, created_at: response.data.created_at}]);
                        setComment("");
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
               <div className="mb-3 row">   
                <label for={data.id} class="col-sm-2 col-form-label text-center">{data.author.nickname}</label>
                <div className="col-sm-10 comment">
                        <p>{data.comment}</p>
                        <p>{moment(data.created_at).format('YYYY-MM-DD HH:MM')}</p>
                       
                </div>
             </div>
            ))}
        </div>
    )
}

const PostDetailAPI = ()=>{
    // css 수정
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
        axios.get(`/post/${postId}`).then(
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

    const postLike = (postId)=>{
        axios.post(`/post/${postId}/like`,{},{
            headers:{Authorization:`Bearer ${accessToken}`}
        }).then(response=>{if(response.status===201 | response.status===204){setCheckLike(!checkLike)}})}

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
                            : (!checkLike ?<button className="my-btn" onClick={()=>{postLike(postId)}}>좋아요</button>
                                    :<button className="my-btn" onClick={()=>{postLike(postId)}}>좋아요 취소</button>)}
                            </div>
                            )
                }
            <Comments postId={postId}/>
        </div>

    )
}

const NewPostAPI = ()=>{
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
                <SelectBox onSelect={onCategorySelector}/>
                <input className="form-control" placeholder="제목" onChange={onTitlHandler} value={title}/>
                <textarea className="form-control" rows={15} onChange={onContentHandler} value={content}/>
            </div>
            <button className="my-btn" onClick={onWritePost}>저장하기</button>
        </div>
        </>
    )
}

export {PostAPI,PostDetailAPI,NewPostAPI};