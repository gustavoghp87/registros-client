import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import Axios from 'axios';
import { SERVER } from "../config.json";
import { useParams } from "react-router";
import { ParamTypes, ITerritorio, IVivienda } from '../types/types';
import { Loading } from './_Loading';


function TerritoriosPage() {

    let { territorio } = useParams<ParamTypes>();

    const [viviendas, setviviendas] = useState<ITerritorio>({unterritorio:[]});

    const call = async (territorio:string) => {
        const axios = await Axios.post(`${SERVER}/api/buildings/getBuildings/${territorio}`, {
            token: document.cookie
        });
        setviviendas(axios.data)
    };

    useEffect(() => {
        call(territorio)
    }, [])

    const formatTime = (timestamp:string) => {
        try {
            let time = new Date(parseInt(timestamp)).toString().split("GMT")[0];
            return time;    
        } catch {};
    };


    const rendering = () => {

        if (viviendas.unterritorio.length) {
        
            return (
                viviendas.unterritorio.map((vivienda:IVivienda) => (
                    <div className="card" key={vivienda.inner_id} style={{marginBottom:'50px'}}>
                        <div className="card-body" style={{paddingTop:'15px', paddingBottom:'15px'}}>
                            <div className="row" style={{margin:'25px'}}>

                                <div className="col-lg-2" style={{margin:'auto'}}>

                                    <h4 style={{textAlign:'center', fontSize:'1.2rem'}}>
                                        Territorio {vivienda.territorio} <br/>
                                        Manzana {vivienda.manzana} <br/>
                                        Vivienda {vivienda.inner_id}
                                    </h4>
                                </div>

                                <div className="col-lg-4" style={{ marginBottom: '10px' }}>
                                    <div className="row" style={{ paddingBottom: '20px' }}>
                                        <h4 style={{ textAlign: "center", display: "block", margin: "auto" }}>
                                            Dirección: {vivienda.direccion}
                                        </h4>
                                    </div>
                                    <div className="row" style={{paddingTop:'20px', paddingBottom:'1%'}}>
                                        <h4 style={{textAlign:"center", display:"block", margin:"auto"}}>
                                        Teléfono:
                                            <div style={{marginTop:'7px'}}>
                                                <a href={`tel:${vivienda.telefono}`}> {vivienda.telefono} </a>
                                            </div>
                                        </h4>
                                    </div>
                                </div>


                                <div className="col-lg-3">

                                    <div className="row" style={{textAlign:"center", height:"50%"}}>
                                        <Dropdown style={{width:'100%'}}>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic" style={{width:'80%'}}>
                                                {vivienda.estado}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item href="#/action-1">No predicado</Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">Contestó</Dropdown.Item>
                                                <Dropdown.Item href="#/action-3" onClick={()=>{alert("No contestó")}}>No contestó</Dropdown.Item>
                                                <Dropdown.Item href="#/action-4">A dejar carta</Dropdown.Item>
                                                <Dropdown.Item href="#/action-5">No llamar</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    
                                    <div className="row" style={{ height: "50%" }}>
                                        {vivienda.fechaUlt ?
                                            <div className="card border-dark mb-3" style={{ maxWidth: "18rem", backgroundColor: "rgb(214, 214, 214)", margin: "auto" }}>
                                                <div className="card-header" style={{ padding: "0.2rem 0.5rem" }}>
                                                    <p className="card-text">
                                                        Se llamó el {formatTime(vivienda.fechaUlt)}
                                                    </p>
                                                </div>
                                            </div>
                                            :
                                            <div></div>
                                        }
                                    </div>
                                </div>

                                <div className="col-lg-3">
                                    <div className="row" style={{textAlign:"center", height:"100%", marginLeft:'20px'}}>
                                        <div className="form-check" style={{display:"block", margin: "auto" }}>
                                            <input className="form-check-input" type="checkbox" id="checkbox{{inner_id}}" style={{ marginTop: "0.5rem", transform: "scale(1.5)", padding: 5, marginLeft: "0rem" }} onClick={()=>alert()} />
                                            <label className="form-check-label" htmlFor="defaultCheck1" style={{fontSize:"1.1rem", fontWeight:600}}>
                                                &nbsp; &nbsp; Teléfono no abonado en servicio
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                ))
            );

        } else {
            return <Loading />
        }
    };

    return (
        <>
            <h2 style={{textAlign:'center'}}> Territorios Page </h2>
            <h2 style={{textAlign:'center'}}> Territorio {territorio} </h2>
            <br/>
            <br/>

            {rendering()}

            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

        </>
    )
};


export default TerritoriosPage;
