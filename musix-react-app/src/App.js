import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Header } from './components/header/header.component';

import Icon from '@material-ui/core/Icon';
import './App.css';
import HomePage from './components/homepage/homepage.component';
import UserPage from './components/user-page/user-page.component';


class App extends Component {
  constructor(){
    super();
    this.state = {
      title: "Musix App",
      isLoggedIn: true,
      displayMessage: '',
      profileImage: ''
    }
  }

  componentDidMount = () => {
    if (localStorage.getItem('Token')) {
      this.setState({isLoggedIn:true, profileImage:localStorage.getItem('profileImage')})
    } else {
      this.setState({isLoggedIn:false})
    }
  }

  completeLogin = (user,type) => {
    localStorage.setItem('Token', user.token);
    localStorage.setItem('userid',user.userId);
    localStorage.setItem('profileImage',user.profileImg);
    localStorage.setItem('email', user.email);
    localStorage.setItem('log',true);

    let message;

    if (type === 'login') {
      message = 'You have been logged in!';
    } else {
      message = 'You have been registered!';
    }

    this.setState({profileImage:user.profileImg, isLoggedIn:true}, () => {
      this.generateMessage(message, 5);
    })
  }

  completePasswordUpdate = () => {
    this.setState({isLoggedIn:false}, () => {
      this.generateMessage('Your password has been updated, please log back in', 10);
      localStorage.clear();
    })
  }

  logout = () => {
    this.setState({isLoggedIn:false}, () => {
      this.generateMessage('You have been logged out',5);
      localStorage.clear();
    })
  }

  generateMessage = (message, seconds) => {
    if (this.state.displayMessage !== '') {
      clearTimeout(this.displayTimeout);
    } 
    this.setState({displayMessage:message}, () => {
      this.displayTimeout = setTimeout(() => {
        this.closeDisplay();
      },seconds * 1000);
    });
  }
  displayTimeout;
  closeDisplay = () => (this.setState({displayMessage:''}));

  render() {
    const {displayMessage} = this.state;
    return (
      <div className='musix-app'>
        <Header 
          isLoggedIn={this.state.isLoggedIn} 
          logout={this.logout} 
          profileImage={this.state.profileImage} 
        />
        <div className='main'>
          {displayMessage !== '' && (
            <div className='display'>
              <p>{displayMessage}</p>
              <Icon className='close' onClick={this.closeDisplay}>close</Icon>
            </div>
          )}
          <Switch>
            <Route path='/app'>
              <h2>Welcome to {this.state.title}</h2>
              <HomePage isLoggedIn={this.state.isLoggedIn}
                displayMessage={this.state.displayMessage} 
                closeDisplay={this.closeDisplay}
              />
            </Route>
            <Route path='/user'>
              <UserPage 
                isLoggedIn={this.state.isLoggedIn}
                completeLogin={this.completeLogin}
                completePasswordUpdate={this.completePasswordUpdate}
              />
            </Route>
            <Route exact path='*'>
              <Redirect to={{ pathname: "/app" }}/>
            </Route>
          </Switch>
        </div>
      </div>
    )
  }
}

export default App;
