import React from 'react';
import { Button } from 'react-bootstrap';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, log } from '../_actions/user_actions';
import { RootState } from '../_reducers/index';
import { SERVER } from "../config.json";


function UserPage() {
    
    
    return (
        <h2> User Page </h2>
    )
};


export default UserPage;
