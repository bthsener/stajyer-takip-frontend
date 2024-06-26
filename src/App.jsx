import { useState } from 'react'
import './App.css'
import SignIn from './pages/SignIn/SignIn'
import SignUp from './pages/SignUp/SignUp'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from './Home'
import Profile from './pages/Profile/Profile';
import Project from './pages/Project/Project';
import PrivateRoutes from './utils/PrivateRoutes';
import CreateComment from './component/Comment/CreateComment';
import Comment from './pages/Comment/Comment';
import CreateProject from './component/Project/CreateProject';
import Users from './pages/Admin/Users';
import User from './pages/User/User';

function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/register" element={<SignUp/>} />
          <Route exact path="/login" element={<SignIn/>} />
          <Route exact path="/projects" element={<Profile/>} />
          <Route exact path="/project/:id/comments/new" element={<CreateComment/>} />
          <Route exact path="/project/:id" element={<Project/>} />
          <Route exact path="/comment/:id" element={<Comment/>} />
          <Route exact path="/project/new" element={<CreateProject/>} />
          <Route exact path="/admin/users" element={<Users/>} />
          <Route exact path="/user/:id" element={<User/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
