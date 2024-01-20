import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";

const GroupSelector = ({onSelect})=>{
    const accessToken = localStorage.getItem("access");
    const [groups, setGroups]=useState([]);
    const [group, setGroup]=useState("");

    useEffect(()=>
        {axios.get('/group/leader', {headers:{
            Authorization:`Bearer ${accessToken}`}})
        .then(response=>{
            setGroups([...response.data]);
            console.log(groups)
            })},[]);

    const onGroupHandler = (event) => {
        setGroup(event.currentTarget.value);
        onSelect(event.currentTarget.value);
    }

    return (
        <select className="form-select" onChange={onGroupHandler} value={group}>
            <option >--그룹을 선택해주세요--</option>
            { groups.map((data)=>(
                <option key={data.id} value={data.id}>{data.group_name}</option>
            ))}
        </select>  
    )
}

export default GroupSelector;