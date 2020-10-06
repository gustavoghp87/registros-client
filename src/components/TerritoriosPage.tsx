import React, { useState, useEffect } from 'react'
import { Dropdown, Button, ButtonGroup, ToggleButton, Col } from 'react-bootstrap'
//import Axios from 'axios'
//import { SERVER } from '../config.json'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { ParamTypes, ITerritorio, IVivienda } from '../hoc/types'
import { Loading } from './_Loading'
import { ReturnBtn } from './_Return'
import { mobile } from './_App'
import { timeConverter } from '../hoc/functions'
import { useQuery, useMutation } from '@apollo/client'
import * as graphql from '../hoc/graphql'


function TerritoriosPage(props:any) {

    const { territorio } = useParams<ParamTypes>()
    const [viviendas, setviviendas] = useState<ITerritorio>({unterritorio:[]})
    const [radioValue, setRadioValue] = useState('1')
    const [radioMValue, setRadioMValue] = useState('1')
    const [manzana, setManzana] = useState('1')
    const [showMap, setShowMap] = useState(false)
    const [change, setChange] = useState(false)

    let variables = {terr:territorio, manzana, token: document.cookie}
    if (radioMValue==='1') variables = {terr:territorio, manzana:'1', token: document.cookie}
    if (radioMValue==='2') variables = {terr:territorio, manzana:'2', token: document.cookie}
    if (radioMValue==='3') variables = {terr:territorio, manzana:'3', token: document.cookie}
    if (radioMValue==='4') variables = {terr:territorio, manzana:'4', token: document.cookie}
    if (radioMValue==='5') variables = {terr:territorio, manzana:'5', token: document.cookie}
    if (radioMValue==='6') variables = {terr:territorio, manzana:'6', token: document.cookie}

    const count = useQuery(graphql.COUNTBLOCKS, {variables: {terr:territorio}}).data
    const { loading, error, data } = useQuery(graphql.GETTERRITORY, {variables})
    if (loading) console.log("Loading graphql", loading)
    if (error) console.log("Error graphql")
    //console.log(count)

    const radios = mobile ? 
    [
        { name: radioValue==='1' ? 'Viendo no pred' : 'Ver no pred', value: '1' },
        { name: radioValue==='2' ? 'Viendo todos' : 'Ver todos', value: '2' },
        { name: radioValue==='3' ? 'Viendo estad' : 'Ver estad', value: '3' },
    ]
    : [
        { name: radioValue==='1' ? 'Viendo no predicados' : 'Ver no predicados', value: '1' },
        { name: radioValue==='2' ? 'Viendo todos' : 'Ver todos', value: '2' },
        { name: radioValue==='3' ? 'Viendo estadísticas' : 'Ver estadísticas', value: '3' }
    ]

    let radiosM = [
        { name: mobile ? 'Manz 1' : 'Manzana 1', value: '1' }
    ]

    try {
        for(let i=2; i<=count.countBlocks.cantidad; i++) {
            radiosM.push( {name: mobile ? `Manz ${i}` : `Manzana ${i}`, value: i.toString() })
        }
    } catch {}


    const [changeState] = useMutation(graphql.changeState)

    const cambiarEstado = (inner_id:String, estado:String) => {
        changeState({ variables: {inner_id, estado, token:document.cookie} })
            .then(async (response) => {
                const inner_id = await response.data.cambiarEstado.inner_id
                const estadoNuevo = await response.data.cambiarEstado.estado
                const fechaUlt = await response.data.cambiarEstado.fechaUlt
                let nuevoViviendas = viviendas
                setviviendas(nuevoViviendas)

                //console.log(viviendas)
            }
        )
    }

console.log(props);


    useEffect(() => {
        if (data) setviviendas({unterritorio: data.getApartmentsByTerritory}) 
        setChange(false)
    }, [data, change])


    return (
        <>
            {ReturnBtn(props)}

            <h1 style={{textAlign:'center', margin: mobile ? '80px auto 20px auto' : '60px auto 40px auto', fontSize: mobile ? '1.9rem' : '2.8rem', fontWeight:'bolder'}}>
                TERRITORIO {territorio}
            </h1>

            <Button variant="dark" onClick={() => setShowMap(!showMap)} style={{display:'block', margin:'22px auto'}}>
                {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
            </Button>

            <img src={`/img/${territorio}.jpg`} alt="map" style={{border:'1px solid black', borderRadius:'8px', width: mobile ? '99%' : '40%', height:'auto', display: showMap ? 'block' : 'none', margin:'30px auto', padding: mobile ? '10px' : '20px'}} />


            <Col style={{textAlign:'center', marginBottom:'30px', padding: mobile ? '0' : '5px'}}>
                {count && !!count.countBlocks.cantidad &&
                    <div style={{marginBottom:'10px'}}>
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
                viviendas.unterritorio.map((vivienda:IVivienda) => {

                    if (vivienda.estado==="No predicado") vivienda = {...vivienda, variante: "success"}
                    if (vivienda.estado==="Contestó") vivienda = {...vivienda, variante: "primary"}
                    if (vivienda.estado==="No contestó") vivienda = {...vivienda, variante: "warning"}
                    if (vivienda.estado==="A dejar carta") vivienda = {...vivienda, variante: "danger"}
                    if (vivienda.estado==="No llamar") vivienda = {...vivienda, variante: "dark"}
                    //console.log(vivienda)

                return (<div key={vivienda.inner_id}>
                    <div className="card" style={{marginBottom:'50px'}}>
                        <div className="card-body" style={{paddingTop:'15px', paddingBottom:'15px'}}>
                            <div className="row" style={{margin:'25px'}}>

                    <div className="col-lg-2" style={{margin:'auto'}}>

                        <h4 style={{textAlign:'center', fontSize:'1.1rem'}}>
                            Territorio {vivienda.territorio} <br/>
                            Manzana {vivienda.manzana} <br/>
                            Vivienda {vivienda.inner_id}
                        </h4>
                    </div>

                    <div className="col-lg-4" style={{ marginBottom: '20px' }}>
                        <div className="row" style={{ paddingBottom: '10px' }}>
                            <h4 style={{textAlign:'center', display:'block', margin:'auto', fontSize:'1.9rem'}}>
                                Dirección: {vivienda.direccion}
                            </h4>
                        </div>
                        <div className="row" style={{padding:'20px 0 1% 0'}}>
                            <h4 style={{textAlign:"center", display:"block", margin:"auto", fontSize:'2.1rem'}}>
                            Teléfono:
                            <div style={{marginTop:'7px'}}>
                                <Link to={`tel:${vivienda.telefono}`}> {vivienda.telefono} </Link>
                            </div>
                            </h4>
                        </div>
                    </div>


                    <div className="col-lg-3">

                        <div className="row" style={{textAlign:"center", height:"50%", margin: mobile ? '50 auto' : '0 auto'}}>

    <Dropdown style={{width:'100%', margin: mobile ? '25px auto' : '30px auto'}}>

        <Dropdown.Toggle id="dropdown-basic" style={{width:'80%'}} variant={vivienda.variante}>
            {vivienda.estado}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item onClick={()=>{cambiarEstado(vivienda.inner_id, "No predicado")}}>No predicado</Dropdown.Item>
            <Dropdown.Item onClick={()=>{cambiarEstado(vivienda.inner_id, "Contestó")}}>Contestó</Dropdown.Item>
            <Dropdown.Item onClick={()=>{cambiarEstado(vivienda.inner_id, "No contestó")}}>No contestó</Dropdown.Item>
            <Dropdown.Item onClick={()=>{cambiarEstado(vivienda.inner_id, "A dejar carta")}}>A dejar carta</Dropdown.Item>
            <Dropdown.Item onClick={()=>{cambiarEstado(vivienda.inner_id, "No llamar")}}>No llamar</Dropdown.Item>
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
                </div>)})
            }

            {!viviendas.unterritorio.length && <Loading />}

        </>
    )
}


export default TerritoriosPage
