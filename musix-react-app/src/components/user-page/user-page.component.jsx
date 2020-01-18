import React from 'react';
import Login from '../login/login.component';
import { Switch, Route, Redirect } from 'react-router-dom';
import Register from '../register/register.component';
import Profile from '../profile/profile.component';

const UserPage = ({isLoggedIn, completeLogin, completePasswordUpdate}) => (
    <div className='user-page'>
        <Switch>
            <Route exact path='/user/login'>
                {!isLoggedIn ? (
                    <Login completeLogin={completeLogin} />
                ) : (
                    <Redirect to={{ pathname: "/app" }}/>
                )}
            </Route>
            <Route exact path='/user/register'>
                {!isLoggedIn ? (
                    <Register completeLogin={completeLogin} />
                ) : (
                    <Redirect to={{ pathname: "/app" }}/>
                )}
            </Route>
            <Route exact path='/user/profile'>
                {isLoggedIn ? (
                    <Profile completePasswordUpdate={completePasswordUpdate} />
                ) : (
                    <Redirect to={{ pathname: "/app" }}/>
                )}
            </Route>
            <Route exact path='*'>
                <Redirect to={{ pathname: "/app" }}/>
            </Route>
        </Switch>
    </div>
)
export default UserPage;