import React from 'react'
import { MdWavingHand } from "react-icons/md";
import { MdAttachEmail } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import {useSelector} from "react-redux"
const WelcomeMessage = ({create}) => {
  const user = useSelector((state)=>state.user.activeUser);
  return (
<div className="w-full px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-blue-100 shadow-sm rounded-md">
  {/* Welcome Text */}
  <div>
    <p className="text-[18px] font-medium flex items-center gap-2 text-gray-800">
      <MdWavingHand className="text-yellow-500 text-[20px]" />
      Welcome back, {user?.name}!
    </p>
    <p className="text-[12px] flex items-center gap-2 ml-6 text-gray-600">
      <MdAttachEmail className="text-[14px] mt-[1px]" />
      {user?.email?.id}
    </p>
  </div>

  {/* Button */}
  <button
    className="w-fit self-end sm:self-auto flex items-center gap-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md shadow transition cursor-pointer"
    onClick={create}
  >
    <GoPlus className="text-[16px]" />
    Add new note
  </button>
</div>

  )
}

export default WelcomeMessage
