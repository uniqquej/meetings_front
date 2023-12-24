import React from "react";
import axios from "axios"
import { useParams } from "react-router-dom";

const CommentPageButton = (props)=>{
    const pageSize = 5;
    const {count, next, previous, setComments} = props;
    const {postId} = useParams();
 
    const pageNumber = (count%pageSize)!=0? Math.floor(count/pageSize)+1 :(count/pageSize);
    let currentPage = 1;
    console.log("comment detail : ",next,previous,count)
    if (next != null){
        currentPage = parseInt(next, 10)-1;
    }else if(previous != null){
        currentPage = parseInt(previous, 10)+1;
    }

    const getComments = async(pageNum)=>{
        let params = {page:pageNum};
        let res = await axios.get(`/post/${postId}/comment`,{params});
        console.log("comment",res.data);
        if(res.status == 200){
            setComments(res.data.results);
        }
    }
    const renderPageButton = ()=>{
        const pages = [];
        for(let i=1; i<=pageNumber;i++){
            
            pages.push(
                <li class="page-item"><a class="page-link" onClick={()=>{getComments(i)}}>{i}</a></li>
            )
        }
        return pages;
    }
    return (
        <Paging props = {{next}}>
            {renderPageButton()}
        </Paging>
    )
}

const PageButton = (props)=>{
    //post, recruitment page
    const {count, next, previous, setData, type} = props;
    const pageSize = 10;
    const pageNumber = (count%pageSize)!=0? Math.floor(count/pageSize)+1 :(count/pageSize);
    let currentPage = 1;
    
    if (next != null){
        currentPage = parseInt(next, 10)-1;
    }else if(previous != null){
        currentPage = parseInt(previous, 10)+1;
    }

    const getPage = async(pageNum)=>{
        let params = {page:pageNum};
        let res = await axios.get(`/${type}/`,{params});
        console.log(res.data);
        if(res.status == 200){
            setData(res.data.results);
        }
    }
    const renderPageButton = ()=>{
        const pages = [];
        for(let i=1; i<=pageNumber;i++){
            
            pages.push(
                <li class="page-item"><a class="page-link" onClick={()=>{getPage(i)}}>{i}</a></li>
            )
        }
        return pages;
    }
    return (
        <Paging props = {{next}}>
            {renderPageButton()}
        </Paging>
    )
}

const Paging = ({children,props})=>{
    return(
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                {children}
                <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
        </nav>
    )
}

export {PageButton, CommentPageButton}