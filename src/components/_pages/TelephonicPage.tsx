import { useState, useEffect, useCallback } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { io, Socket } from 'socket.io-client'
import { Col0a, Col0b, FewHouseholdsWarning, FreePhonesMessage, LocalStatistics, MapModal, PhonesToShowPagination, StateOfTerritoryBtn, StaticMap, TelephonicCard } from '../telephonic'
import { H2, Loading, WarningToaster } from '../commons'
import { SERVER } from '../../config'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { getBlocks, getHouseholdsByTerritoryService, getHouseholdsToShow, getHouseholdVariant } from '../../services'
import { telephonicHouseholdChangeString, typeAppDispatch, typeBlock, typeHousehold, typeRootState, typeTelephonicTerritory, typeTerritoryNumber } from '../../models'

const socket: Socket = io(SERVER, { withCredentials: true })

export const TelephonicPage = () => {

    const territoryNumber: typeTerritoryNumber = useParams<any>().territory as typeTerritoryNumber
    const { user } = useSelector((state: typeRootState) => ({
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    const [addressToShowInGoogleMaps, setAddressToShowInGoogleMaps] = useState<string>("")
    const [blocks, setBlocks] = useState<typeBlock[]>()
    const [brought, setBrought] = useState<number>(10)
    const [currentBlock, setCurrentBlock] = useState<typeBlock>()
    const [telephonicTerritory, setTelephonicTerritory] = useState<typeTelephonicTerritory>()
    const [householdsToShow, setHouseholdsToShow] = useState<typeHousehold[]>()
    const [loaded, setLoaded] = useState<boolean>(false)
    const [isShowingAllStates, setIsShowingAllStates] = useState<boolean>(false)
    const [isShowingAllAvailable, setIsShowingAllAvailable] = useState<boolean>(false)
    const [isShowingStatistics, setIsShowingStatistics] = useState<boolean>(false)
    const [showPagination, setShowPagination] = useState<boolean>(true)
    const [showWarningToaster, setShowWarningToaster] = useState<boolean>(false)
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

    useEffect(() => {
        if (!territoryNumber) return navigate('/selector')
        window.scrollTo(0, 0)
        getHouseholdsByTerritoryService(territoryNumber).then((telephonicTerritory0: typeTelephonicTerritory|null) => {
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
        updateHouseholdsToShow()
    }, [brought, currentBlock, isShowingAllAvailable, isShowingAllStates, telephonicTerritory, updateHouseholdsToShow])
    
    useEffect(() => {
        socket.on(telephonicHouseholdChangeString, (territoryNumber0: typeTerritoryNumber, updatedHousehold: typeHousehold, userEmail: string) => {
            if (!updatedHousehold || territoryNumber0 !== territoryNumber) return
            if (userEmail !== user.email) {
                setShowWarningToaster(true)
                setUserEmailWarningToaster(userEmail)
            }
            updatedHousehold.doNotMove = true
            setTelephonicTerritory(x => {
                if (!x) return x
                x.households = x.households.map(y => {
                    if (y.householdId === updatedHousehold.householdId) y = updatedHousehold
                    return y
                })
                return x
            })
            updateHouseholdsToShow()
        })
        return () => { socket.off(telephonicHouseholdChangeString) }
    }, [brought, currentBlock, isShowingAllAvailable, isShowingAllStates, telephonicTerritory, territoryNumber, updateHouseholdsToShow, user.email])

    return (
        <>
            {addressToShowInGoogleMaps &&
                <MapModal
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

            {loaded && !isShowingStatistics && 
                <StaticMap territoryNumber={territoryNumber} />
            }

            {loaded &&
                <>
                    <Col0a
                        blocks={blocks}
                        currentBlock={currentBlock}
                        setCurrentBlockHandler={setCurrentBlockHandler}
                    />

                    <Col0b
                        currentBlock={currentBlock}
                        isShowingAll={isShowingAllStates}
                        isShowingStatistics={isShowingStatistics}
                        setIsShowingAllStatesHandler={setIsShowingAllStatesHandler}
                        setIsShowingStatisticsHandler={setIsShowingStatisticsHandler}
                    />
                </>
            }

            {!isShowingStatistics ?
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
                :
                <LocalStatistics
                    telephonicTerritory={telephonicTerritory}
                />
            }
        </>
    )
}