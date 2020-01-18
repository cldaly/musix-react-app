import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Axios from 'axios';
import './login.styles.css';
import { Alert } from '../alert/alert.component';

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            emailError: {
                status:false,
                message:''
            },
            passwordError: {
                status:false,
                message:''
            },
            submitted: false,
            errorMessage: '',
            loading: false
        }
    }

    validate = () => {
        this.setState({ submitted:true }, () => {
            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;

            let eStatus = {status:false,message: ""}
            let pStatus = {status:false,message: ""}

            if (email === '' || email === undefined || email === null){
                eStatus = {status:true,message:"Email is required"};
            }
            if (password === '' || password === undefined || password == null) {
                pStatus = {status:true,message:"Password is required"};
            }

            this.setState({ emailError:eStatus, passwordError:pStatus },() => {
                if (!this.state.emailError.status && !this.state.passwordError.status) {
                    this.authenticate(email, password);
                }
            })
        });
    }

    authenticate = (email, password) => {
        this.setState({loading:true}, () => {
            Axios.post('http://localhost:8080/users/authenticate',{email, password})
            .then(data => {
                return JSON.parse(data.request.response);
            }).then(data => {
                let user = new User(email);
                user.userId = data["user_id"];
                user.token = data["jwt"];
    
                Axios.get('http://localhost:8080/users/getuserimage', {params: {user_id: user.userId, Authorization: `Bearer ${user.token}`}})
                .then(data => {
                    return JSON.parse(data.request.response);
                }).then(userData => {
                    user.profileImg = `data:image/png;base64, ${userData["profileImage"]}`;
                    user.email = userData['email'];
                    if (user.token !== undefined && user.token !== null) {
                        this.props.completeLogin(user,'login');
                    } else {
                        this.setState({errorMessage:'Unable to login at this time...', loading:false })
                    }
                })
            }).catch(() => {
                this.setState({errorMessage:'Invalid Username or Password', loading:false })
            })
        })
    }

    closeAlert = () => (this.setState({errorMessage:''}));

    render(){
        const {emailError, passwordError, submitted, loading, errorMessage} = this.state;
        return(
            <div className='login'>
                <h2>Welcome to Musix App</h2>
                {errorMessage !== '' && <Alert message={errorMessage} closeAlert={this.closeAlert} />}
                <div className='login-page'>
                    <h4>Login</h4>
                    <form className="loginForm" autoComplete='off' noValidate>
                        <FormControl error={emailError.status}>
                            <InputLabel htmlFor='email'>Email</InputLabel>
                            <Input id='email' type='text' />
                            {(emailError.status && submitted) && <FormHelperText error>{emailError.message}</FormHelperText>}
                        </FormControl>
                        <FormControl error={passwordError.status}>
                            <InputLabel htmlFor='password'>Password</InputLabel>
                            <Input id='password' type='password' />
                            {(passwordError.status && submitted) && <FormHelperText error>{passwordError.message}</FormHelperText>}
                        </FormControl>
                        <Button disableFocusRipple={true} id='login-btn' onClick={this.validate} variant="contained" color="primary">
                            {loading && <span className="loading"></span>}
                            <span>Login</span>
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
}
class User {
    userId;
    email;
    profileImg;
    constructor(email){
        this.email = email;
        this.token = undefined;
    }
}


export default Login;