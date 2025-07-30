import axios from 'axios';
import React from 'react'
import { RxCross2 } from "react-icons/rx";
import { setNotes } from '../../store/notesSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
const NoteCard = ({ note, onClick }) => {
  const dispatch = useDispatch();
  const date = new Date(note.createdAt);
  // Extract parts
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getFullYear();

  // Time parts
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  // Final format
  const formatted = `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;

  const handleDelete = (noteId)=>{
    axios.delete(`http://localhost:5000/api/v1/note/delete/${noteId}`,{withCredentials:true})
    .then((response)=>{
      dispatch(setNotes(response.data.data.notes));
      toast.success(response.data.message);
    })
    .catch((error)=>{
      toast.error(error.response.data.message);
    });
  }
  return (
    <div className='border py-3 px-3 mb-1 w-full rounded-[10px] relative' >
      <div className='absolute top-[5px] right-[5px] flex flex-row cursor-pointer' onClick={()=>handleDelete(note._id)}>
        <RxCross2 />
      </div>
      <h4 className='text-[18px] font-medium mb-2'>{note?.title}</h4>
      <p className='text-xs'>
        {note?.note}
      </p>
      <p className='text-[12px] mt-3 font-medium'>{formatted}</p>
    </div>
  )
}

export default NoteCard
