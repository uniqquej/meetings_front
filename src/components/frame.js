import "./frame.css";
import React from 'react';

const Layout = ({children})=>{
    return (
        <div className="App">
            <div className="header">
                <h3>Meeting</h3>
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