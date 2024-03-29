import { Col0a, Col0b, FewHouseholdsWarning, FreePhonesMessage, LocalStatistics, MapModalTeleph, PhonesToShowPagination, StateOfTerritoryBtn, StaticMap, TelephonicCard } from '../telephonic'
import { getBlocks, getTLPTerritoryService, getHouseholdsToShow, getHouseholdVariant, goToTop } from '../../services'
import { H2, Loading, WarningToaster } from '../commons'
import { io, Socket } from 'socket.io-client'
import { SERVER } from '../../app-config'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { telephonicHouseholdChangeString } from '../../constants'
import { typeBlock, typeHousehold, typeRootState, typeTelephonicTerritory, typeTerritoryNumber } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { useState, useEffect, useCallback } from 'react'

const socket: Socket = io(SERVER, { withCredentials: true })

export const TelephonicPage = () => {
    const territoryNumber: typeTerritoryNumber = useParams<any>().territoryNumber as typeTerritoryNumber
    const { user } = useSelector((state: typeRootState) => ({
        user: state.user
    }))
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [addressToShowInGoogleMaps, setAddressToShowInGoogleMaps] = useState("")
    const [blocks, setBlocks] = useState<typeBlock[]>()
    const [brought, setBrought] = useState(10)
    const [currentBlock, setCurrentBlock] = useState<typeBlock>()
    const [telephonicTerritory, setTelephonicTerritory] = useState<typeTelephonicTerritory>()
    const [householdsToShow, setHouseholdsToShow] = useState<typeHousehold[]>()
    const [loaded, setLoaded] = useState(false)
    const [isShowingAllStates, setIsShowingAllStates] = useState(false)
    const [isShowingAllAvailable, setIsShowingAllAvailable] = useState(false)
    const [isShowingStatistics, setIsShowingStatistics] = useState(false)
    const [showPagination, setShowPagination] = useState(true)
    const [showWarningToaster, setShowWarningToaster] = useState(false)
    const [userEmailWarningToaster, setUserEmailWarningToaster] = useState<string>()

    const openAlertModalHandler = (title: string, message: string, animation?: number): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            animation
        }))
    }

    const setBroughtAllHandler = (): void => {
        setIsShowingAllAvailable(true)
        setShowPagination(false)
    }

    const setCurrentBlockHandler = (value: typeBlock): void => {
        setIsShowingStatistics(false)
        setIsShowingAllAvailable(false)
        setIsShowingAllStates(false)
        setBrought(10)
        setShowPagination(true)
        setCurrentBlock(value)
    }
    
    const setIsShowingAllStatesHandler = (value: boolean): void => {
        setIsShowingStatistics(false)
        setIsShowingAllAvailable(false)
        setIsShowingAllStates(value)
        setBrought(10)
        setShowPagination(true)
    }

    const setIsShowingStatisticsHandler = () => {
        setIsShowingStatistics(true)
        setIsShowingAllAvailable(false)
        setIsShowingAllStates(false)
        setCurrentBlock(undefined)
    }

    const closeWarningToasterHandler = (): void => setShowWarningToaster(false)

    const hideGoogleMapHandler = (): void => setAddressToShowInGoogleMaps("")

    const updateHouseholdsToShow = useCallback(() => {
        if (!currentBlock) return setHouseholdsToShow([])
        if (!telephonicTerritory) return
        let householdsToShow0: typeHousehold[] =
            getHouseholdsToShow(telephonicTerritory.households, currentBlock, isShowingAllStates, isShowingAllAvailable)
        const temp: typeHousehold[] = householdsToShow0
        if (!isShowingAllAvailable) {
            householdsToShow0 = householdsToShow0.slice(0, brought)
        }
        if (isShowingAllAvailable || householdsToShow0.length === temp.length) {
            setShowPagination(false)
        }
        householdsToShow0 = getHouseholdVariant(householdsToShow0)
        setHouseholdsToShow(householdsToShow0)
    }, [brought, currentBlock, isShowingAllAvailable, isShowingAllStates, telephonicTerritory])

    useEffect(() => {
        if (!territoryNumber) return navigate('/selector')
        goToTop()
        getTLPTerritoryService(territoryNumber).then((telephonicTerritory0: typeTelephonicTerritory|null) => {
            setLoaded(true)
            if (!telephonicTerritory0) return navigate('/selector')
            const blocks: typeBlock[] = getBlocks(telephonicTerritory0.households)
            setBlocks(blocks)
            setCurrentBlock(blocks[0])
            setTelephonicTerritory(telephonicTerritory0)
        })
        return () => {
            setBlocks(undefined)
            setUserEmailWarningToaster(undefined)
            setTelephonicTerritory(undefined)
        }
    }, [navigate, territoryNumber])

    useEffect(() => {
        updateHouseholdsToShow()
    }, [brought, currentBlock, isShowingAllAvailable, isShowingAllStates, telephonicTerritory, updateHouseholdsToShow])
    
    useEffect(() => {
        socket.on(telephonicHouseholdChangeString, (congregation: number, territoryNumber0: typeTerritoryNumber, updatedHousehold: typeHousehold, userEmail: string) => {
            if (!congregation || !updatedHousehold || congregation !== user.congregation || territoryNumber0 !== territoryNumber) return
            if (userEmail !== user.email) {
                setShowWarningToaster(true)
                setUserEmailWarningToaster(userEmail)
            }
            updatedHousehold.doNotMove = true
            if (!telephonicTerritory) return
            const updatedTerritory: typeTelephonicTerritory = {
                ...telephonicTerritory,
                households: telephonicTerritory?.households?.map(x => {
                    if (x.householdId === updatedHousehold.householdId) {
                        x = updatedHousehold
                    }
                    return x
                })
            }
            setTelephonicTerritory(updatedTerritory)
            updateHouseholdsToShow()
        })
        return () => { socket.off(telephonicHouseholdChangeString) }
    }, [brought, currentBlock, isShowingAllAvailable, isShowingAllStates, telephonicTerritory, territoryNumber, updateHouseholdsToShow, user.congregation, user.email])

    return (
        <>
            {addressToShowInGoogleMaps &&
                <MapModalTeleph
                    address={addressToShowInGoogleMaps}
                    hideGoogleMapHandler={hideGoogleMapHandler}
                />
            }

            {loaded &&
                <div style={{ marginTop: '30px', position: 'fixed', zIndex: 4 }}>
                    <FewHouseholdsWarning
                        households={telephonicTerritory?.households}
                    />

                    {(!socket || !socket.connected) &&
                        <WarningToaster
                            bodyText={"Refrescar la página y verificar que hay internet"}
                            headerText={<strong>Hay un problema de conexión</strong>}
                        />
                    }

                    {showWarningToaster && userEmailWarningToaster &&
                        <WarningToaster
                            bodyText={["Este territorio está siendo trabajado por el usuario ", <strong key={0}>{userEmailWarningToaster}</strong>]}
                            closeWarningToaster={closeWarningToasterHandler}
                            headerText={<strong>Posible confusión de asignación</strong>}
                        />
                    }
                </div>
            }

            <H2 title={"TELEFÓNICA"} mb={'0px'} />

            <H2 title={`TERRITORIO ${territoryNumber} ${telephonicTerritory?.stateOfTerritory.isFinished ? "- TERMINADO" : ""}`}
                mt={'10px'}
                mb={'50px'}
            />

            {!loaded && <Loading mt={'60px'} mb={'10px'} />}

            {loaded && !isShowingStatistics && telephonicTerritory &&
                <StaticMap
                    mapId={telephonicTerritory.mapId}
                    territoryNumber={territoryNumber}
                />
            }

            {loaded &&
                <>
                    <Col0a
                        blocks={blocks}
                        currentBlock={currentBlock}
                        setCurrentBlockHandler={setCurrentBlockHandler}
                    />

                    <Col0b
                        isShowingAll={isShowingAllStates}
                        isShowingStatistics={isShowingStatistics}
                        setIsShowingAllStatesHandler={setIsShowingAllStatesHandler}
                        setIsShowingStatisticsHandler={setIsShowingStatisticsHandler}
                    />
                </>
            }

            {isShowingStatistics ?
                <>
                    {!!telephonicTerritory ?
                        <LocalStatistics
                            telephonicTerritory={telephonicTerritory}
                        />
                        :
                        <>Error en datos de Estadísticas Locales</>
                    }
                </>
                :
                <>
                    {telephonicTerritory &&
                        <>
                            <StateOfTerritoryBtn
                                isFinished={telephonicTerritory.stateOfTerritory.isFinished}
                                openAlertModalHandler={openAlertModalHandler}
                                territoryNumber={territoryNumber}
                            />
                            <FreePhonesMessage
                                currentBlock={currentBlock}
                                households={telephonicTerritory?.households}
                                loaded={loaded}
                                territoryNumber={territoryNumber}
                            />
                        </>
                    }

                    {!!householdsToShow?.length && householdsToShow?.map((household: typeHousehold) =>
                        <TelephonicCard
                            household={household}
                            key={household.householdId}
                            openAlertModalHandler={openAlertModalHandler}
                            setAddressToShowInGoogleMaps={setAddressToShowInGoogleMaps}
                            socket={socket}
                            territoryNumber={territoryNumber}
                        />
                    )}

                    {!!householdsToShow?.length && showPagination &&
                        <PhonesToShowPagination
                            isShowingAllStates={isShowingAllStates}
                            setBrought={setBrought}
                            setBroughtAllHandler={setBroughtAllHandler}
                        />
                    }
                </>
            }
        </>
    )
}
