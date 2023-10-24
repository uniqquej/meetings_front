import "./frame.css";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import {Provider, useDispatch } from 'react-redux';
import { createStore } from 'redux';

const reducer = (currentState, action)=>{
    if(currentState=== undefined){
        return{
            selectedCategory:undefined
        }
    }
    switch (action.type){
        case 'select_category':
            return {...currentState, selectedCategory: action.category};
        default:
            return currentState;
    }
}
const store = createStore(reducer);

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
            <Provider store={store}>
            <div className="navi">
                <Nav/>
            </div>
                <div className="body">
                    {children}
                </div>
            </Provider>
        </div>
    )
}

const Nav = ()=>{
    const [categories, setCategories] = useState([]);
    let [activeBtn, setActiveBtn] = useState("");
    const dispatch = useDispatch();

    const toggleBtn = (id)=>{
        dispatch({type:"select_category", category:id})
        setActiveBtn(id);
    }
    
    useEffect(()=>{
        axios.get('/post/category').then(
            response =>{
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