import React, { useState, useEffect } from 'react'
import { Button, Card, Container, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import { typeParam, typeTerritorio, typeVivienda } from '../hoc/types'
import { Loading } from './_Loading'
import { ReturnBtn } from './_Return'
import { mobile } from './_App'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import * as graphql from '../hoc/graphql'
import { Col0a } from './columns/Col0a'
import { Col0b } from './columns/Col0b'
import { Col1 } from './columns/Col1'
import { Col2 } from './columns/Col2'
import { Col3 } from './columns/Col3'
import { Col4 } from './columns/Col4'


function TerritoriosPage(props:any) {

    const { territorio, manzana, todo } = useParams<typeParam>()
    const [viviendas, setviviendas] = useState<typeTerritorio>({unterritorio:[]})
    const [showMap, setShowMap] = useState(false)
    const [radioMValue, setRadioMValue] = useState('1')

    const isTodo = todo==='todo' ? true : false

    let variables = {terr:territorio, manzana, token:document.cookie, todo:isTodo}
    if (manzana==='1') variables = {terr:territorio, manzana:'1', token:document.cookie, todo:isTodo}
    if (manzana==='2') variables = {terr:territorio, manzana:'2', token:document.cookie, todo:isTodo}
    if (manzana==='3') variables = {terr:territorio, manzana:'3', token:document.cookie, todo:isTodo}
    if (manzana==='4') variables = {terr:territorio, manzana:'4', token:document.cookie, todo:isTodo}
    if (manzana==='5') variables = {terr:territorio, manzana:'5', token:document.cookie, todo:isTodo}
    if (manzana==='6') variables = {terr:territorio, manzana:'6', token:document.cookie, todo:isTodo}


    const data = useQuery(graphql.GETTERRITORY, {variables}).data

    try {console.log("PARAMS", territorio, manzana, todo, data)} catch {}


    const count = useQuery(graphql.COUNTBLOCKS, {variables: {terr:territorio}}).data
    const escuchar = useSubscription(graphql.ESCUCHARCAMBIODEESTADO)
    const [changeState] = useMutation(graphql.CHANGESTATE)
    
    const cambiarEstado = (inner_id:String, estado:String, noAbonado:Boolean|null) => {
        if (!noAbonado) noAbonado = false
        changeState({ variables: {inner_id, estado, noAbonado, token:document.cookie} })
    }

    useEffect(() => {
        if (data) setviviendas({unterritorio: data.getApartmentsByTerritory})
        if (escuchar.data) {
            let nuevoTodo:any = {unterritorio: []}
            viviendas.unterritorio.forEach((vivienda:typeVivienda, index:number) => {
                if (vivienda.inner_id === escuchar.data.escucharCambioDeEstado.inner_id) {
                    nuevoTodo.unterritorio.push({
                        estado: escuchar.data.escucharCambioDeEstado.estado,
                        inner_id: escuchar.data.escucharCambioDeEstado.inner_id,
                        territorio: escuchar.data.escucharCambioDeEstado.territorio,
                        manzana: escuchar.data.escucharCambioDeEstado.manzana,
                        direccion: escuchar.data.escucharCambioDeEstado.direccion,
                        telefono: escuchar.data.escucharCambioDeEstado.telefono,
                        noAbonado: escuchar.data.escucharCambioDeEstado.noAbonado,
                        fechaUlt: escuchar.data.escucharCambioDeEstado.fechaUlt
                    })
                } else {
                    nuevoTodo.unterritorio.push({
                        estado: viviendas.unterritorio[index].estado,
                        inner_id: viviendas.unterritorio[index].inner_id,
                        territorio: viviendas.unterritorio[index].territorio,
                        manzana: viviendas.unterritorio[index].manzana,
                        direccion: viviendas.unterritorio[index].direccion,
                        telefono: viviendas.unterritorio[index].telefono,
                        noAbonado: viviendas.unterritorio[index].noAbonado,
                        fechaUlt: viviendas.unterritorio[index].fechaUlt
                    })
                }
                console.log(nuevoTodo);
                
            })
            setviviendas(nuevoTodo)
        }
    }, [data, escuchar.data])

    console.log("manzana", manzana, "isTodo", isTodo)
    return (
        <>
            {ReturnBtn(props)}

            <h1 style={{
                textAlign:'center',
                margin: mobile ? '80px auto 20px auto' : '60px auto 40px auto',
                fontSize: mobile ? '2.3rem' : '2.8rem',
                fontWeight:'bolder'
            }}>
                TERRITORIO {territorio}
            </h1>


            <Button variant="dark"
                onClick={() => setShowMap(!showMap)}
                style={{display:'block', margin:'22px auto'
            }}>
                {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
            </Button>


            <img src={`/img/${territorio}.jpg`} alt="map"
                style={{
                    border:'1px solid black',
                    borderRadius:'8px',
                    width: mobile ? '99%' : '40%',
                    height:'auto',
                    display: showMap ? 'block' : 'none',
                    margin:'30px auto',
                    padding: mobile ? '10px' : '20px'
                }}
            />
    

            <Col0a
                territorio={territorio}
                count={count}
                radioMValue={radioMValue}
                setRadioMValue={setRadioMValue}
                manzana={manzana}
                props2={props}
            />

            <Col0b
                territorio={territorio}
                manzana={manzana}
                isTodo={isTodo}
            />


            {viviendas && viviendas.unterritorio && !!viviendas.unterritorio.length &&
                viviendas.unterritorio.map((vivienda:typeVivienda) => {

                    if (vivienda.estado==="No predicado") vivienda = {...vivienda, variante: "success"}
                    if (vivienda.estado==="Contestó") vivienda = {...vivienda, variante: "primary"}
                    if (vivienda.estado==="No contestó") vivienda = {...vivienda, variante: "warning"}
                    if (vivienda.estado==="A dejar carta") vivienda = {...vivienda, variante: "danger"}
                    if (vivienda.estado==="No llamar") vivienda = {...vivienda, variante: "dark"}

                return (
                
                    <Card key={vivienda.inner_id}
                        style={{
                            marginBottom:'50px',
                            border:'1px solid gray',
                            boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                        }}
                    >
                        <Container fluid="lg">

                            <Row style={{margin:'0 25px', paddingTop:'15px', paddingBottom:'15px'}}>

                                <Col1
                                    vivienda={vivienda}
                                />

                                <Col2
                                    vivienda={vivienda}
                                />


                                <Col3
                                    vivienda={vivienda}
                                    cambiarEstado={cambiarEstado}
                                />

                                <Col4
                                    vivienda={vivienda}
                                    cambiarEstado={cambiarEstado}
                                />

                            </Row>
                        </Container>
                    </Card>
                )
            })}

            {viviendas && viviendas.unterritorio && !viviendas.unterritorio.length && <Loading />}

        </>
    )
}


export default TerritoriosPage
