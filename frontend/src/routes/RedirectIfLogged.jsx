import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const RedirectIfLogged = () => {
    const user = useSelector((state)=>state.user.activeUser);
    return user ? <Navigate to="/home"/> : <Navigate to = "/auth/login"/>
}

export default RedirectIfLogged
