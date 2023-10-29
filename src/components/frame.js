import "./frame.css";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import {Provider, useDispatch, useSelector } from 'react-redux';
import { createStore } from 'redux';
import { useNavigate } from "react-router-dom";

const accessToken=localStorage.getItem("access");
let userId;
if (accessToken){
    userId = JSON.parse(localStorage.getItem('payload')).user_id;
}

const reducer = (currentState, action)=>{
    if(currentState=== undefined){
        return{
            selectedCategory:undefined,
            categoryList:undefined
        }
    }
    switch (action.type){
        case 'select_category':
            return {...currentState, selectedCategory: action.category};
        case 'category_list':
            return {...currentState, categoryList: action.categories};
        default:
            return currentState;
    }
}
const store = createStore(reducer);

const Layout = ({children})=>{
    const navigate = useNavigate();
    return (
        <div className="App">
            <div className="header">
                <h2><a href="/" id="logo">MEETING</a></h2>
                <div>
                <button className="my-btn" onClick={()=>{navigate(`/my/${userId}`)}}>마이페이지</button>
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
    const activeBtn = useSelector((state)=> state.selectedCategory);
    const dispatch = useDispatch();

    const toggleBtn = (id)=>{
        dispatch({type:"select_category", category:id});
    }
    
    useEffect(()=>{
        axios.get('/post/category').then(
            response =>{
                setCategories([...response.data]);
                dispatch({type:"category_list", categories:[...response.data]});
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

const SelectBox = ({onSelect})=>{
    const categories = useSelector(state=>(state.categoryList));
    const [category, setCategory] = useState("");

    const onCategoryHandler = (event) => {
        setCategory(event.currentTarget.value);
        onSelect(event.currentTarget.value);
    }
    return (
        <select className="form-select" onChange={onCategoryHandler} value={category}>
            <option >--카테고리를 선택해주세요--</option>
            { categories.map((data)=>(
                <option key={data.id} value={data.id}>{data.category_name}</option>
            ))}
        </select>  
    )
}

export {Layout, SelectBox}