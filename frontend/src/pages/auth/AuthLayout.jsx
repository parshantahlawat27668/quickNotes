import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className='bg-[url("https://plus.unsplash.com/premium_photo-1683734676292-2e621c25be71?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-cover'>
      <Outlet/>
    </div>
  )
}

export default AuthLayout
