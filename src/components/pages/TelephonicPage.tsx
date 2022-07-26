import io, { Socket } from 'socket.io-client'
import { useState, useEffect } from 'react'
import { Button, Card, Container, Pagination, Row } from 'react-bootstrap'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Col0a, Col0b, Col1, Col2, Col3, Col4, LocalStatistics, MapModal, TerritoryWarningToaster, WarningToaster } from '../telephonic-components'
import { Loading } from '../commons'
import { SERVER } from '../../config'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { getHouseholdsByTerritoryService, modifyHouseholdService, markTerritoryAsFinishedService, getHouseholdVariant } from '../../services'
import { householdChangeString, typeAppDispatch, typeBlock, typeHousehold, typeRootState, typeStateOfTerritory, typeTerritoryNumber } from '../../models'
import { dark, noPredicado } from '../../models'

export const TelephonicPage = () => {

    const territory: typeTerritoryNumber|undefined = useParams<any>().territory as typeTerritoryNumber
    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const navigate: NavigateFunction = useNavigate()
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [blocks, setBlocks] = useState<typeBlock[]>()
    const [brought, setBrought] = useState<number>(10)
    const [currentBlock, setCurrentBlock] = useState<typeBlock>()
    const [households, setHouseholds] = useState<typeHousehold[]>()
    const [householdsToShow, setHouseholdsToShow] = useState<typeHousehold[]>()
    const [loaded, setLoaded] = useState<boolean>(false)
    const [isShowingAllStates, setIsShowingAllStates] = useState<boolean>(false)
    const [isShowingAllAvailable, setIsShowingAllAvailable] = useState<boolean>(false)
    const [isShowingStatistics, setIsShowingStatistics] = useState<boolean>(false)
    const [showBottomBtns, setShowBottomBtns] = useState<boolean>(true)
    const [showGoogleMapAddress, setShowGoogleMapAddress] = useState<string>("")
    const [showMap, setShowMap] = useState<boolean>(false)
    const [showWarningToaster, setShowWarningToaster] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket>()
    const [stateOfTerritory, setStateOfTerritory] = useState<typeStateOfTerritory>()
    const [userEmailWarningToaster, setUserEmailWarningToaster] = useState<string|null>(null)

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
            message: modal === 1 ? `El territorio ${territory} se abrirá de nuevo` : `El territorio ${territory} se dará por terminado y se te desasignará`,
            execution: modal === 1 ? openTerritoryHandler : closeTerritoryHandler
        }))
    }
    
    const closeTerritoryHandler = async (): Promise<void> => {
        if (!territory) return
        const success = await markTerritoryAsFinishedService(territory, true)
        if (!success) return openAlertModalHandler("Algo falló", "")
        navigate('/index')
    }

    const openTerritoryHandler = async (): Promise<void> => {
        if (!territory) return
        const success: boolean = await markTerritoryAsFinishedService(territory, false)
        if (!success) openAlertModalHandler("Algo falló", "")
        window.location.reload()
    }

    const modifyHouseholdHandler = async (inner_id: string, estado: string, noAbonado: boolean, asignado: boolean|undefined): Promise<void> => {
        noAbonado = !noAbonado ? false : true
        asignado = !asignado ? false : true
        const updatedHousehold: typeHousehold|null = await modifyHouseholdService(inner_id, estado, noAbonado, asignado)
        if (!updatedHousehold) return openAlertModalHandler("Algo falló al modificar", "")
        sendUpdatedHousehold(updatedHousehold)
    }
    
    const sendUpdatedHousehold = (updatedHousehold: typeHousehold): void => {
        if (!socket || !socket.connected || !updatedHousehold || !user)
            return openAlertModalHandler("Problema de conexión", "Refrescar y ver si hay internet")
        socket.emit(householdChangeString, {
            updatedHousehold,
            userEmail: user.email
        })
    }
    
    const getTenMoreHandler = (): void => setBrought(x => x + 10)

    const setBroughtAllHandler = (): void => {
        setIsShowingAllAvailable(true)
        setShowBottomBtns(false)
    }

    const setCurrentBlockHandler = (value: typeBlock): void => {
        setCurrentBlock(value)
        setBrought(10)
        setIsShowingAllAvailable(false)
        setIsShowingAllStatesHandler(false)
        setShowBottomBtns(true)
    }
    
    const setIsShowingAllStatesHandler = (value: boolean): void => {
        setIsShowingAllStates(value)
        setIsShowingStatisticsHandler(false)
    }

    const setIsShowingStatisticsHandler = (value: boolean) => {
        setIsShowingStatistics(value)
        if (value) {
            setIsShowingAllStates(false)
            setIsShowingAllAvailable(false)
            setCurrentBlock(undefined)
        }
    }

    const toggleShowWarningToaster = (): void => setShowWarningToaster(false)

    const showGoogleMapHandler = (address: string): void => setShowGoogleMapAddress(address)

    const hideGoogleMapHandler = (): void => showGoogleMapHandler("")

    useEffect(() => {
        if (!territory || (user && !user.isAuth)) window.location.href = '/acceso'
    }, [territory, user])

    useEffect(() => {
        if (territory) getHouseholdsByTerritoryService(territory).then((response: [typeHousehold[], typeBlock[], typeStateOfTerritory]|null) => {
            if (!response || !response[0] || !response[0].length || !response[1] || !response[0].length) return setLoaded(true)
            setBlocks(response[1])
            setCurrentBlock(response[1][0])
            setHouseholds(response[0])
            setStateOfTerritory(response[2])
            setLoaded(true)
        })
        return () => {
            setBlocks(undefined)
            setHouseholds(undefined)
            setStateOfTerritory(undefined)
        }
    }, [territory])

    useEffect(() => {
        if (!territory || !households || !households.length) return
        let householdsToShow0: typeHousehold[]
        if (isShowingAllStates && isShowingAllAvailable) {
            householdsToShow0 = households.filter(x =>
                x.manzana === currentBlock && x.territorio === territory
            )
            setShowBottomBtns(false)
        } else if (!isShowingAllStates && isShowingAllAvailable) {
            householdsToShow0 = households.filter(x =>
                x.manzana === currentBlock && x.territorio === territory && ((x.estado === noPredicado && x.noAbonado !== true) || x.doNotMove)
            )
            setShowBottomBtns(false)
        } else if (isShowingAllStates && !isShowingAllAvailable) {
            const householdsToShow1 = households.filter(x =>
                x.manzana === currentBlock && x.territorio === territory
            )
            householdsToShow0 = householdsToShow1.slice(0, brought)
            if (householdsToShow0.length === householdsToShow1.length) setShowBottomBtns(false)
        } else {
            const householdsToShow1 = households.filter(x =>
                x.manzana === currentBlock && x.territorio === territory && ((x.estado === noPredicado && x.noAbonado !== true) || x.doNotMove)
            )
            householdsToShow0 = householdsToShow1.slice(0, brought)
            if (householdsToShow0.length === householdsToShow1.length) setShowBottomBtns(false)
        }
        householdsToShow0 = getHouseholdVariant(householdsToShow0)
        setHouseholdsToShow(householdsToShow0)
    }, [brought, currentBlock, households, isShowingAllAvailable, isShowingAllStates, territory])

    useEffect(() => {
        if (!user || !user.email || !households || !territory) return
        const newSocket: Socket = io(SERVER, { withCredentials: true })
        newSocket.on(householdChangeString, (updatedHousehold: typeHousehold, userEmail: string) => {
            if (!updatedHousehold || updatedHousehold.territorio !== territory || !households) return
            updatedHousehold.doNotMove = true
            const households0: typeHousehold[] = households.map(x => {
                if (x.inner_id === updatedHousehold.inner_id) x = updatedHousehold
                return x
            })
            setHouseholds(households0)
            if (userEmail !== user.email) {
                setShowWarningToaster(true)
                setUserEmailWarningToaster(userEmail)
            }
        })
        if (newSocket) setSocket(newSocket)
        return () => setSocket(undefined)
    }, [households, territory, user])
    
    useEffect(() => {
        if (!socket) return
        setTimeout(() => {
            if (!socket.connected) { console.log("Sin conectar") }
            else { console.log("Conectado") }
        }, 1500)
    }, [socket, socket?.connected])

    useEffect(() => { if (!user || !user.isAuth) navigate('/acceso')}, [navigate, user])

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
                    fontSize: isMobile ? '2.6rem' : '2.8rem',
                    fontWeight: 'bolder',
                    margin: '80px auto 40px auto',
                    textAlign: 'center'
                }}
            >
                TERRITORIO {territory} {stateOfTerritory?.isFinished ? "- TERMINADO" : ""} 
            </h1>


            {!loaded &&
                <Button variant={dark}
                    onClick={() => setShowMap(!showMap)}
                    style={{ display: 'block', margin: '22px auto' }}
                >
                    {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
                </Button>
            }

            {showMap &&
                <img src={`/img/${territory}.jpg`} alt={`Mapa del territorio ${territory}`}
                    className={'d-block mx-auto'}
                    style={{
                        border: isDarkMode ? '1px solid white' : '1px solid black',
                        borderRadius: '8px',
                        height: 'auto',
                        marginBlock: '30px',
                        padding: isMobile ? '10px' : '20px',
                        width: isMobile ? '99%' : '40%'
                    }}
                />
            }
    
            {blocks && !!blocks.length &&
                <Col0a
                    blocks={blocks}
                    currentBlock={currentBlock}
                    setCurrentBlockHandler={setCurrentBlockHandler}
                />
            }

            {territory &&
                <Col0b
                    currentBlock={currentBlock}
                    isShowingAll={isShowingAllStates}
                    isShowingStatistics={isShowingStatistics}
                    setIsShowingAllStatesHandler={setIsShowingAllStatesHandler}
                    setIsShowingStatisticsHandler={setIsShowingStatisticsHandler}
                />
            }

            {stateOfTerritory && !isShowingStatistics && <>
                {stateOfTerritory.isFinished ?
                    <button
                        className={'d-block mx-auto mt-3 mb-5 btn btn-general-red'}
                        onClick={() => openConfirmModalHandler(1)}
                        style={{ fontSize: '1.2rem' }}
                    >
                        Desmarcar este territorio como terminado
                    </button>
                    :
                    <button
                        className={`d-block mx-auto mt-3 mb-5 btn btn-general-blue ${stateOfTerritory === undefined ? 'd-none' : ''}`}
                        onClick={() => openConfirmModalHandler(2)}
                        style={{ fontSize: '1.2rem' }}
                    >
                        Marcar este territorio como terminado
                    </button>
                }
            </>}

            {isShowingStatistics && households && !!households.length &&
                <LocalStatistics
                    households={households}
                    territory={territory}
                    stateOfTerritory={stateOfTerritory}
                />
            }


            {!isShowingStatistics && householdsToShow && !!householdsToShow.length && householdsToShow.map((household: typeHousehold) =>
                <Card key={household.inner_id}
                    id={`card_${household.inner_id}`}
                    className={`${household.asignado ? 'assigned-household' : ''} ${isDarkMode ? 'bg-dark text-white' : 'bg-white'} animate__animated animate__bounceInLeft animate__faster`}
                    style={{
                        border: '1px solid gray',
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        marginBottom: '50px'
                    }}
                >   
                    <Container fluid={'lg'}>

                        <Row style={{ margin: '0 25px', paddingTop: '15px', paddingBottom: '12px' }}>

                            <Col1
                                household={household}
                                showGoogleMapHandler={showGoogleMapHandler}
                            />

                            <Col2
                                household={household}
                                cardId={`card_${household.inner_id}`}
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
            )}

            {!isShowingStatistics && householdsToShow && !!householdsToShow.length && loaded &&
                <Pagination size={'lg'}
                    className={`text-center align-items-center justify-content-center ${showBottomBtns ? '' : 'd-none'}`}
                    style={{
                        fontWeight: 'bolder',
                        marginTop: '80px'
                    }
                }>
                    <Pagination.Item onClick={() => getTenMoreHandler()}>
                        Mostrar 10 más
                    </Pagination.Item>

                    <Pagination.Item onClick={() => setBroughtAllHandler()}>
                        Ver todos {!isShowingAllStates && <span>los no predicados</span>}
                    </Pagination.Item>
                </Pagination>
            }

            {(!householdsToShow || !householdsToShow.length) && !loaded &&
                <Loading mt={5} mb={2} />
            }

            {householdsToShow && !householdsToShow.length && !isShowingAllStates && loaded && !isShowingStatistics && currentBlock &&
                <h3 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                    <br/>
                    No hay viviendas no llamadas en esta manzana {currentBlock} del territorio {territory}
                </h3>
            }
        </>
    )
}
