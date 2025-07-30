
import { Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import AuthLayout from './pages/auth/AuthLayout.jsx';
import UserLayout from './pages/user/UserLayout';
import RedirectIfLogged from './routes/RedirectIfLogged.jsx';
import PublicRoute from './routes/PublicRoute.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { useDispatch } from 'react-redux';
import { ToastContainer } from "react-toastify";
import { useEffect } from 'react';
import axios from 'axios';
import { setUser } from './store/userSlice.js';


function App() {
    const dispatch = useDispatch();


      useEffect(()=>{
    const fetchUser = ()=>{
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`,{withCredentials:true})
      .then((response)=>{
        dispatch(setUser(response.data.data.user));
      })
      .catch((error)=>{
        console.log(error);
      })
    }
    fetchUser();
  },[]);

  return (
    <div className='h-screen  overflow-hidden '>
            <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        draggable
        theme="light" // or "dark"
        limit={3}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
     <Routes>
      <Route path='/' element={<RedirectIfLogged/>}/>

        <Route path='/auth' element={<PublicRoute><AuthLayout/></PublicRoute>}>
        <Route path="login" element={<Login/>}></Route>
        <Route path="register" element={<Register/>}></Route>
        </Route>
        <Route path='/home' element={<ProtectedRoute><UserLayout/></ProtectedRoute>}></Route>
        <Route path='*' element={<h2>Not found</h2>}/>
      </Routes>
    </div>
  )
}

export default App
