import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, log } from '../_actions/user_actions';
import { RootState } from '../_reducers/index';
import { SERVER } from "../config.json";
import { Link } from 'react-router-dom';


function HomePage() {

    const [Territorios, setTerritorios] = useState([]);

    useEffect(() => {

        (async () => {
            const datos = await Axios(`${SERVER}/api/buildings/territorios`)
            console.log("Cantidad de territorios:", datos.data.territorios);
            setTerritorios(datos.data.territorios)
        })();

    }, [])


    const territorios = () => {
        return (
            Territorios.map(territorio => (

                <a type="button" className="btn btn-danger" style={btnTerri} href={`/territorios/${territorio}`}>
                    <h2 className="h-100 align-middle" style={{padding:'22%', fontFamily:'"Arial Black", Gadget, sans-serif'}}>{territorio}</h2>
                </a>
                    
            ))
        )
    };

    const btnTerri = {
        width: '120px',
        height: '100px',
        borderRadius: '15px',
        marginBottom: '40px',
    };
    
    return (

        <div className="container" style={{paddingTop:'60px', marginBottom:'50px'}}>

            <div className="row" style={{marginBottom:'20px'}}>
                <h1 style={{display:'block', margin:'auto', textAlign:'center'}}>
                    SELECCIONE UN TERRITORIO
                </h1>
            </div>

            <div className="row" style={{padding:'60px', paddingTop:'40px', justifyContent:'space-evenly'}} id="columna">
            
                {territorios()}
            
            </div>

        </div>
    )
};


export default HomePage;
