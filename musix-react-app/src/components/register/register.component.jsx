import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Axios from 'axios';
import './register.styles.css';
import { Alert } from '../alert/alert.component';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage:'',
            submitted: false,
            loading:false,
            emailError: {status:false,message:''},
            passwordError: {status:false,message:''},
            confirmError: {status:false,message:''},
            pictureError: {status:false, message:''}
        }
    }

    file = new File([''],'none',{type: "image/png"});

    uploadPicture = (event) => {
        this.file = event.target.files[0];
    }

    validate = () => {
        this.setState({ submitted:true }, () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            let eStatus = { status:false,message: '' }
            let pStatus = { status:false,message: '' }
            let cStatus = { status:false,message: '' }
            let iStatus = { status:false, message: '' }

            if (email === '' || email === undefined || email === null) {
                eStatus = { status:true,message: 'Email is required' }
            } else {
                let re = /\S+@\S+\.\S+/;
                if (!re.test(email)) {
                    eStatus = { status:true,message: 'Not a valid email' }
                }
            }
            if (password === '' || password === undefined || password === null) {
                pStatus = { status:true,message: 'Password is required' }
            } else if (password.length < 6) {
                pStatus = { status:true,message: 'Minimum length 6 characters' }
            }
            if (confirmPassword === '' || confirmPassword === undefined || confirmPassword === null) {
                cStatus = { status:true,message: 'Confirmation is required' }
            } else if (confirmPassword.length < 6) {
                cStatus = { status:true,message: 'Minimum length 6 characters' }
            } 
            if (!eStatus.status && !pStatus.status && password !== confirmPassword) {
                pStatus = { status:true,message: 'Passwords do not match' };
                cStatus = { status:true,message: 'Passwords do not match' };
            }

            if (this.file.size >= 1048576) {
                iStatus = {status:true, message: 'File size too large (1mb max)'}
            }

            this.setState({emailError:eStatus, passwordError:pStatus, confirmError: cStatus, pictureError:iStatus}, () => {
                if (!this.state.emailError.status && !this.state.passwordError.status && !this.state.confirmError.status && !this.state.pictureError.status) {
                    this.registerUser(email, password, confirmPassword);
                }
            })
        })
    }

    registerUser = (email, password, confirmPassword) => {

        let userDto = {
            email:email,
            picture: `C:\\fakepath\\${this.file.name}`,
            password:password,
            confPassword:confirmPassword
        }
        
        this.setState({loading:true}, () => {
            const formdata = new FormData();
            formdata.append('user', JSON.stringify(userDto));
            formdata.append('file', this.file)
            Axios.post('http://localhost:8080/users/adduser',formdata).then(() => {
                this.loginUser(email, password);
            }).catch(() => {
                this.setState({errorMessage:'Email provided is already taken', loading: false})
            })
        })
    }

    loginUser = (email, password) => {
        let user = new User(email);
        Axios.post('http://localhost:8080/users/authenticate',{email, password})
        .then(data => {
            return JSON.parse(data.request.response);
        }).then(userdata => {
            user.userId = userdata["user_id"];
            user.token = userdata["jwt"];
            Axios.get('http://localhost:8080/users/getuserimage', {params: {user_id: user.userId, Authorization: `Bearer ${user.token}`}})
            .then(data => {
                return JSON.parse(data.request.response);
            }).then(userprofile => {
                user.profileImg = `data:image/png;base64, ${userprofile["profileImage"]}`;
                user.email = userprofile['email'];
                if (user.token !== undefined && user.token !== null) {
                    this.props.completeLogin(user,'register');
                } else {
                    this.setState({errorMessage:'Something went wrong, please try again later', loading:false })
                }
            })
        }).catch(() => {
            this.setState({errorMessage:'Something went wrong, please try again later', loading: false})
        })
    }

    closeAlert = () => (this.setState({errorMessage:''}));

    render(){
        const {emailError, passwordError, confirmError, submitted, loading, errorMessage, pictureError} = this.state;
        return(
            <div className="register">
                <h2>Welcome to Musix App</h2>
                {errorMessage !== '' && <Alert message={errorMessage} closeAlert={this.closeAlert} />}
                <div className="register-page">
                    <h4>Register</h4>
                    <form className='registerForm' autoComplete='off' noValidate>
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
                        <FormControl error={confirmError.status}>
                            <InputLabel htmlFor='confirm-password'>Confirm Password</InputLabel>
                            <Input id='confirm-password' type='password' />
                            {(confirmError.status && submitted) && <FormHelperText error>{confirmError.message}</FormHelperText>}
                        </FormControl>
                        <FormControl error={pictureError.status}>
                            <Input onChange={this.uploadPicture} className='upload-field' id='picture' type='file' />
                            {pictureError.status ? (
                                <FormHelperText error>{pictureError.message}</FormHelperText>
                            ) : (
                                <FormHelperText>Profile Picture</FormHelperText>
                            )}
                                
                        </FormControl>
                        <Button disableFocusRipple={true} id='register-btn' onClick={this.validate} variant="contained" color="primary">
                            {loading && <span className="loading"></span>}
                            <span>Register</span>
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

export default Register;