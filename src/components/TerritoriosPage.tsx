import React, { useState, useEffect } from 'react'
import { Dropdown, ButtonGroup, ToggleButton, Col } from 'react-bootstrap'
//import Axios from 'axios'
//import { SERVER } from '../config.json'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { ParamTypes, ITerritorio, IVivienda } from '../hoc/types'
import { Loading } from './_Loading'
import { ReturnBtn } from './_Return'
import { H2 } from './css/css'
import { timeConverter } from '../hoc/functions'
import { useQuery } from '@apollo/client'
import * as graphql from '../hoc/graphql'


function TerritoriosPage(props:any) {

    const { territorio } = useParams<ParamTypes>()
    const [viviendas, setviviendas] = useState<ITerritorio>({unterritorio:[]})
    const [radioValue, setRadioValue] = useState('1')
    const [radioMValue, setRadioMValue] = useState('1')
    const [manzana, setManzana] = useState('1')

    let variables = {terr:territorio, manzana, token: document.cookie}
    if (radioMValue==='1') variables = {terr:territorio, manzana:'1', token: document.cookie}
    if (radioMValue==='2') variables = {terr:territorio, manzana:'2', token: document.cookie}
    if (radioMValue==='3') variables = {terr:territorio, manzana:'3', token: document.cookie}
    if (radioMValue==='4') variables = {terr:territorio, manzana:'4', token: document.cookie}
    if (radioMValue==='5') variables = {terr:territorio, manzana:'5', token: document.cookie}
    if (radioMValue==='6') variables = {terr:territorio, manzana:'6', token: document.cookie}

    const count = useQuery(graphql.COUNTBLOCKS, {variables: {terr:territorio}}).data
    const { loading, error, data } = useQuery(graphql.GETTERRITORY, {variables})
    console.log(count)

    const radios = [
        { name: radioValue==='1' ? 'Viendo no predicados' : 'Ver no predicados', value: '1' },
        { name: radioValue==='2' ? 'Viendo todos' : 'Ver todos', value: '2' },
        { name: radioValue==='3' ? 'Viendo estadísticas' : 'Ver estadísticas', value: '3' },
    ]

    let radiosM = [
        { name: 'Manzana 1', value: '1' }
    ]

    try {
        for(let i=2; i<=count.countBlocks.cantidad; i++) {
            radiosM.push( {name: `Manzana ${i}`, value: i.toString() })
        }
    } catch {}



    useEffect(() => {
        // const call = async (territorio:string) => {
        //     const axios = await Axios.post(`${SERVER}/api/buildings/getBuildings/${territorio}`, {
        //         token: document.cookie
        //     });
        //     setviviendas(axios.data)
        // }
        // call(territorio)

        if (loading) console.log("Loading graphql", loading)
        if (error) console.log("Error graphql")
        if (data) setviviendas({unterritorio: data.getApartmentsByTerritory})
    }, [data])


    return (
        <>
            {ReturnBtn(props)}
            <H2 style={{textAlign:'center'}}> TERRITORIO {territorio} </H2>
            <br/>
            <br/>

            
            <Col style={{textAlign:'center', marginBottom:'40px'}}>
                {count && !!count.countBlocks.cantidad &&
                    
                    <div style={{textAlign:'center', marginBottom:'10px'}}>
                        <ButtonGroup toggle>
                            {radiosM.map((radio, idx) => (
                                <ToggleButton
                                    key={idx} type="radio" variant="danger" name="radio" value={radio.value}
                                    checked={radioMValue === radio.value}
                                    onChange={(e) => setRadioMValue(e.currentTarget.value)}
                                >
                                    {radio.name}
                                </ToggleButton>
                                
                            ))}
                        </ButtonGroup>
                        <br/>
                    </div>
                }

                {viviendas && !!viviendas.unterritorio.length &&
                    <ButtonGroup toggle>
                        {radios.map((radio, idx) => (
                            <ToggleButton
                                key={idx} type="radio" variant="danger" name="radio" value={radio.value} checked={radioValue === radio.value} onChange={(e) => {setRadioValue(e.currentTarget.value); setManzana(e.currentTarget.value)}}
                            >
                                {radio.name}
                            </ToggleButton>
                            
                        ))}
                    </ButtonGroup>
                }
            </Col>


            {viviendas && !!viviendas.unterritorio.length &&
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
                                    <Link to={`tel:${vivienda.telefono}`}> {vivienda.telefono} </Link>
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
                                            Se llamó el {timeConverter(vivienda.fechaUlt, true)}
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
            }

            {!viviendas.unterritorio.length && <Loading />}

        </>
    )
}


export default TerritoriosPage
