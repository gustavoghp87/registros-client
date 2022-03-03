import { useState, useEffect } from 'react'
import { Button, Card, Container, Pagination, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import io from 'socket.io-client'
import { Loading } from './commons/Loading'
import { ReturnBtn } from './commons/Return'
import { Col0a } from './columns/Col0a'
import { Col0b } from './columns/Col0b'
import { Col1 } from './columns/Col1'
import { Col2 } from './columns/Col2'
import { Col3 } from './columns/Col3'
import { Col4 } from './columns/Col4'
import { BsToaster } from './columns/BsToaster'
import { RefreshButton } from './commons/RefreshButton'
import { WarningToaster } from './commons/WarningToaster'
import { useAuth } from '../context/authContext'
import { confirmAlert } from 'react-confirm-alert'
import { markTerritoryAsFinishedService, getStateOfTerritoryService } from '../services/stateTerritoryServices'
import { getHouseholdsByTerritoryService, getBlocksService, modifyHouseholdService } from '../services/territoryServices'
import { isMobile } from '../services/functions'
import { SERVER } from '../config'
import * as types from '../models/typesTerritorios'
import { typeUser } from '../models/typesUsuarios'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const TerritoriosPage = () => {

    const navigate = useNavigate()
    const user: typeUser|undefined = useAuth().user
    const { territorio, manzana, todo } = useParams<any>()
    const [householdsObj, setHouseholdsObj] = useState<types.typeTerritorio>({ households: [] })
    const [isFinished, setIsFinished] = useState<boolean>(false)
    const [showMap, setShowMap] = useState<boolean>(false)
    const [brought, setBrought] = useState<number>(10)
    const [broughtAll, setBroughtAll] = useState<boolean>(false)
    const [loaded, setLoaded] = useState<boolean>(false)
    const [blocks, setBlocks] = useState<string[]>(['1'])
    const [textBtn, setTextBtn] = useState<string>('Traer 10 más')
    const [socket, setSocket] = useState<any>(null)
    const [showWarningToaster, setShowWarningToaster] = useState<boolean>(false);
    //const [showWarningToasterPermanently, setShowWarningToasterPermanently] = useState<boolean>(false);
    const [userEmailWarningToaster, setUserEmailWarningToaster] = useState<string|null>(null);
    const showingAll = todo === 'todo'
    
    
    useEffect(() => {
        // window.scrollTo(0, 0)
        if (territorio) getBlocksService(territorio)
            .then((blocks: string[]|null) => { if (blocks) setBlocks(blocks) })
        if (territorio && manzana) getHouseholdsByTerritoryService(territorio, manzana, showingAll, brought, broughtAll)
            .then((households: types.typeVivienda[]|null) => {
                if (households) {
                    setHouseholdsObj({ households })
                    new Promise(resolve => setTimeout(resolve, 1000)).then(() => setLoaded(true))
                    setTextBtn(`Traer 10 más (${brought + 10})`)
                    getStateOfTerritoryService(territorio).then((stateOfTerritory: types.typeStateOfTerritory|null) => {
                        if (stateOfTerritory !== null) { setIsFinished(stateOfTerritory.isFinished) }
                    })
                }
            })
        ;
        // socket:
        if (!socket && user && user.email) {
            const newSocket = io(SERVER, { withCredentials: true })
            newSocket.on('household: change', (updatedHouseholds: types.typeVivienda[], userEmail: string) => {
                if (updatedHouseholds && updatedHouseholds[0].territorio === territorio) {
                    if (updatedHouseholds[0].manzana === manzana) {
                        setHouseholdsObj({ households: updatedHouseholds })
                    }
                    if (user && userEmail && userEmail !== user.email) {
                        setShowWarningToaster(true)
                        //setShowWarningToasterPermanently(true)
                        setUserEmailWarningToaster(userEmail)
                    }
                }
            })
            if (newSocket) setSocket(newSocket)
        }
        if (socket && !socket.connected) { console.log("Sin conectar") } else { console.log("Conectado") }
        return () => { }
    }, [showingAll, manzana, territorio, brought, broughtAll, socket, socket?.connected, user, user?.email])
    
    const modifyHouseholdHandler = async (inner_id: string,
         estado: string, noAbonado: boolean|null, asignado: boolean|null): Promise<void> => {
        noAbonado = !noAbonado ? false : true
        asignado = !asignado ? false : true
        const household: types.typeVivienda|null = await modifyHouseholdService(inner_id, estado, noAbonado, asignado)
        if (household) sendUpdatedHousehold(household)
        else alert("Algo falló al modificar")
    }

    const getTenMoreHandler = (): void => {
        setTextBtn('...buscando...')
        setBrought(brought + 10)
    }

    const markAsFinishedHandler = async (): Promise<void> => {
        if (!territorio) return
        const success = await markTerritoryAsFinishedService(territorio, true)
        if (success) navigate("/index")
    }

    const markAsUnfinishedHandler = async (): Promise<void> => {
        if (!territorio) return
        const success: boolean = await markTerritoryAsFinishedService(territorio, false)
        if (success) window.location.reload()
    }

    const submit1Handler = (): void => {
        confirmAlert({
            title: '¿Confirmar finalizar territorio?',
            message: `El territorio ${territorio} se dará por terminado y se te desasignará`,
            buttons: [
                {
                    label: `Terminar Territorio ${territorio}`,
                    onClick: () => markAsFinishedHandler()
                },
                {
                    label: 'Cancelar',
                    onClick: () => {}
                }
            ]
        })
    }

    const submit2Handler = (): void => {
        confirmAlert({
            title: '¿Confirmar abrir territorio?',
            message: `El territorio ${territorio} se abrirá de nuevo`,
            buttons: [
                {
                    label: `Abrir Territorio ${territorio}`,
                    onClick: () => markAsUnfinishedHandler()
                },
                {
                    label: 'Cancelar',
                    onClick: () => {}
                }
            ]
        })
    }

    const sendUpdatedHousehold = (updatedHousehold: types.typeVivienda): void => {
        let indexOfHousehold = 0
        householdsObj.households.forEach((household: types.typeVivienda, index: number) => {
            if (household.inner_id === updatedHousehold.inner_id) indexOfHousehold = index
        })
        const objPackage: any = {
            households: householdsObj.households,
            updatedHousehold,
            indexOfHousehold,
            userEmail: user?.email
        }
        if (socket && socket.connected && objPackage) socket.emit('household: change', objPackage)
        else alert("No estás conectado")
    }

    const highligthCard = (id: string): void => {
        const element = document.getElementById(id)
        if (element) element.style.backgroundColor = "yellow"
    }

    const stopHighligthCard = (id: string, backgroundColor: string): void => {
        const element = document.getElementById(id)
        if (element) element.style.backgroundColor = backgroundColor
    }

    const toggleshowWarningToaster = (): void => setShowWarningToaster(false)


    return (
        <>
            <ReturnBtn />

            <RefreshButton />

            <BsToaster />

            <WarningToaster
                showWarningToaster={showWarningToaster}
                //showWarningToasterPermanently={showWarningToasterPermanently}
                toggleshowWarningToaster={toggleshowWarningToaster}
                userEmailWarningToaster={userEmailWarningToaster}
                currentUserEmail={user?.email}
            />

            <h1 style={{
                textAlign: 'center',
                margin: isMobile ? '80px auto 20px auto' : '60px auto 40px auto',
                fontSize: isMobile ? '2.3rem' : '2.8rem',
                fontWeight: 'bolder'
            }}>
                TERRITORIO {territorio} {isFinished ? `- TERMINADO` : ``} 
            </h1>


            <Button variant="dark"
                onClick={() => setShowMap(!showMap)}
                style={{ display: 'block', margin: '22px auto' }}
            >
                {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
            </Button>


            <img src={`/img/${territorio}.jpg`} alt={"mapa"}
                style={{
                    border: '1px solid black',
                    borderRadius: '8px',
                    width: isMobile ? '99%' : '40%',
                    height: 'auto',
                    display: showMap ? 'block' : 'none',
                    margin: '30px auto',
                    padding: isMobile ? '10px' : '20px'
                }}
            />
    

            <Col0a
                territorio={territorio}
                manzanas={blocks}
                manzana={manzana}
            />

            <Col0b
                user={user}
                territorio={territorio}
                manzana={manzana}
                isTodo={showingAll}
            />

            <Button size={isMobile ? 'sm' : 'lg'}
                onClick={() => submit1Handler()}
                style={{
                    backgroundColor: '#4a6da7',
                    border: '1px solid #4a6da7',
                    borderRadius: '5px',
                    display: isFinished ? 'none' : 'block',
                    margin: 'auto',
                    marginBottom: '50px',
                    fontSize: 15
                }}
            >
                Marcar este territorio como terminado
            </Button>

            <Button size={isMobile ? 'sm' : 'lg'}
                onClick={() => submit2Handler()}
                style={{
                    backgroundColor: 'red',
                    border: '1px solid red',
                    borderRadius: '5px',
                    display: isFinished ? 'block' : 'none',
                    margin: 'auto',
                    marginBottom: '50px',
                    fontSize: 15
                }}
            >
                Desmarcar este territorio como terminado
            </Button>


            {householdsObj && householdsObj.households && !!householdsObj.households.length &&
                householdsObj.households.map((vivienda: types.typeVivienda) => {

                if (vivienda.estado === types.noPredicado) vivienda = { ...vivienda, variante: types.success }
                if (vivienda.estado === types.contesto) vivienda = { ...vivienda, variante: types.primary }
                if (vivienda.estado === types.noContesto) vivienda = { ...vivienda, variante: types.warning }
                if (vivienda.estado === types.aDejarCarta) vivienda = { ...vivienda, variante: types.danger }
                if (vivienda.estado === types.noLlamar) vivienda = { ...vivienda, variante: types.dark }

                return (
                
                    <Card key={vivienda.inner_id}
                        id={`card_${vivienda.inner_id}`}
                        style={{
                            marginBottom: '50px',
                            border: '1px solid gray',
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                            backgroundColor: vivienda.asignado ? '#B0B0B0' : ''
                        }}
                        onMouseOver={() => vivienda.asignado ? null : highligthCard(`card_${vivienda.inner_id}`)}
                        onMouseOut={() => stopHighligthCard(`card_${vivienda.inner_id}`, vivienda.asignado ? '#B0B0B0' : '')}
                    >
                        <Container fluid={'lg'}>

                            <Row style={{ margin: '0 25px', paddingTop: '15px', paddingBottom: '15px' }}>

                                <Col1
                                    vivienda={vivienda}
                                />

                                <Col2
                                    vivienda={vivienda}
                                />

                                <Col3
                                    vivienda={vivienda}
                                    cambiarEstado={modifyHouseholdHandler}
                                />

                                <Col4
                                    vivienda={vivienda}
                                    cambiarEstado={modifyHouseholdHandler}
                                />

                            </Row>
                        </Container>
                    </Card>
                )
            })}

            {householdsObj && householdsObj.households && !!householdsObj.households.length && loaded &&
            <>
                <Pagination size='lg'
                    style={{
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '80px',
                        fontWeight: 'bolder',
                        display: broughtAll ? 'none' : ''
                    }
                }>
                    <Pagination.Item onClick={() => getTenMoreHandler()}>
                        {textBtn}
                    </Pagination.Item>

                    <Pagination.Item onClick={() => setBroughtAll(true)}>
                        Traer todos
                    </Pagination.Item>
                </Pagination>
            </>
            }

            {householdsObj && householdsObj.households && !householdsObj.households.length && !loaded &&
                <>
                    <br/>
                    <Loading />
                </>
            }

            {householdsObj && householdsObj.households && !householdsObj.households.length && !showingAll && loaded &&
                <h3 style={{ textAlign: 'center' }}>
                    <br/>
                    No hay viviendas no llamadas en esta manzana {manzana} del territorio {territorio}
                </h3>
            }

        </>
    )
}
