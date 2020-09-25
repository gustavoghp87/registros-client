import React from 'react';
// import { Button } from 'react-bootstrap';
// import Axios from 'axios';
// import { useSelector, useDispatch } from 'react-redux';
// import { increment, decrement, log } from '../_actions/user_actions';
// import { RootState } from '../_reducers/index';
// import { SERVER } from "../config.json";
import { useParams } from "react-router";


function TerritoriosPage() {

    interface ParamTypes {
        territorio: string
    };

    let { territorio } = useParams<ParamTypes>();
    console.log(useParams());
    
    return (
        <>
            <h2> Territorios Page </h2>
            <h3> Territorio {territorio} </h3>
        </>
    )
};


export default TerritoriosPage;
