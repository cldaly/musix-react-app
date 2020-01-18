import React from 'react';
import Icon from '@material-ui/core/Icon';
import './alert.styles.css';

export const Alert = ({message, closeAlert}) => (
    <div className="error-alert" onClick={closeAlert}>
        <p>{ message }</p>
        <Icon className='close'>close</Icon>
    </div>
)