import React from 'react'
import NoteCard from './NoteCard'
import { useSelector } from 'react-redux'
const NotesCardContainer = ({view}) => {
  const notes = useSelector((state)=>state.notes);

  return (
<div className="w-full h-full overflow-y-auto px-4 py-4 bg-blue-50">
  {notes.length < 1 ? (
    <div className="w-full h-full flex items-center justify-center">
      <h2 className="text-gray-500 text-lg font-medium">No notes yet</h2>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {notes.map((note, index) => (
        <NoteCard key={index} note={note} onClick={view} />
      ))}
    </div>
  )}
</div>

  )
}

export default NotesCardContainer
