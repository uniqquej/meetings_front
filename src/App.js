import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import {LoginPage, AuthPage, SignupPage} from './user/api';
import PostAPI from './post/PostAPI';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header/>
        <Routes>
          <Route path='/login' element={ <LoginPage />}/>
          <Route path='/auth' element={ <AuthPage />}/>
          <Route path='/signup' element={ <SignupPage />}/>
          <Route path='/post' element={ <PostAPI />}/>
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
