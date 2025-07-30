import React, { useEffect, useState } from 'react'
import Header from '../../components/user/Header'
import WelcomeMessage from '../../components/user/WelcomeMessage'
import CreateNote from '../../components/user/CreateNote'
import NotesCardContainer from '../../components/user/NotesCardContainer'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setNotes } from '../../store/notesSlice'

const UserLayout = () => {
  const dispatch = useDispatch();
      useEffect(()=>{
    const fetchNotes = ()=>{
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/note/my`,{withCredentials:true})
      .then((response)=>{
        dispatch(setNotes(response.data.data.notes));
      })
      .catch((error)=>{
        console.log(error);
      })
    }
    fetchNotes();
  },[]);

  const [tab, setTab]=useState("notes");
  const goToNotes = ()=>{
    setTab("notes");
  }
  const goToView = ()=>{
    setTab("view");
  }

  const goToCreate = ()=>{
    setTab("create");
  }
  return (
    <div className='w-screen h-screen overflow-hidden bg-white flex flex-col'>
      <Header />
      <WelcomeMessage create={goToCreate}/>
      {
        tab==="notes"?
        <NotesCardContainer view={goToView}/>:
        tab==="create"?
        <CreateNote  notes={goToNotes}/>:
        <h1>Not found</h1>
      }

    </div>
  )
}

export default UserLayout
