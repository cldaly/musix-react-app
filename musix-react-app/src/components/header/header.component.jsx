import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import './header.styles.css';

export const Header = ({isLoggedIn, logout, profileImage}) => {
    return (
        <header className='header'>
            <h2><Link to='/app'>Musix App</Link></h2>
            {!isLoggedIn ? (
                <nav>
                    <li><Link to='/user/login'>Sign in</Link></li>
                    <li><Link to='/user/register'>Register</Link></li>
                </nav>
                
            ) : (
                <nav>
                    <li>
                        <Tooltip title='Click to edit profile' enterDelay={100} arrow>
                            <Link to='/user/profile'><img alt='pic'className="header-profile" src={profileImage} /></Link>
                        </Tooltip>
                    </li>
                    <li><Link onClick={logout} to='/app'>Logout</Link></li>
                </nav>
            )}
        </header>
    )
}