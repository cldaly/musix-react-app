import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Icon } from '@material-ui/core';
import Axios from 'axios';

import './profile.styles.css';
import { Alert } from '../alert/alert.component';


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            passwordErrorOld: { status: false, message: '' },
            passwordErrorNew: { status: false, message: '' },
            passwordErrorConf: { status: false, message: '' },
            pictureError: { status: false, message: '' },
            submitted: false,
            passwordLoading:false, 
            pictureLoading:false, 
            deleteLoading:false,
            confirmDelete: false
        }
    }

    closeAlert = () => {
        this.setState({ errorMessage: '' });
    }

    validatePassword = () => {
        this.setState({submitted:true}, () => {
            const oldPass = document.getElementById('old-password').value;
            const newPass = document.getElementById('new-password').value;
            const conPass = document.getElementById('conf-password').value;

            let opError = { status: false, message: '' };
            let npError = { status: false, message: '' };
            let cpError = { status: false, message: '' };

            if (oldPass === '' || oldPass === undefined || oldPass === null) {
                opError = { status: true, message: 'Old password is required' }
            }

            if (newPass === '' || newPass === undefined || newPass === null) {
                npError = { status: true, message: 'New password is required' }
            } else if (newPass.length < 6) {
                npError = { status: true, message: 'Minimin 6 characters' }
            }

            if (conPass === '' || conPass === undefined || conPass === null) {
                cpError = { status: true, message: 'Confirmation is required' }
            } else if (conPass.length < 6) {
                cpError = { status: true, message: 'Minimin 6 characters' }
            }
            
            if (!npError.status && !cpError.status && newPass === oldPass) {
                npError = { status: true, message: 'New password same as old' }
                cpError = { status: true, message: '' }
            } else if (!npError.status && !cpError.status && newPass !== conPass) {
                npError = { status: true, message: '' }
                cpError = { status: true, message: `Confirmation doesn't match` }
            }

            this.setState({passwordErrorOld:opError, passwordErrorNew: npError, passwordErrorConf:cpError}, () => {
                if (!this.state.passwordErrorOld.status && !this.state.passwordErrorNew.status && !this.state.passwordErrorConf.status) {
                    this.updatePassword(oldPass,newPass);
                }
            });
        });
    }

    updatePassword = (oldPassword, newPassword) => {
        this.setState({passwordLoading:true}, () => {
            let formdata = new FormData();
            formdata.append('oldpassword', oldPassword);
            formdata.append('newpassword', newPassword);
            let token  = localStorage.getItem('Token');
            let userid = localStorage.getItem('userid');
            Axios.put('http://localhost:8080/users/changepassword',formdata,{params: {Authorization: `Bearer ${token}`, user_id: userid}})
            .then(() => {
                this.props.completePasswordUpdate();
            })
            .catch(err => {
                console.log(err);
                this.setState({errorMessage:'Something went wrong, please try again later', passwordLoading:false});
            })
        });
    }

    file = new File([''],'none',{type: "image/png"});

    uploadPicture = (event) => {
        this.file = event.target.files[0];
    }

    updatePicture = () => {
        this.setState({submitted: true}, () => {
            if (this.file.name === 'none') {
                this.setState({pictureError:{status:true, message:'No picture has been uploaded'}})
            } else if (this.file.size >= 1048576) {
                this.setState({pictureError: {status:true, message: 'File size too large (1mb max)'}})
            } else {
                this.setState({pictureError: { status: false, message: '' },pictureLoading:true}, () => {
                    let formdata = new FormData();
                    formdata.append('file', this.file);
                    let token  = localStorage.getItem('Token');
                    let userid = localStorage.getItem('userid');
                    Axios.put('http://localhost:8080/users/changeprofilepicture',formdata,{params: {Authorization: `Bearer ${token}`, user_id: userid}})
                    .then(() => {
                        Axios.get('http://localhost:8080/users/getuserimage', {params: {user_id: userid, Authorization: `Bearer ${token}`}})
                        .then(data => {
                            return JSON.parse(data.request.response);
                        }).then(user => {
                            this.props.completePictureUpdate(`data:image/png;base64, ${user["profileImage"]}`)
                            this.setState({pictureLoading:false}, () => {
                                this.file = new File([''],'none',{type: "image/png"});
                                document.getElementById('picture').value = null;
                            })
                        })
                    }).catch(err => {
                        console.log(err);
                        this.setState({errorMessage:'Something went wrong, please try again later', pictureLoading:false});
                    })
                })
            }
        })
    }

    confirmDelete = () => { this.setState({confirmDelete:true}) }

    deleteProfile = () => {
        this.setState({deleteLoading:true}, () => {
            let token  = localStorage.getItem('Token');
            let userid = localStorage.getItem('userid');
            Axios.delete('http://localhost:8080/users/deleteuser',{params: {user_id: userid, Authorization: `Bearer ${token}`}})
            .then(() => {
                this.props.completeProfileDelete();
            })
            .catch(err => {
                console.log(err);
                this.setState({confirmDelete:false, deleteLoading:false ,errorMessage:'Something went wrong, please try again later'});
            })
        })
    }

    render() {
        const { errorMessage, passwordErrorOld, passwordErrorNew, passwordErrorConf, pictureError, submitted, passwordLoading, pictureLoading, deleteLoading, confirmDelete } = this.state;
        return (
            <div className="profile">
                <h2>Your Profile</h2>
                {errorMessage !== '' && <Alert message={errorMessage} closeAlert={this.closeAlert} />}
                <div className="profile-main">
                    <h4>{localStorage.getItem('email')}</h4>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<Icon>keyboard_arrow_down</Icon>}>
                            <Icon className='title-icon'>account_circle</Icon>
                            <Typography>Change your password</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <form className='change-password'>
                                <FormControl error={passwordErrorOld.status}>
                                    <InputLabel htmlFor='old-password'>Old Password</InputLabel>
                                    <Input id='old-password' type='password' />
                                    {(passwordErrorOld.status && submitted) && <FormHelperText error>{passwordErrorOld.message}</FormHelperText>}
                                </FormControl>
                                <FormControl error={passwordErrorNew.status}>
                                    <InputLabel htmlFor='new-password'>New Password</InputLabel>
                                    <Input id='new-password' type='password' />
                                    {(passwordErrorNew.status && submitted) && <FormHelperText error>{passwordErrorNew.message}</FormHelperText>}
                                </FormControl>
                                <FormControl error={passwordErrorConf.status}>
                                    <InputLabel htmlFor='conf-password'>Confirm Password</InputLabel>
                                    <Input id='conf-password' type='password' />
                                    {(passwordErrorConf.status && submitted) && <FormHelperText error>{passwordErrorConf.message}</FormHelperText>}
                                </FormControl>
                            </form>
                            <Button disableFocusRipple={true} onClick={this.validatePassword} className='update-btn' variant="contained" color='primary'>
                                {passwordLoading && <span className="loading"></span>}
                                Change Password
                            </Button>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<Icon>keyboard_arrow_down</Icon>}>
                            <Icon className='title-icon'>add_photo_alternate</Icon>
                            <Typography>Update your profile picture</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <form className="update-picture">
                                <FormControl>
                                    <Input onChange={this.uploadPicture} disableUnderline={true} className='upload-field' id='picture' type='file' />
                                    {(pictureError.status && submitted) && <FormHelperText error>{pictureError.message}</FormHelperText>}
                                </FormControl>
                                <Button disableFocusRipple={true} className='update-btn' variant="contained" color='primary' onClick={this.updatePicture}>
                                    {pictureLoading && <span className="loading"></span>}
                                    Update picture
                                </Button>
                            </form>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<Icon>keyboard_arrow_down</Icon>}>
                            <Icon className='title-icon'>delete_forever</Icon>
                            <Typography>Delete your profile</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div className="delete">
                                <h4>Do you want to delete your profile? </h4>
                                {!confirmDelete ? (
                                    <Button onClick={this.confirmDelete} disableFocusRipple={true} variant="outlined" color="secondary">Delete Profile</Button>
                                ) : (
                                    <Button onClick={this.deleteProfile} disableFocusRipple={true} startIcon={<Icon>delete</Icon>} variant="contained" color="secondary">
                                        <span>Confirm Delete</span>
                                        {deleteLoading && <span className="loading"></span>}
                                    </Button>
                                )}
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
            </div>
        )
    }
}

export default Profile;