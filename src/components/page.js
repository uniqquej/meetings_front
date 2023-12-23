import React from "react";
import axios from "axios"

const PageButton = (props)=>{
    const {count, next, previous, setData, type} = props;
    
    const pageNumber = (count%10)!=0? Math.floor(count/10)+1 :(count/10);
    let currentPage = 1;
    
    if (next != null){
        currentPage = parseInt(next, 10)-1;
    }else if(previous != null){
        currentPage = parseInt(previous, 10)+1;
    }

    console.log('current : ',currentPage);
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
    console.log('paging : ', props)
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

export {PageButton}