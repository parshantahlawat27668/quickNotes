import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const PublicRoute = ({children}) => {

    const user = useSelector((state)=>state.user.activeUser);
    return user ? <Navigate to="/home"/> : children;
};

export default PublicRoute;
