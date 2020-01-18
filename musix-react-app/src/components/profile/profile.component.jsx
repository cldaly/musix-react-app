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

import './profile.styles.css';
import { Alert } from '../alert/alert.component';
import { Icon } from '@material-ui/core';

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
        const oldPass = document.getElementById('old-password').value;
        const newPass = document.getElementById('new-password').value;
        const conPass = document.getElementById('conf-password').value;

        
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
                            <Button className='update-btn' variant="contained" color='primary'>
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
                                <Button className='update-btn' variant="contained" color='primary'>
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
                                    <Button startIcon={<Icon>delete</Icon>} variant="contained" color="secondary">Delete Profile</Button>
                                ) : (
                                        <Button startIcon={<Icon>delete</Icon>} variant="contained" color="secondary">
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