import "./frame.css";
import React from 'react';

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
                <ul className="nav flex-column">
                    <NavItem title="공무원 시험" />
                </ul>
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

// category 가져와서 navitem 추가하기
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