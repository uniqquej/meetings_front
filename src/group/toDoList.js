import axios from "axios";
import "moment/locale/ko"
import moment from "moment";
import React,{useState,useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom"

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import "../group/group.css"
// import InputBox from "../components/input";


const MyToDoList = ()=>{
    const accessToken = localStorage.getItem("access");
    const [value, onChange] = useState(new Date());
    // const navigate = useNavigate();
    const {groupId} = useParams();
    const [data, setData] = useState([""]);
    const [dates, setDates] = useState([""]);

    useEffect(()=>{
        axios.get(`/group/${groupId}/my-to-do`,{
            headers:{Authorization:`Bearer ${accessToken}`}
        }).then(response=>{
            const list_date = response.data.map((info)=>{
                return info.date
            })
            setData([...response.data]);
            setDates([...list_date])
        })
    },[groupId])

    return (
        <div className="to-do-page">
            <div className="to-do-calender">
                <Calendar
                    className="calender"
                    onChange={onChange}
                    value={value}
                    formatDay={(locale, date) => moment(date).format("DD")}
                    tileContent={({ date, view }) => { 
                        let html = [];
                        if (dates.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
                        html.push(<div className="dot"></div>);
                        }
                        return (
                        <>{html}</>
                        );
                    }}
                />
            </div>

            <div className="to-do-list">
               {data.filter((list)=>(
                list.date === moment(value).format("YYYY-MM-DD")
               ))
               .map((info)=>(
                <div key={info.id}>
                    <p className="text-center"><b>{info.date}</b></p>
                    <p className="text-center"><b>{moment(info.date).lang("ko").format('dddd')}</b></p>
                    {info.todo_set.map((todo) => (
                        <div className="form-check">
                        {todo.is_done
                            ?(<input className="form-check-input" type="checkbox" value={todo.id} id="flexCheckDefault" checked/>)
                            :(<input className="form-check-input" type="checkbox" value={todo.id} id="flexCheckDefault"/>)
                        }
                        <label className="form-check-label" for="flexCheckDefault">
                        {todo.task}
                        </label>
                        </div>
                    ))}
                </div>
               ))}   
            </div>

            <div className="to-do-detail">
                        달성률 백엔드 완성하기
            </div>
            <AddTodo groupId={groupId} value={value}/>
        </div>
    )
}

const AddTodo = (probs)=>{
    const navigate = useNavigate();
    const selecDate = moment(probs.value).format("YYYY-MM-DD");
    const [date, setDate] = useState(selecDate);
    const [task, setTask] = useState("");
    const accessToken = localStorage.getItem("access");

    const onDateHandler = (event) => {
        setDate(event.currentTarget.value);
    }

    const onTaskHandler = (event) => {
        setTask(event.currentTarget.value);
    }

    const saveTodo = async(date,task)=>{
        const res = await axios.post(`/group/${probs.groupId}/to-do`,
        {date,task},
        {headers:{Authorization: `Bearer ${accessToken}`}});

        if (res.status === 201){
            window.location.reload();
        }
    }

    useEffect(() => {
        const selecDate = moment(probs.value).format("YYYY-MM-DD");
        setDate(selecDate);
    }, [probs.value]);

    return(
        <div className="to-do-add">
            <button className="my-btn" onClick={()=>{navigate(-1)}}>이전 페이지</button>
            <p><b>할 일 추가</b></p>
            <input type="date" onChange={onDateHandler} value={date} />
            <input placeholder="할일" onChange={onTaskHandler}/>
            <button className="my-btn" onClick={()=>{saveTodo(date,task)}}>저장하기</button>
        </div>
    )
}

export {MyToDoList}