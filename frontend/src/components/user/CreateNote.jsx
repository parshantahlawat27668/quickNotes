import React from 'react'
import { MdOutlineSaveAs } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setNotes } from '../../store/notesSlice';
import { toast } from 'react-toastify';
const CreateNote = ({notes}) => {

  const dispatch = useDispatch();
  const titleRef = useRef();
  const noteRef = useRef();
    const closeHandler = (e)=>{
        e.preventDefault();
        notes();
    }
    const saveHandler = (e)=>{
        e.preventDefault();
        const title = titleRef.current.value;
        const note = noteRef.current.value;
        axios.post("http://localhost:5000/api/v1/note/create",{title, note},{withCredentials:true})
        .then((response)=>{
          dispatch(setNotes(response.data.data.notes));
          toast.success(response.data.message);
          notes();
        })
        .catch((error)=>{
          toast.error(error.response.data.message);
        });

    }
  return (
<div className="w-full p-4 sm:p-6 bg-gradient-to-b from-blue-100 to-blue-200 min-h-[85vh]">
  <form className="relative w-full h-full bg-white/90 backdrop-blur-md rounded-2xl shadow-lg flex flex-col gap-4 px-5 py-6">
    
    {/* Floating Buttons */}
    <div className="absolute top-4 right-5 flex gap-2">
      <button
        onClick={(e) => closeHandler(e)}
        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-white bg-red-500 hover:bg-red-600 transition cursor-pointer"
      >
        <IoMdClose size={14} />
        Close
      </button>
      <button
        onClick={(e) => saveHandler(e)}
        className="flex items-center gap-1 text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-green-500 hover:bg-green-600 transition cursor-pointer"
      >
        <MdOutlineSaveAs />
        Save
      </button>
    </div>

    {/* Title Input */}
    <input
      type="text"
      placeholder="Enter Title"
      ref={titleRef}
       className="text-xl font-medium tracking-wide outline-none px-2 py-2 bg-transparent placeholder-gray-500"
    />

    {/* Date */}
    <p className="text-xs text-gray-600 pl-1">Monday, July 28 at 12:31</p>

    {/* Note Textarea */}
    <textarea
      name="content"
      id="content"
      placeholder="Type your note here..."
      ref={noteRef}
      className="min-h-[200px] resize-none outline-none px-2 py-3 text-sm bg-transparent text-gray-800 placeholder-gray-500"
    ></textarea>
  </form>
</div>

  )
}

export default CreateNote
