import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {Layout} from './components/frame';
import {LoginPage, AuthPage, SignupPage} from './user/api';
import {PostAPI, PostDetailAPI, NewPostAPI} from './post/post';
import {RecruitmentAPI, RecruitmentDetailAPI, NewRecruitmentAPI} from './post/recruitment';
import {GroupList, GroupDetail} from './group/group';
import { Socket } from './chat/caht';
import { MyPageLayout} from './components/group_page';
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
            <Route path='/group' element={
              <Layout>
                <GroupList />
              </Layout>
          }/>
          <Route path='/group/:groupId' element={
              <MyPageLayout>
                <GroupDetail />
              </MyPageLayout>   
          }/>
           <Route path='/chat/:roomName' element={
              <Layout>
                <Socket />
              </Layout>
          }/>
          <Route path='/my/:userId' element={
              <MyPageLayout>
                <EditProfile/>
              </MyPageLayout>
          }/>
        </Routes>  
    </BrowserRouter>
  );
}

export default App;
