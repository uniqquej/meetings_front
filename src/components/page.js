import React, { useEffect, useState } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";

const CommentPageButton = (props)=>{
    const pageSize = 5;
    const {count, next, previous, setComments} = props;
    const {postId} = useParams();
 
    const pageNumber = (count%pageSize)!=0? Math.floor(count/pageSize)+1 :(count/pageSize);
    const [currentPage, setCurruntPage] = useState(1);
    const [startPageNum, setStartPageNum] = useState(1);
    

    const getComments = async(pageNum)=>{
        setCurruntPage(pageNum);
        let params = {page:pageNum};
        let res = await axios.get(`/post/${postId}/comment`,{params});
        console.log("comment",res.data);
        if(res.status == 200){
            setComments(res.data.results);
        }
    }
    const renderPageButton = ()=>{
        const pages = [];
        let endPageNum = startPageNum+4;
        if(startPageNum+4 > pageNumber){
            endPageNum = pageNumber;
        }

        for(let i=startPageNum; i<=endPageNum;i++){
            
            pages.push(
                <li className={currentPage===i ?"page-item active" :"page-item"}>
                    <a className="page-link" onClick={()=>{getComments(i)}}>{i}</a>
                </li>
            )
        }
        return pages;
    }

    useEffect(()=>{
        getComments(currentPage);
    },[currentPage])

    return (
        <Paging props = {{pageNumber,currentPage, setStartPageNum,setCurruntPage}}>
            {renderPageButton()}
        </Paging>
    )
}

const PageButton = (props)=>{
    //post, recruitment page
    let pageUrl;
    const {count, next, previous, setData, url} = props;
    const accessToken= localStorage.getItem("access");
    const pageSize = 10;
    const pageNumber = (count%pageSize)!=0? Math.floor(count/pageSize)+1 :(count/pageSize);
    const [currentPage, setCurruntPage] = useState(1);
    const [startPageNum, setStartPageNum] = useState(1);

    const getPage = async(pageNum)=>{
        setCurruntPage(pageNum);
        if (url.includes("option")){
            pageUrl = url + `&page=${pageNum}`
        }
        else {
            pageUrl = url +`?page=${pageNum}`
        }
        let res = await axios.get(`${pageUrl}`,{
            headers:{Authorization:`Bearer ${accessToken}`}
        });
        console.log(res.data);
        if(res.status == 200){
            setData(res.data.results);
        }
    }
    const renderPageButton = ()=>{
        const pages = [];
        let endPageNum = startPageNum+4;
        if (startPageNum+4 > pageNumber){
            endPageNum = pageNumber;
        }

        for(let i=startPageNum; i<=endPageNum;i++){
            pages.push(
                <li className={currentPage===i ? "page-item active":"page-item"}>
                    <a className="page-link" onClick={()=>{getPage(i)}}>{i}</a>
                </li>
            )
        }
        return pages;
    }
    useEffect(()=>{
        getPage(currentPage);
    },[currentPage])
    
    return (
        <Paging props = {{pageNumber, currentPage, setStartPageNum, setCurruntPage}}>
            {renderPageButton()}
        </Paging>
    )
}

const Paging = ({children, props})=>{
    const {pageNumber, currentPage, setStartPageNum,setCurruntPage} = props;
    
    const nextPage = ()=>{
        if(currentPage%5===0){
            setStartPageNum(currentPage+1);
            setCurruntPage(currentPage+1);
        }else{
            setCurruntPage(currentPage+1);
        }
    }

    const previousPage = ()=>{
        if(currentPage%5===1){
            setStartPageNum(currentPage-5);
            setCurruntPage(currentPage-1);
        }else{
            setCurruntPage(currentPage-1);
        }
    }

    return(
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                {currentPage !== 1
                ? (  <li className="page-item">
                        <a className="page-link" onClick={()=>{previousPage()}} aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>)
                : null
                }
                {children}
                {currentPage !== pageNumber
                ? (<li className="page-item">
                        <a className="page-link" onClick={()=>{nextPage()}} aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>)
                : null
                }
            </ul>
        </nav>
    )
}

export {PageButton, CommentPageButton}