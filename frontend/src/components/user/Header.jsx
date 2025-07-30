import axios from 'axios';
import React from 'react'
import { CiLogout } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { toast } from 'react-toastify';
const Header = () => {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    axios.get("http://localhost:5000/api/v1/auth/logout", { withCredentials: true })
      .then((response) => {
        dispatch(setUser(null));
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
  }
  return (
    <div className="w-full h-16 flex-shrink-0 flex items-center justify-between px-4 bg-gradient-to-tr from-[#2563eb] via-[#3b82f6] to-[#6366f1] shadow-md">
      {/* Brand Name */}
      <div className="text-2xl font-semibold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent select-none tracking-wide">
        QuickNotes
      </div>

      {/* Logout Button */}
      <button
        onClick={logoutHandler}
        className="flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-md text-white hover:bg-white/30 transition cursor-pointer"
      >
        <CiLogout size={18} />
        Logout
      </button>
    </div>

  )
}

export default Header
