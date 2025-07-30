import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { setUser } from '../../store/userSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginWith, setLoginWith] = useState("phone");
  const loginHandler = () => {

  }

  const toggleLoginWith = () => {
    if (loginWith === "phone") {
      setLoginWith("email");
    }
    else {
      setLoginWith("phone");
    }
  }



  const handleGoogleSuccess = (credentialResponse)=>{
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login/google`,{idToken:credentialResponse.credential},{withCredentials:true})
    .then((response)=>{
      dispatch(setUser(response.data.data.user));
      toast.success(response.data.message);
      navigate("/home",{replace:true});
    })
    .catch((error)=>{
          toast.error(error.response.data.message);
    });
  }
  const handleGoogleError = (error)=>{
    console.log(error);
  }
  return (
    <div className="h-screen w-screen flex items-center   text-white justify-center">
      <form className="border-[1px] rounded-xl p-6 flex flex-col  w-90 bg-[#00000096] border-none items-center " onSubmit={loginHandler}>
        <div className='w-full'>
        <h2 className='text-xl font-semibold  text-left mb-1'>Login</h2>
        </div>
        <hr className=' h-[1px] bg-white w-full mb-3' />

        {
          loginWith === "phone" ?
            <div className="flex flex-col  gap-[2px] w-full">
              <label htmlFor='phone'>Phone</label>
              <input
                className='bg-white rounded-[5px] p-1 outline-none text-black '
                required type='tel' id='phone' name='phone' placeholder='Enter your phone no.'></input>
              <p className="text-[12px] text-yellow-600 cursor-pointer " onClick={toggleLoginWith}>Login with email</p>
            </div> :
            <div className="flex flex-col  gap-[2px] w-full">
              <label htmlFor='email'>Email</label>
              <input
                className='bg-white rounded-[5px] p-1 outline-none text-black '
                required type='email' id='email' name='email' placeholder='Enter your email id'></input>
              <p className="text-[12px]  text-yellow-600 cursor-pointer" onClick={toggleLoginWith}>Login with phone</p>
            </div>
        }

        <div className="flex flex-col  gap-[2px] w-full mt-1">
          <label htmlFor='password'>Password</label>
          <input
            className='bg-white rounded-[5px] p-1 outline-none text-black'
            required type='password' id='password' name='password' placeholder='Minimum 6 characters'></input>
        </div>
        <button type='submit' className="w-full bg-blue-400 font-medium py-[4px] rounded-[5px] mt-6">Login</button>
        <p className='text-[12px] mt-1'>Don't have an account? <Link to="/auth/register" className='text-blue-400'>register</Link></p>

        <p className='text-center mb-3 mt-1'>or</p>
        <GoogleLogin size='medium'  text='continue_with' logo_alignment='center' shape='pill' onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

      </form>
    </div>
  )
}

export default Login
