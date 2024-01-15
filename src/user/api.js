import "./api.css"

import React, {useState} from "react";
import qs from 'qs';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = "http://127.0.0.1:8000/";
axios.defaults.paramsSerializer = params=>{
    return qs.stringify(params);
};

const LoginPage = ()=>{
    const navigate = useNavigate();

    const [PhoneNumber, setPhoneNumber] = useState("");
    const [Password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const onPhoneNumberHandler = (event) => {
        setPhoneNumber(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const login = (phone_number, password) =>{
        const userData = {
            phone_number,
            password
        };
        axios.post('user/login', userData).then(
            response => {
                const accessToken = response.data["access"];
                localStorage.setItem('access', accessToken)
                const base64Url = response.data["access"].split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                localStorage.setItem('payload', jsonPayload);
                if(response.status ===200){
                    navigate("/");
                }
            }
        ).catch(error=>{
            setErrorMessage(error.response.data.msg);
            console.log("error:",error.response.data)
        })
    }

    const onLogin = ()=>{
        login(PhoneNumber, Password)
    }

    const handleOnKeyPress = e => {
        if (e.key === 'Enter') {
            login(PhoneNumber, Password); // Enter 입력이 되면 클릭 이벤트 실행
        }
      };

    return(
        <div className="inputBox">
            <h3>로그인</h3>
            <input className="form-control" type="text" value={PhoneNumber} 
            onChange={onPhoneNumberHandler} placeholder="phone number"/>
            <input className="form-control" type="password" value={Password} 
            onChange={onPasswordHandler} placeholder="password" onKeyDown={handleOnKeyPress}/>
            {errorMessage!=null
                ? <div className="errorMsg">{errorMessage}</div>
                : null
            }
            <button className="btn btn-dark" onClick={onLogin}>로그인</button>
            <button className="btn btn-dark" onClick={()=>{navigate('/auth')}}>회원 가입</button>
        </div>
    )
}

const AuthPage = ()=>{
    const navigate = useNavigate();

    const [PhoneNumber, setPhoneNumber] = useState("");
    const [AuthNumber, setAuthNumber] = useState("");
    const [IsSmsSended, setIsSmsSended] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const onPhoneNumberHandler = (event) => {
        setPhoneNumber(event.currentTarget.value);
    }

     const onAuthNumberHandler = (event) => {
        setAuthNumber(event.currentTarget.value);
    }

    const sendAuthNumber = (phone_number) =>{
        const userData = {
            phone_number,
        };
        axios.post('user/sms', userData)
            .then(res=>{
                if (res.status === 202){
                    setErrorMessage(null);
                    setIsSmsSended(true);
                }
            })
            .catch(error=>{
                if(error.response.data.error){
                    setErrorMessage(error.response.data.error.non_field_errors);
                } else {
                  setErrorMessage(error.response.data.msg);  
                }
    })}

    const checkAuthNumber = async (PhoneNumber, AuthNumber) =>{
        const userData = {
            phone_number: PhoneNumber,
            input_number : AuthNumber
        };
        await axios.post('user/auth', userData)
        .then(
            response=>{
                if (response.status === 200){
                    navigate(`/signup`);
                }
            }
        )
        .catch(error=>{
            setErrorMessage(error.response.data.msg);
            console.log(error.response.data);
        })    
    }

    const onCheckAuthNumber = ()=>{
        checkAuthNumber(PhoneNumber, AuthNumber)
    }

    return(
        <div className="inputBox">
            <h3>인증번호 확인</h3>
            {errorMessage!==null ? <span className="errorMsg">{errorMessage}</span>
                                :<></>}
            <input className="form-control" type="text" value={PhoneNumber} 
            onChange={onPhoneNumberHandler} placeholder="phone number"/>
            {
                IsSmsSended && (
                    <input className="form-control" type="number" value={AuthNumber} 
                        onChange={onAuthNumberHandler} placeholder="인증번호"/>
                )
            }
            {
                IsSmsSended && (
                <>
                <button className="btn btn-dark" onClick={onCheckAuthNumber}>인증번호 확인</button>
                </>)
            }
            {
                !IsSmsSended && (<button className="btn btn-dark" onClick={()=>{sendAuthNumber(PhoneNumber)}}>인증번호 받기</button>)
            }
        </div>
    )
}

const SignupPage = ()=>{
    const navigate = useNavigate();

    const [PhoneNumber, setPhoneNumber] = useState("");
    const [Nickname, setNickname] = useState("");
    const [Password, setPassword] = useState("");
    const [Password2, setPassword2] = useState("");

    const onPhoneNumberHandler = (event) => {
        setPhoneNumber(event.currentTarget.value);
    }

     const onNicknameHandler = (event) => {
        setNickname(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onPassword2Handler = (event) => {
        setPassword2(event.currentTarget.value);
    }

    const singup = async(PhoneNumber, Nickname, Password, Password2)=>{
        const body = {
            phone_number: PhoneNumber,
            nickname: Nickname,
            password: Password,
            password2: Password2
        }
        await axios.put('/user/signup', body)
        .then(
            response=>{
                console.log(response.data)
                if (response.status===200){
                    navigate('/login');
                }
            }
        )
        .catch(error=>{
            console.log(error.response.data);
            alert(error.response.data.error.non_field_errors);
        })
        
    }

    const onSignup = ()=>{
        if(Password !== Password2){
            alert("비밀번호가 일치하지 않습니다.");
        } else {
            singup(PhoneNumber, Nickname, Password, Password2);
        }
    }

    return (
        <div className="inputBox">
            <h3>회원가입</h3>
            <input className="form-control" type="text" value={PhoneNumber} 
            onChange={onPhoneNumberHandler} placeholder="phone number"/>
            <input className="form-control" type="text" value={Nickname} 
            onChange={onNicknameHandler} placeholder="nickname"/>
            <input className="form-control" type="password" value={Password} 
            onChange={onPasswordHandler} placeholder="password"/>
            <input className="form-control" type="password" value={Password2} 
            onChange={onPassword2Handler} placeholder="check password"/>
            <button className="btn btn-dark" >로그인</button>
            <button className="btn btn-dark" onClick={onSignup}>회원 가입</button>
        </div>
    )
}

export {LoginPage, SignupPage, AuthPage};