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
            <div className="footer">
                Footer
            </div>
        </div>
    )
}

const Nav = ()=>{
    const [category, setCategory] = useState([]);
    
    useEffect(()=>{
        axios.get('/post/category').then(
            response =>{
                console.log('cate',response)
                setCategory([...response.data]);
            }).catch(
                error =>{
                    console.error(error)
                }
            )
    },[]);

    return(
        <ul className="nav flex-column">
            {  category.length > 0 &&
                category.map((category)=>(
                    <NavItem key={category.id} title={category.category_name}/>
                ))
            }
        </ul>
    );
}

const NavItem = (probs)=> {
  return (
        <>
            <li className="nav-item">
                <a aria-current="page" href="#">{probs.title}</a>
            </li>
        </>
  );
}

export default Layout