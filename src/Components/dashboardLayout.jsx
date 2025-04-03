import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import ChatList from './chatList';
import './dashboardLayout.css';
import DashboardContent from './dashboardContent';
import app from '../firebaseConfig';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
          await signOut(auth);
          setSuccess("Logged out successfully!");
          navigate('/login');
          console.log("Log out successful");

        } catch (error) {
          setError(error.message);
        }
      };

    return (
        <div className="dashboardLayout">
            <div className="userbar">
                <header>
                    <Link to={'/'}>
                        <span>HypeMan</span>
                    </Link>
                    <div className="user-info">
                        <button onClick={handleLogout}>Log Out</button>
                        {user && <span>{user.email}</span>}
                    </div>
                </header>
            </div>

            <div className="just">
                <div className="menu"><ChatList /></div>
                <div className="content">
                    <Outlet />
                </div>
            </div>
            
        </div>
    )
}

export default DashboardLayout