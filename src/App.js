import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './components/frame';
import {LoginPage, AuthPage, SignupPage} from './user/api';
import {PostAPI, PostDetailAPI} from './post/PostAPI';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/login' element={
              <div className="Wrap">
                <LoginPage />
              </div>
          }/>
            <Route path='/auth' element={
              <div className="Wrap">
                <AuthPage/>
              </div>
            }/>
            <Route path='/signup' element={
              <div className="Wrap">
                <SignupPage/>
              </div>
            }/>
            <Route path='/post' element={
              <Layout>
                <PostAPI/>
              </Layout>
            }/>
            <Route path='/post/:postId' element={
              <Layout>
                <PostDetailAPI/>
              </Layout>
            }/>
        </Routes>  
    </BrowserRouter>
  );
}

export default App;
