import "./frame.css";
import React, { useEffect, useState } from 'react';
import axios from "axios";

const Layout = ({children})=>{
    return (
        <div className="App">
            <div className="header">
                <h2>MEETING</h2>
                <div>
                <button className="my-btn">마이페이지</button>
                <button className="my-btn">로그아웃</button>
                </div>
            </div>
            <div className="navi">
                <Nav/>
            </div>
            <div className="body">
                {children}
            </div>
        </div>
    )
}

const Nav = ()=>{
    const [categories, setCategories] = useState([]);
    let [activeBtn, setActiveBtn] = useState("");

    const toggleBtn = (id)=>{
        setActiveBtn(id);
    }
    
    useEffect(()=>{
        axios.get('/post/category').then(
            response =>{
                console.log('cate',response)
                setCategories([...response.data]);
            }).catch(
                error =>{
                    console.error(error)
                }
            )
    },[]);

    return(
        <ul className="nav flex-column">
            {  categories.length > 0 &&
                categories.map((category)=>(
                    <NavItem
                    key={category.id}
                    id={category.id}
                    title={category.category_name}
                    active={activeBtn===category.id}
                    onClick={toggleBtn}/>
                ))
            }
        </ul>
    );
}

const NavItem = (probs)=> {
   const {id, title, active, onClick} = probs;

  return (
            <button
            className={active? "nav-active" : "nav-item"}
            id={id}
            onClick={()=> onClick(id)}>
               {title}
            </button>

  );
}

export default Layout