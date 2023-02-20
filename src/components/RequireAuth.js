import {useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'


//verify the validity of the access token

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.accessToken ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />

    );


}

export default RequireAuth;