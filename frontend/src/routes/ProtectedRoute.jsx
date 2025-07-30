import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const user = useSelector((state)=>state.user.activeUser);
    return user ? children : <Navigate to="/auth/login" replace/>
}

export default ProtectedRoute;
