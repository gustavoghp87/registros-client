import { useState, useEffect } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { io, Socket } from 'socket.io-client'
import { Col0a, Col0b, FewHouseholdsWarning, FreePhonesMessage, LocalStatistics, MapModal, PhonesToShowPagination, StateOfTerritoryBtn, StaticMap, TelephonicCard } from '../telephonic'
import { H2, Loading, WarningToaster } from '../commons'
import { SERVER } from '../../config'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { getBlocks, getHouseholdsByTerritoryService, getHouseholdsToShow, getHouseholdVariant } from '../../services'
import { householdChangeString, typeAppDispatch, typeBlock, typeHousehold, typeRootState, typeStateOfTerritory, typeTerritoryNumber } from '../../models'

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
    const [households, setHouseholds] = useState<typeHousehold[]>([])
    const [householdsToShow, setHouseholdsToShow] = useState<typeHousehold[]>()
    const [loaded, setLoaded] = useState<boolean>(false)
    const [isShowingAllStates, setIsShowingAllStates] = useState<boolean>(false)
    const [isShowingAllAvailable, setIsShowingAllAvailable] = useState<boolean>(false)
    const [isShowingStatistics, setIsShowingStatistics] = useState<boolean>(false)
    const [showPagination, setShowPagination] = useState<boolean>(true)
    const [showWarningToaster, setShowWarningToaster] = useState<boolean>(false)
    const [stateOfTerritory, setStateOfTerritory] = useState<typeStateOfTerritory>()
    const [userEmailWarningToaster, setUserEmailWarningToaster] = useState<string>()

    const openAlertModalHandler = (title: string, message: string): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message
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
        if (!territoryNumber) return navigate('/index')
        window.scrollTo(0, 0)
        getHouseholdsByTerritoryService(territoryNumber).then((response: [typeHousehold[], typeBlock[], typeStateOfTerritory]|null) => {
            setLoaded(true)
            if (!response || !response[0] || !response[0].length) return navigate('/index')
            const blocks: typeBlock[] = getBlocks(response[0])
            setBlocks(blocks)
            setCurrentBlock(blocks[0])
            setHouseholds(response[0])
            setStateOfTerritory(response[2])
        })
        return () => {
            setBlocks(undefined)
            setStateOfTerritory(undefined)
            setUserEmailWarningToaster(undefined)
        }
    }, [navigate, territoryNumber])

    useEffect(() => {
        if (!currentBlock) return setHouseholdsToShow([])
        let householdsToShow0: typeHousehold[] = getHouseholdsToShow(households, territoryNumber, currentBlock, isShowingAllStates, isShowingAllAvailable)
        const temp: typeHousehold[] = householdsToShow0
        if (!isShowingAllAvailable) {
            householdsToShow0 = householdsToShow0.slice(0, brought)
        }
        if (isShowingAllAvailable || householdsToShow0.length === temp.length) {
            setShowPagination(false)
        }
        householdsToShow0 = getHouseholdVariant(householdsToShow0)
        setHouseholdsToShow(householdsToShow0)
    }, [brought, currentBlock, households, isShowingAllAvailable, isShowingAllStates, territoryNumber])
    
    useEffect(() => {
        socket.on(householdChangeString, (updatedHousehold: typeHousehold, userEmail: string) => {
            if (!updatedHousehold || updatedHousehold.territorio !== territoryNumber) return
            updatedHousehold.doNotMove = true
            setHouseholds(x => {
                if (!x) return []
                const updatedHouseholdsToShow = x.map(y => {
                    if (y.inner_id === updatedHousehold.inner_id) y = updatedHousehold
                    return y
                })
                return updatedHouseholdsToShow
            })
            if (userEmail !== user.email) {
                setShowWarningToaster(true)
                setUserEmailWarningToaster(userEmail)
            }
        })
        return () => { socket.off(householdChangeString) }
    }, [territoryNumber, user.email])

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
                        households={households}
                        territory={territoryNumber}
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
            <H2 title={`TERRITORIO ${territoryNumber} ${stateOfTerritory?.isFinished ? "- TERMINADO" : ""}`} mt={'10px'} mb={'50px'} />

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
                    {stateOfTerritory &&
                        <StateOfTerritoryBtn
                            openAlertModalHandler={openAlertModalHandler}
                            stateOfTerritory={stateOfTerritory}
                            territoryNumber={territoryNumber}
                        />
                    }

                    <FreePhonesMessage
                        currentBlock={currentBlock}
                        households={households}
                        territoryNumber={territoryNumber}
                    />

                    {householdsToShow?.map((household: typeHousehold) =>
                        <TelephonicCard
                            household={household}
                            key={household.inner_id}
                            openAlertModalHandler={openAlertModalHandler}
                            setAddressToShowInGoogleMaps={setAddressToShowInGoogleMaps}
                            socket={socket}
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
                    households={households}
                    territoryNumber={territoryNumber}
                    stateOfTerritory={stateOfTerritory}
                />
            }
        </>
    )
}
