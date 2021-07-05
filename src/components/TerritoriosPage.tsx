import { useState, useEffect } from 'react'
import { Button, Card, Container, Row } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router'
import { typeParam, typeTerritorio, typeVivienda } from '../models/typesTerritorios'
import { Loading } from './_Loading'
import { ReturnBtn } from './_Return'
import { mobile } from './_App'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import * as graphql from '../services/graphql'
import { Col0a } from './columns/Col0a'
import { Col0b } from './columns/Col0b'
import { Col1 } from './columns/Col1'
import { Col2 } from './columns/Col2'
import { Col3 } from './columns/Col3'
import { Col4 } from './columns/Col4'
import { getToken } from '../services/getToken'
import { checkTerritorioAsFinished, getStateOfTerritory } from '../services/stateOfterritories'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'


function TerritoriosPage(props:any) {

    const { territorio, manzana, todo } = useParams<typeParam>()
    const [viviendas, setViviendas] = useState<typeTerritorio>({ unterritorio: [] })
    const [terminado, setTerminado] = useState<boolean>(false)
    const [showMap, setShowMap] = useState(false)
    const [traidos, setTraidos] = useState(10)
    const [traerTodos, setTraerTodos] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [manzanas, setManzanas] = useState(['1'])
    const isTodo = todo==='todo' ? true : false

    let variables = {terr:territorio, manzana, token: getToken(), todo:isTodo, traidos, traerTodos}
    if (manzana==='1') variables = {
        terr:territorio, manzana:'1', token: getToken(), todo:isTodo, traidos, traerTodos
    }
    if (manzana==='2') variables = {
        terr:territorio, manzana:'2', token: getToken(), todo:isTodo, traidos, traerTodos
    }
    if (manzana==='3') variables = {
        terr:territorio, manzana:'3', token: getToken(), todo:isTodo, traidos, traerTodos
    }
    if (manzana==='4') variables = {
        terr:territorio, manzana:'4', token: getToken(), todo:isTodo, traidos, traerTodos
    }
    if (manzana==='5') variables = {
        terr:territorio, manzana:'5', token: getToken(), todo:isTodo, traidos, traerTodos
    }
    if (manzana==='6') variables = {
        terr:territorio, manzana:'6', token: getToken(), todo:isTodo, traidos, traerTodos
    }

    const data = useQuery(graphql.GETTERRITORY, {variables}).data
    const manzTraidas = useQuery(graphql.COUNTBLOCKS, {variables: {terr:territorio}}).data
    const escuchar = useSubscription(graphql.ESCUCHARCAMBIODEESTADO)
    const history = useHistory()
    const [changeState] = useMutation(graphql.CHANGESTATE)
    const [textBtn, setTextBtn] = useState('Traer 10 más')

    // console.log("aaaa", territorio, manzana, manzTraidas);
    
    
    const cambiarEstado = (inner_id:String, estado:String, noAbonado:Boolean|null, asignado:Boolean|null) => {
        if (!noAbonado) noAbonado = false
        if (!asignado) asignado = false
        changeState({ variables: {inner_id, estado, noAbonado, asignado, token: getToken()} })
    }

    const traerDiezMas = () => {
        setTextBtn('...buscando...')
        setTraidos(traidos+10)
    }

    const checkAsFinished = async () => {
        const success = await checkTerritorioAsFinished(territorio, true)
        if (success) history.push("/index")
    }

    const checkAsUnfinished = async () => {
        const success = await checkTerritorioAsFinished(territorio, false)
        if (success) window.location.reload()
    }

    const submit1 = () => {
        confirmAlert({
            title: '¿Confirmar finalizar territorio?',
            message: `El territorio ${territorio} se dará por terminado y se te desasignará`,
            buttons: [
                {
                    label: `Terminar Territorio ${territorio}`,
                    onClick: () => checkAsFinished()
                },
                {
                    label: 'Cancelar',
                    onClick: () => {}
                }
            ]
        })
    }

    const submit2 = () => {
        confirmAlert({
            title: '¿Confirmar abrir territorio?',
            message: `El territorio ${territorio} se abrirá de nuevo`,
            buttons: [
                {
                    label: `Abrir Territorio ${territorio}`,
                    onClick: () => checkAsUnfinished()
                },
                {
                    label: 'Cancelar',
                    onClick: () => {}
                }
            ]
        })
    }

    //console.log("data:", data)
    //console.log("traídos:", traidos)
    //console.log("variables:", variables)


    useEffect(() => {
        if (data) {
            setViviendas({ unterritorio: data.getApartmentsByTerritory })
            new Promise(resolve => setTimeout(resolve, 1000)).then(() => setLoaded(true))
            setTextBtn(`Traer 10 más (${traidos})`)
            getStateOfTerritory(territorio).then(stateOfTerritory => {
                setTerminado(stateOfTerritory)
            })
        }
        if (escuchar.data) {
            let nuevoTodo:any = {unterritorio: []}
            viviendas.unterritorio.forEach((vivienda:typeVivienda, index:number) => {
                if (vivienda.inner_id === escuchar.data.escucharCambioDeEstado.inner_id)
                    nuevoTodo.unterritorio.push({
                        estado: escuchar.data.escucharCambioDeEstado.estado,
                        inner_id: escuchar.data.escucharCambioDeEstado.inner_id,
                        territorio: escuchar.data.escucharCambioDeEstado.territorio,
                        manzana: escuchar.data.escucharCambioDeEstado.manzana,
                        direccion: escuchar.data.escucharCambioDeEstado.direccion,
                        telefono: escuchar.data.escucharCambioDeEstado.telefono,
                        noAbonado: escuchar.data.escucharCambioDeEstado.noAbonado,
                        fechaUlt: escuchar.data.escucharCambioDeEstado.fechaUlt,
                        asignado: escuchar.data.escucharCambioDeEstado.asignado
                    })
                else 
                    nuevoTodo.unterritorio.push({
                        estado: viviendas.unterritorio[index].estado,
                        inner_id: viviendas.unterritorio[index].inner_id,
                        territorio: viviendas.unterritorio[index].territorio,
                        manzana: viviendas.unterritorio[index].manzana,
                        direccion: viviendas.unterritorio[index].direccion,
                        telefono: viviendas.unterritorio[index].telefono,
                        noAbonado: viviendas.unterritorio[index].noAbonado,
                        fechaUlt: viviendas.unterritorio[index].fechaUlt,
                        asignado: viviendas.unterritorio[index].asignado
                    })
            })
            setViviendas(nuevoTodo)
        }
        if (isTodo) setTraerTodos(true)
        try { setManzanas(manzTraidas.countBlocks.cantidad) } catch {}
    }, [data, escuchar.data, traidos, manzTraidas, isTodo])
    

    return (
        <>
            {ReturnBtn(props)}

            <div style={{
                display: 'block',
                margin: 'auto',
                zIndex: 3}}
            >
                <Button variant="danger" onClick={() => window.location.reload()}
                    style={{display: 'block', margin: 'auto'}}
                > Refrescar </Button>
            </div>

            <h1 style={{
                textAlign:'center',
                margin: mobile ? '80px auto 20px auto' : '60px auto 40px auto',
                fontSize: mobile ? '2.3rem' : '2.8rem',
                fontWeight:'bolder'
            }}>
                TERRITORIO {territorio} {terminado ? `- TERMINADO` : ``} 
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
                manzanas={manzanas}
                manzana={manzana}
            />

            <Col0b
                territorio={territorio}
                manzana={manzana}
                isTodo={isTodo}
            />

            <Button size={mobile ? 'sm' : 'lg'}
                onClick={() => submit1()}
                style={{
                    backgroundColor: '#4a6da7',
                    border: '1px solid #4a6da7',
                    borderRadius: '5px',
                    display: terminado ? 'none' : 'block',
                    margin: 'auto',
                    marginBottom: '50px',
                    fontSize: 15
                }}
            >
                Marcar este territorio como terminado
            </Button>

            <Button size={mobile ? 'sm' : 'lg'}
                onClick={() => submit2()}
                style={{
                    backgroundColor: 'red',
                    border: '1px solid red',
                    borderRadius: '5px',
                    display: terminado ? 'block' : 'none',
                    margin: 'auto',
                    marginBottom: '50px',
                    fontSize: 15
                }}
            >
                Desmarcar este territorio como terminado
            </Button>


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
                            marginBottom: '50px',
                            border: '1px solid gray',
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                            backgroundColor: vivienda.asignado ? '#B0B0B0' : ''
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

            {viviendas && viviendas.unterritorio && !!viviendas.unterritorio.length && !isTodo && loaded &&
                // <Pagination size='lg' style={{
                //     alignItems:'center', justifyContent:'center', marginTop:'80px',
                //     display: traerTodos ? 'none' : ''
                // }}>
                //     <Pagination.Item>
                //         Traer 10 más
                //     </Pagination.Item>

                //     <Pagination.Item onClick={()=>setTraerTodos(true)}>
                //         Traer todos
                //     </Pagination.Item>
                // </Pagination>
                
                <div style={{
                    alignItems:'center', justifyContent:'center', marginTop:'80px',
                    display: traerTodos ? 'none' : 'none', textAlign: 'center'
                }}>
                    <Button variant={'primary'} onClick={()=>traerDiezMas()}
                        style={{
                            fontSize: mobile ? '1.1rem' : '1.4rem',
                            display: 'inline', padding: '10px 15px', margin: '10px'
                        }}
                    >
                        {textBtn}
                    </Button>

                    <Button variant={'primary'} onClick={()=>setTraerTodos(true)}
                        style={{
                            fontSize: mobile ? '1.1rem' : '1.4rem',
                            display: 'inline', padding: '10px 15px', margin: '10px'
                        }}
                    >
                        Traer todos
                    </Button>
                </div>
            }

            {viviendas && viviendas.unterritorio && !viviendas.unterritorio.length && !loaded &&
                <>
                    <br/>
                    <Loading />
                </>
            }

            {viviendas && viviendas.unterritorio && !viviendas.unterritorio.length && !isTodo && loaded &&
                <h3 style={{textAlign:'center'}}>
                    <br/>
                    No hay viviendas no llamadas en esta manzana {manzana} del territorio {territorio}
                </h3>
            }

        </>
    )
}


export default TerritoriosPage
