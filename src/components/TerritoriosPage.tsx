import { useState, useEffect } from 'react'
import { Button, Card, Container, Pagination, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { typeAppDispatch, typeRootState } from '../store/store'
import { setValuesAndOpenAlertModalReducer } from '../store/AlertModalSlice'
import io from 'socket.io-client'
import { SERVER } from '../config'
import { Loading } from './commons/Loading'
import { generalBlue } from './_App'
import { WarningToaster } from './commons/WarningToaster'
import { Col0a } from './territory-components/Col0a'
import { Col0b } from './territory-components/Col0b'
import { Col1 } from './territory-components/Col1'
import { Col2 } from './territory-components/Col2'
import { Col3 } from './territory-components/Col3'
import { Col4 } from './territory-components/Col4'
import { TerritoryWarningToaster } from './territory-components/TerritoryWarningToaster'
import { useAuth } from '../context/authContext'
import { markTerritoryAsFinishedService as closeTerritoryService, getStateOfTerritoryService } from '../services/stateOfTerritoryServices'
import { getHouseholdsByTerritoryService, getBlocksService, modifyHouseholdService } from '../services/territoryServices'
import * as types from '../models/territory'
import { typeUser } from '../models/user'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const TerritoriosPage = () => {

    const navigate = useNavigate()
    const user: typeUser|undefined = useAuth().user
    const { territorio, manzana, todo } = useParams<any>()
    const showingAll: boolean = todo === 'todo'
    const [households, setHouseholds] = useState<types.typeHousehold[]>()
    const [isFinished, setIsFinished] = useState<boolean>(false)
    const [showMap, setShowMap] = useState<boolean>(false)
    const [brought, setBrought] = useState<number>(10)
    const [loaded, setLoaded] = useState<boolean>(false)
    const [blocks, setBlocks] = useState<types.typeBlock[]>()
    const [textBtn, setTextBtn] = useState<string>('Traer 10 más')
    const [socket, setSocket] = useState<any>(null)
    const [showWarningToaster, setShowWarningToaster] = useState<boolean>(false)
    const [showBottomBtns, setShowBottomBtns] = useState<boolean>(true)
    const [userEmailWarningToaster, setUserEmailWarningToaster] = useState<string|null>(null);
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    
    useEffect(() => {
        // window.scrollTo(0, 0)
        if (territorio) getBlocksService(territorio).then((blocks: types.typeBlock[]|null) => { if (blocks) setBlocks(blocks) })
        if (territorio && manzana) getHouseholdsByTerritoryService(territorio, manzana, brought, showingAll)
            .then((response: [types.typeHousehold[], boolean]|null) => {
                if (response && response[0]) {
                    new Promise(resolve => setTimeout(resolve, 1000)).then(() => setLoaded(true))
                    const households: types.typeHousehold[] = response[0]
                    setHouseholds(households)
                    if (response[1]) setShowBottomBtns(false)
                    setTextBtn(`Traer 10 más (${brought + 10})`)
                    getStateOfTerritoryService(territorio).then((stateOfTerritory: types.typeStateOfTerritory|null) => {
                        if (stateOfTerritory !== null) { setIsFinished(stateOfTerritory.isFinished) }
                    })
                }
            })
        ;
        if (!socket && user && user.email) {    // socket
            const newSocket = io(SERVER, { withCredentials: true })
            newSocket.on('household: change', (updatedHouseholds: types.typeHousehold[], userEmail: string) => {
                if (updatedHouseholds && updatedHouseholds[0].territorio === territorio) {
                    if (updatedHouseholds[0].manzana === manzana) {
                        setHouseholds(updatedHouseholds)
                    }
                    if (user && userEmail && userEmail !== user.email) {
                        setShowWarningToaster(true)
                        setUserEmailWarningToaster(userEmail)
                    }
                }
            })
            if (newSocket) setSocket(newSocket)
        }
        if (socket && !socket.connected) { console.log("Sin conectar") } else { console.log("Conectado") }
        return () => setHouseholds(undefined)
    }, [showingAll, manzana, territorio, brought, socket, socket?.connected, user, user?.email])

    const dispatch: typeAppDispatch = useDispatch()

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
        const success = await closeTerritoryService(territorio, true)
        if (!success) return openAlertModalHandler("Algo falló", "")
        navigate("/index")
    }

    const openTerritoryHandler = async (): Promise<void> => {
        if (!territorio) return
        const success: boolean = await closeTerritoryService(territorio, false)
        if (!success) openAlertModalHandler("Algo falló", "")
        window.location.reload()
    }

    const modifyHouseholdHandler = async (inner_id: string, estado: string, noAbonado: boolean, asignado: boolean|undefined): Promise<void> => {
        noAbonado = !noAbonado ? false : true
        asignado = !asignado ? false : true
        const household: types.typeHousehold|null = await modifyHouseholdService(inner_id, estado, noAbonado, asignado)
        if (!household) return openAlertModalHandler("Algo falló al modificar", "")
        sendUpdatedHousehold(household)
    }
    
    const sendUpdatedHousehold = (updatedHousehold: types.typeHousehold): void => {
        let indexOfHousehold: number = 0
        households?.forEach((household: types.typeHousehold, index: number) => {
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

    const toggleshowWarningToaster = (): void => setShowWarningToaster(false)
    
    // const highligthCard = (id: string): void => {
    //     const element: HTMLElement|null = document.getElementById(id)
    //     if (element) {
    //         element.classList.remove('bg-dark')
    //         element.classList.remove('bg-light')
    //         element.classList.remove('bg-secondary')
    //         element.classList.add('bg-info')
    //     }
    // }

    // const stopHighligthCard = (id: string, backgroundColorClasses: string): void => {
    //     const element: HTMLElement|null = document.getElementById(id)
    //     if (element) {
    //         element.classList.remove('bg-info')
    //         const bgColorClasses: string[] = backgroundColorClasses.split(' ')
    //         for (let bgColorClass of bgColorClasses) {
    //             element.classList.add(bgColorClass)
    //         }
    //     }
    // }


    return (
        <>
            <TerritoryWarningToaster />

            <WarningToaster
                showWarningToaster={showWarningToaster}
                toggleshowWarningToaster={toggleshowWarningToaster}
                userEmailWarningToaster={userEmailWarningToaster}
                currentUserEmail={user?.email}
            />

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


            {households && !!households.length && households.map((household: types.typeHousehold) => {

                if (household.estado === types.noPredicado) household = { ...household, variante: types.success }
                if (household.estado === types.contesto) household = { ...household, variante: types.primary }
                if (household.estado === types.noContesto) household = { ...household, variante: types.warning }
                if (household.estado === types.aDejarCarta) household = { ...household, variante: types.danger }
                if (household.estado === types.noLlamar) household = { ...household, variante: types.dark }

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
