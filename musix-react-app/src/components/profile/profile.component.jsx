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
            submitted: false,
            loading: false,
            confirmDelete: true
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
        this.setState({loading:true}, () => {
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
                this.setState({errorMessage:'Something went wrong, please try again later'});
            })
        });
    }

    render() {
        const { errorMessage, passwordErrorOld, passwordErrorNew, passwordErrorConf, submitted, loading, confirmDelete } = this.state;
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
                                {loading && <span className="loading"></span>}
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
                                    <Input disableUnderline={true} onChange={this.uploadPicture} className='upload-field' id='picture' type='file' />
                                </FormControl>
                                <Button disableFocusRipple={true} className='update-btn' variant="contained" color='primary'>
                                    {loading && <span className="loading"></span>}
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
                                {confirmDelete ? (
                                    <Button disableFocusRipple={true} startIcon={<Icon>delete</Icon>} variant="contained" color="secondary">Delete Profile</Button>
                                ) : (
                                    <Button disableFocusRipple={true} startIcon={<Icon>delete</Icon>} variant="contained" color="secondary">
                                        <span>Confirm Delete</span>
                                        {loading && <span className="loading"></span>}
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