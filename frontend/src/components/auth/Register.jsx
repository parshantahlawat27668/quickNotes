import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { GoogleLogin} from '@react-oauth/google';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { toast } from 'react-toastify';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerWith, setRegisterWith] = useState("phone");

  const registerHandler = (e) => {
    e.preventDefault();
  }

  const handleGoogleSuccess = (credentialResponse)=>{
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/register/google`,{idToken:credentialResponse.credential},{withCredentials:true})
    .then((response)=>{
      dispatch(setUser(response.data.data.user));
      toast.success(response.data.message);
      navigate("/home", {replace:true});
    })
    .catch((error)=>{
                toast.error(error.response.data.message);
    });
  }
  const handleGoogleError = (error)=>{
    console.log(error);
  }


  const toggleRegisterWith = () => {
    setRegisterWith(prev => (prev === "phone" ? "email" : "phone"));
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center text-white">
      <form className="border-[1px] rounded-xl p-6 flex flex-col w-90 bg-[#00000096] border-none items-center " onSubmit={registerHandler}>
        <div className='w-full'>
        <h2 className='text-xl font-semibold mb-1'>Register</h2>
        </div>
        <hr className='mb-3 w-full' />
        <div className="flex flex-col mb-2 gap-[2px] w-full">
          <label htmlFor="name" className='text-sm'>Name</label>
          <input
            className='bg-white rounded-[5px] p-1 outline-none text-black'
            required type='text' id='name' name='name' placeholder='Enter your full name'
          />
        </div>

        {
          registerWith === "phone" ? (
            <div className="flex flex-col mb-2 gap-[2px] w-full">
              <label htmlFor='phone'>Phone</label>
              <input
                className='bg-white rounded-[5px] p-1 outline-none text-black'
                required type='tel' id='phone' name='phone' placeholder='Enter your phone no.'
              />
              <p className="text-[11px] text-yellow-600 cursor-pointer" onClick={toggleRegisterWith}>Register with email</p>
            </div>
          ) : (
            <div className="flex flex-col mb-2 gap-[2px] w-full">
              <label htmlFor='email'>Email</label>
              <input
                className='bg-white rounded-[5px] p-1 outline-none text-black'
                required type='email' id='email' name='email' placeholder='Enter your email id'
              />
              <p className="text-[11px] text-yellow-600 cursor-pointer m-0 p-[0px]" onClick={toggleRegisterWith}>Register with phone</p>
            </div>
          )
        }

        <div className="flex flex-col mb-2 gap-[2px] w-full">
          <label htmlFor='password'>Password</label>
          <input
            className='bg-white rounded-[5px] p-1 outline-none text-black'
            required type='password' id='password' name='password' placeholder='Minimum 6 characters'
          />
        </div>

        <button type='submit' className=" bg-blue-400 font-medium py-1 rounded-[5px] mt-5  w-full">Register</button>

        <p className='text-[12px] mt-1'>Already have an account? <Link to="/auth/login" className='text-blue-400' >login</Link></p>

        <p className='text-center mb-3 mt-2 text-md'>or</p>

        <GoogleLogin size='medium' text='continue_with' logo_alignment='center' shape='pill' onSuccess={handleGoogleSuccess} onError={handleGoogleError}/>
      </form>
    </div>
  )
}

export default Register;
