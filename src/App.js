import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {Layout} from './components/frame';
import {LoginPage, AuthPage, SignupPage} from './user/api';
import {PostAPI, PostDetailAPI, NewPostAPI} from './post/post';
import {RecruitmentAPI, RecruitmentDetailAPI, NewRecruitmentAPI} from './post/recruitment';
import {ProfilePostAPI } from './post/profilePost';
import {GroupDetail, CreateGroup} from './group/group';
import {MyToDoList} from './group/toDoList'
import { Socket } from './chat/chat';
import { MyPageLayout} from './components/myPageFrame';
import { EditProfile } from './user/profile'; 

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
            <Route path='' element={
              <Layout>
                <PostAPI/>
              </Layout>
            }/>
            <Route path='/new/post' element={
              <Layout>
                <NewPostAPI/>
              </Layout>
            }/>
            <Route path='/post/:postId' element={
              <Layout>
                <PostDetailAPI/>
              </Layout>
            }/>
            <Route path='/recruit' element={
              <Layout>
                <RecruitmentAPI/>
              </Layout>
            }/>
            <Route path='/new/recruit' element={
              <Layout>
                <NewRecruitmentAPI/>
              </Layout>
            }/>
            <Route path='/recruit/:recruitId' element={
              <Layout>
                <RecruitmentDetailAPI/>
              </Layout>
            }/>
          <Route path='/group/:groupId' element={
              <MyPageLayout>
                <GroupDetail />
              </MyPageLayout>   
          }/>
          <Route path='/group/:groupId/to-do' element={
              <MyPageLayout>
                <MyToDoList/>
              </MyPageLayout>   
          }/>
        <Route path='/group/new' element={
              <MyPageLayout>
                <CreateGroup />
              </MyPageLayout>   
          }/>
           <Route path='/chat/:roomId' element={
              <MyPageLayout>
                <Socket />
              </MyPageLayout>
          }/>
          <Route path='/my/:userId' element={
              <MyPageLayout>
                <EditProfile/>
              </MyPageLayout>
          }/>
          <Route path='/my/:userId/:option' element={
              <MyPageLayout>
                <ProfilePostAPI/>
              </MyPageLayout>
          }/>
          
        </Routes>  
    </BrowserRouter>
  );
}

export default App;
