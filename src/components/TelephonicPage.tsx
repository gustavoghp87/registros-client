import io, { Socket } from 'socket.io-client'
import { useState, useEffect } from 'react'
import { Button, Card, Container, Pagination, Row } from 'react-bootstrap'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { setValuesAndOpenAlertModalReducer } from '../store/AlertModalSlice'
import { SERVER } from '../config'
import { Loading } from './commons/Loading'
import { generalBlue } from '../config'
import { WarningToaster } from './commons/WarningToaster'
import { Col0a } from './telephonic-components/Col0a'
import { Col0b } from './telephonic-components/Col0b'
import { Col1 } from './telephonic-components/Col1'
import { Col2 } from './telephonic-components/Col2'
import { Col3 } from './telephonic-components/Col3'
import { Col4 } from './telephonic-components/Col4'
import { TerritoryWarningToaster } from './telephonic-components/TerritoryWarningToaster'
import { MapModal } from './telephonic-components/MapModal'
import { useAuth } from '../context/authContext'
import { getHouseholdsByTerritoryService, getBlocksService, modifyHouseholdService, getStateOfTerritoryService, markTerritoryAsFinishedService } from '../services'
import { aDejarCarta, contesto, noContesto, noLlamar, noPredicado, typeAppDispatch, typeBlock, typeHousehold, typeRootState, typeStateOfTerritory, typeUser } from '../models'
import { danger, dark, primary, success, warning } from '../models'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const TelephonicPage = () => {

    const user: typeUser|undefined = useAuth().user
    const { territorio, manzana, todo } = useParams<any>()
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const navigate: NavigateFunction = useNavigate()
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [blocks, setBlocks] = useState<typeBlock[]>()
    const [brought, setBrought] = useState<number>(10)
    const [households, setHouseholds] = useState<typeHousehold[]>()
    const [loaded, setLoaded] = useState<boolean>(false)
    const [isFinished, setIsFinished] = useState<boolean>(false)
    const [textBtn, setTextBtn] = useState<string>('Traer 10 más')
    const [showBottomBtns, setShowBottomBtns] = useState<boolean>(true)
    const [showMap, setShowMap] = useState<boolean>(false)
    const [showGoogleMapAddress, setShowGoogleMapAddress] = useState<string>("")
    const [showWarningToaster, setShowWarningToaster] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket>()
    const [userEmailWarningToaster, setUserEmailWarningToaster] = useState<string|null>(null);
    const showingAll: boolean = todo === 'todo'

    const openAlertModalHandler = (title: string, message: string): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message
        }))
    }

    const openConfirmModalHandler = (modal: number) => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: modal === 1 ? "¿Confirmar abrir territorio?" : "¿Confirmar finalizar territorio?",
            message: modal === 1 ? `El territorio ${territorio} se abrirá de nuevo` : `El territorio ${territorio} se dará por terminado y se te desasignará`,
            execution: modal === 1 ? openTerritoryHandler : closeTerritoryHandler
        }))
    }
    
    const closeTerritoryHandler = async (): Promise<void> => {
        if (!territorio) return
        const success = await markTerritoryAsFinishedService(territorio, true)
        if (!success) return openAlertModalHandler("Algo falló", "")
        navigate('/index')
    }

    const openTerritoryHandler = async (): Promise<void> => {
        if (!territorio) return
        const success: boolean = await markTerritoryAsFinishedService(territorio, false)
        if (!success) openAlertModalHandler("Algo falló", "")
        window.location.reload()
    }

    const modifyHouseholdHandler = async (inner_id: string, estado: string, noAbonado: boolean, asignado: boolean|undefined): Promise<void> => {
        noAbonado = !noAbonado ? false : true
        asignado = !asignado ? false : true
        const household: typeHousehold|null = await modifyHouseholdService(inner_id, estado, noAbonado, asignado)
        if (!household) return openAlertModalHandler("Algo falló al modificar", "")
        sendUpdatedHousehold(household)
    }
    
    const sendUpdatedHousehold = (updatedHousehold: typeHousehold): void => {
        let indexOfHousehold: number = 0
        households?.forEach((household: typeHousehold, index: number) => {
            if (household.inner_id === updatedHousehold.inner_id) indexOfHousehold = index
        })
        const objPackage: any = {
            households,
            updatedHousehold,
            indexOfHousehold,
            userEmail: user?.email
        }
        if (socket && socket.connected && objPackage) socket.emit('household: change', objPackage)
        else openAlertModalHandler("Problema de conexión", "Refrescar y ver si hay internet")
    }
    
    const getTenMoreHandler = (): void => {
        setTextBtn('...buscando...')
        setBrought(brought + 10)
    }

    const setBroughtAllHandler = (): void => {
        setShowBottomBtns(false)
        setBrought(10000)
    }

    const toggleShowWarningToaster = (): void => setShowWarningToaster(false)

    const showGoogleMapHandler = (address: string): void => {
        setShowGoogleMapAddress(address)
    }

    const hideGoogleMapHandler = (): void => {
        setShowGoogleMapAddress("")
    }

    useEffect(() => {
        if (user && !user.isAuth) window.location.href = '/acceso'
    }, [user])

    useEffect(() => {
        if (territorio) getBlocksService(territorio).then((blocks: typeBlock[]|null) => {
            if (blocks && blocks.length) setBlocks(blocks)
        })
        return () => setBlocks(undefined)
    }, [territorio])

    useEffect(() => {
        if (territorio && manzana) getHouseholdsByTerritoryService(territorio, manzana, brought, showingAll)
            .then((response: [typeHousehold[], boolean]|null) => {
                if (!response || !response[0]) return
                new Promise(resolve => setTimeout(resolve, 1000)).then(() => setLoaded(true))
                const households: typeHousehold[] = response[0]
                setHouseholds(households)
                if (response[1]) setShowBottomBtns(false)
                setTextBtn(`Traer 10 más (${brought + 10})`)
                getStateOfTerritoryService(territorio).then((stateOfTerritory: typeStateOfTerritory|null) => {
                    if (stateOfTerritory !== null) { setIsFinished(stateOfTerritory.isFinished) }
                })
            })
        return () => setHouseholds(undefined)
    }, [showingAll, manzana, territorio, brought])

    useEffect(() => {
        if (!user || !user.email) return
        const newSocket: Socket = io(SERVER, { withCredentials: true })
        newSocket.on('household: change', (updatedHouseholds: typeHousehold[], userEmail: string) => {
            if (!updatedHouseholds || updatedHouseholds.length || updatedHouseholds[0].territorio !== territorio) return
            if (updatedHouseholds[0].manzana === manzana) {
                setHouseholds(updatedHouseholds)
            }
            if (userEmail !== user.email) {
                setShowWarningToaster(true)
                setUserEmailWarningToaster(userEmail)
            }
        })
        if (newSocket) setSocket(newSocket)
        return () => setSocket(undefined)
    }, [manzana, territorio, user])
    
    useEffect(() => {
        if (!socket) return
        setTimeout(() => {
            if (!socket.connected) { console.log("Sin conectar") }
            else { console.log("Conectado") }
        }, 1500)
    }, [socket, socket?.connected])

    return (
        <>
            <TerritoryWarningToaster />

            {showGoogleMapAddress &&
                <MapModal
                    address={showGoogleMapAddress}
                    hideGoogleMapHandler={hideGoogleMapHandler}
                />
            }

            {user &&
                <WarningToaster
                    currentUserEmail={user.email}
                    showWarningToaster={showWarningToaster}
                    toggleShowWarningToaster={toggleShowWarningToaster}
                    userEmailWarningToaster={userEmailWarningToaster}
                />
            }

            <h1 className={isDarkMode ? 'text-white' : ''}
                style={{
                    textAlign: 'center',
                    margin: isMobile ? '80px auto 40px auto' : '60px auto 40px auto',
                    fontSize: isMobile ? '2.6rem' : '2.8rem',
                    fontWeight: 'bolder'
                }}
            >
                TERRITORIO {territorio} {isFinished ? "- TERMINADO" : ""} 
            </h1>


            <Button variant={dark}
                onClick={() => setShowMap(!showMap)}
                style={{ display: 'block', margin: '22px auto' }}
            >
                {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
            </Button>

            {showMap &&
                <img src={`/img/${territorio}.jpg`} alt={`Mapa del territorio ${territorio}`}
                    className={'d-block mx-auto'}
                    style={{
                        border: '1px solid black',
                        borderRadius: '8px',
                        height: 'auto',
                        marginBlock: '30px',
                        padding: isMobile ? '10px' : '20px',
                        width: isMobile ? '99%' : '40%'
                    }}
                />
            }
    

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
                onClick={() => openConfirmModalHandler(2)}
                style={{
                    backgroundColor: generalBlue,
                    border: '1px solid ' + generalBlue,
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
                onClick={() => openConfirmModalHandler(1)}
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


            {households && !!households.length && households.map((household: typeHousehold) => {

                if (household.estado === noPredicado) household = { ...household, variante: success }
                if (household.estado === contesto) household = { ...household, variante: primary }
                if (household.estado === noContesto) household = { ...household, variante: warning }
                if (household.estado === aDejarCarta) household = { ...household, variante: danger }
                if (household.estado === noLlamar) household = { ...household, variante: dark }

                const secColorClass: string = isDarkMode && household?.asignado ? 'assigned-household' : (
                    isDarkMode ? 'bg-dark text-white' : (
                        household?.asignado ? 'assigned-household' : 'bg-white'
                    )
                )

                return (
                
                    <Card key={household?.inner_id}
                        id={`card_${household?.inner_id}`}
                        className={secColorClass}
                        style={{
                            marginBottom: '50px',
                            border: '1px solid gray',
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                        }}
                        // onMouseOver={() => household?.asignado ? null : highligthCard(`card_${household?.inner_id}`)}
                        // onMouseOut={() => stopHighligthCard(`card_${household?.inner_id}`, secColorClass)}
                    >   
                        <Container fluid={'lg'}>

                            <Row style={{ margin: '0 25px', paddingTop: '15px', paddingBottom: '12px' }}>

                                <Col1
                                    household={household}
                                    showGoogleMapHandler={showGoogleMapHandler}
                                />

                                <Col2
                                    household={household}
                                    id={`card_${household?.inner_id}`}
                                />

                                <Col3
                                    household={household}
                                    modifyHouseholdHandler={modifyHouseholdHandler}
                                />

                                <Col4
                                    household={household}
                                    modifyHouseholdHandler={modifyHouseholdHandler}
                                />

                            </Row>
                        </Container>
                    </Card>
                )
            })}

            {households && !!households.length && loaded &&
            <>
                <Pagination size={'lg'}
                    className={`text-center align-items-center justify-content-center ${showBottomBtns ? '' : 'd-none'}`}
                    style={{
                        marginTop: '80px',
                        fontWeight: 'bolder',
                    }
                }>
                    <Pagination.Item onClick={() => getTenMoreHandler()}>
                        {textBtn}
                    </Pagination.Item>

                    <Pagination.Item onClick={() => setBroughtAllHandler()}>
                        Traer todos
                    </Pagination.Item>
                </Pagination>
            </>
            }

            {(!households || !households.length) && !loaded &&
                <>
                    <br/>
                    <Loading />
                </>
            }

            {households && !households.length && !showingAll && loaded &&
                <h3 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                    <br/>
                    No hay viviendas no llamadas en esta manzana {manzana} del territorio {territorio}
                </h3>
            }
        </>
    )
}
