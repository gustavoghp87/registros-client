import { Card, Container, FloatingLabel, Form } from 'react-bootstrap'
import { generalBlue, hthChangeString, typeBlock, typeDoNotCall, typeFace, typeHTHTerritory, typePolygon, typeRootState, typeTerritoryNumber } from '../../models'
import { getHTHTerritoryService, goToTop } from '../../services'
import { H2, Loading, WarningToaster } from '../commons'
import { HTHBuildings, HTHChangeFaceStateButtons, HTHDeleteFaceButton, HTHDoNotCalls, HTHMap, HTHObservations, HTHSetIsFinishedButton } from '../house-to-house'
import { io, Socket } from 'socket.io-client'
import { SERVER } from '../../config'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useState, useEffect, useCallback } from 'react'

const socket: Socket = io(SERVER, { withCredentials: true })

export const HouseToHousePage = () => {
    const territoryNumber = useParams<any>().territoryNumber as typeTerritoryNumber
    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const [currentFace, setCurrentFace] = useState<typePolygon>()
    const [isAddingPolygon, setIsAddingPolygon] = useState<boolean>(false)
    const [isEditingView, setIsEditingView] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showNewFaceOptions, setShowNewFaceOptions] = useState<boolean>(false)
    const [territoryHTH, setTerritoryHTH] = useState<typeHTHTerritory>()
    const [buildingAddress, setBuildingAddress] = useState('')
    const dispatch = useDispatch()

    const setTerritoryHTHHandler = (territoryHTH0: typeHTHTerritory): void => {
        setTerritoryHTH(territoryHTH0)
    }

    const selectBlockAndFaceHandler = (selectedBlock?: typeBlock, selectedFace?: typeFace, hthTerritory0: typeHTHTerritory|null = null) => {
        if (selectedBlock === undefined && selectedFace === undefined) setCurrentFace(undefined)
        if (!selectedBlock || !selectedFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        const target = hthTerritory0 ?? territoryHTH
        let currentFace0 = target.map.polygons.find((x: typePolygon) => x.block === selectedBlock && x.face === selectedFace)
        if (!currentFace0) {
            return
        }
        if (currentFace0.doNotCalls) {
            currentFace0.doNotCalls = currentFace0.doNotCalls.sort((a, b) => a.streetNumber - b.streetNumber)
        }
        if (currentFace0.observations) {
            currentFace0.observations = currentFace0.observations.reverse()
        }
        if (currentFace0) {
            setCurrentFace(currentFace0)
        }
    }

    const refreshHTHTerritoryHandler = useCallback((init?: boolean): void => {
        setIsLoading(true)
        getHTHTerritoryService(territoryNumber).then((hthTerritory0: typeHTHTerritory|null) => {
            setIsLoading(false)
            if (!hthTerritory0) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo recuperar el territorio ${territoryNumber}`,
                animation: 2
            }))
            setTerritoryHTH(hthTerritory0)
            setCurrentFace(x => {
                if (!x) return x
                const currentFace0: typePolygon|undefined = hthTerritory0.map.polygons.find((y: typePolygon) => y.block === x.block && y.face === x.face)
                if (currentFace0) {
                    if (currentFace0.doNotCalls) currentFace0.doNotCalls = currentFace0.doNotCalls.sort((a: typeDoNotCall, b: typeDoNotCall) => a.streetNumber - b.streetNumber)
                    if (currentFace0.observations) currentFace0.observations = currentFace0.observations.reverse()
                }
                return currentFace0
            })
            // type typeMonth = {
            //     month: number
            //     year: number
            // }
            // let monthAndYear: typeMonth
            // let twoMonths: boolean = false
            // if (hthTerritory0.map.)
            hthTerritory0.map.polygons.forEach(x => {
                x.completionData?.completionDates?.forEach(y => {
                    console.log("Closed:", new Date(y))
                    // const date = new Date(y)
                    // const month = date.getUTCMonth()
                    // const year = date.getUTCFullYear()
                    // console.log("Closed:", date)
                    // if (monthAndYear && monthAndYear.month === month && monthAndYear.year === year) return
                    // if (monthAndYear) twoMonths = true
                    // monthAndYear = { month, year }
                })
                x.completionData?.reopeningDates?.forEach(y => {
                    console.log("Opened:", new Date(y))
                })
            })
        })
        if (!init) socket.emit(hthChangeString, user.congregation, territoryNumber, user.email)
    }, [dispatch, territoryNumber, user.congregation, user.email])

    useEffect(() => goToTop(), [])

    useEffect(() => {
        refreshHTHTerritoryHandler(true)
        return () => {
            setCurrentFace(undefined)
            setTerritoryHTH(undefined)
        }
    }, [refreshHTHTerritoryHandler])

    useEffect(() => {
        socket.on(hthChangeString, (congregation: number, territoryNumber0: typeTerritoryNumber, userEmail?: string) => {
            if (congregation && congregation === user.congregation && userEmail && userEmail !== user.email && territoryNumber && territoryNumber0 === territoryNumber) {
                refreshHTHTerritoryHandler(true)
                console.log("Refrescado por uso del usuario", userEmail)
            }
        })
        return () => { socket.off(hthChangeString) }
    }, [refreshHTHTerritoryHandler, territoryNumber, user.congregation, user.email])

    return (
    <>
        <H2 title={"CASA EN CASA"} />

        {isLoading && <Loading mt={'60px'} />}

        {!!territoryHTH && (!socket || !socket.connected) &&
            <div style={{ marginTop: '30px', position: 'fixed', zIndex: 4 }}>
                <WarningToaster
                    bodyText={"Refrescar la página y verificar que hay internet"}
                    headerText={<strong>Hay un problema de conexión</strong>}
                />
            </div>
        }

        <h1
            className={`text-center mt-3 mb-4 ${isDarkMode ? 'text-white' : ''}`}
            style={{ fontWeight: 'bolder' }}
        >
            SELECCIONAR CARA DE MANZANA
        </h1>

        {!!territoryHTH?.map && <>
            <HTHMap
                currentFace={currentFace}
                isAddingPolygon={isAddingPolygon}
                isEditingView={isEditingView}
                refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                selectBlockAndFaceHandler={selectBlockAndFaceHandler}
                setIsAddingPolygon={setIsAddingPolygon}
                setIsEditingView={setIsEditingView}
                setShowNewFaceOptions={setShowNewFaceOptions}
                setTerritoryHTHHandler={setTerritoryHTHHandler}
                showNewFaceOptions={showNewFaceOptions}
                territoryHTH={territoryHTH}
            />
            
            {!showNewFaceOptions && !isEditingView && !isAddingPolygon &&
                <HTHChangeFaceStateButtons
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryHTH.territoryNumber}
                />
            }
        </>}

        <Container
            className={isDarkMode ? 'bg-dark text-white' : ''}
            style={{ paddingBottom: isMobile ? '1px' : '30px' }}
        >

            <h1 className={'text-white py-3 mb-4'}
                style={{
                    backgroundColor: generalBlue,
                    fontSize: isMobile ? '2.3rem' : '2.8rem',
                    fontWeight: 'bolder',
                    margin: isMobile ? '30px auto 20px auto' : '60px auto 40px auto',
                    textAlign: 'center'
                }}
            >
                <span> TERRITORIO {territoryNumber} </span>
                
                {currentFace &&
                    <>
                        <br />
                        <span> Manzana {currentFace.block} </span>
                        <br />
                        <span> Cara {currentFace.face} - {currentFace.street} </span>
                    </>
                }
            </h1>
            
            {!!territoryHTH && !!currentFace && <>
                <HTHSetIsFinishedButton
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryHTH={territoryHTH}
                />
                <HTHBuildings
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryHTH.territoryNumber}
                />
                <HTHObservations
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryHTH.territoryNumber}
                />
                <HTHDoNotCalls
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryHTH.territoryNumber}
                />

                {user.isAdmin && !isMobile &&
                    <HTHDeleteFaceButton
                        currentFace={currentFace}
                        refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                        territoryHTH={territoryHTH}
                    />
                }
            </>}

            {!!territoryHTH && !currentFace &&
                <>
                    <h1>Buscar edificio</h1>
                    <FloatingLabel
                        className={'mb-3 text-dark'}
                        label={"Dirección"}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'text'}
                            placeholder={"Dirección..."}
                            value={buildingAddress}
                            onChange={e => setBuildingAddress((e.target as HTMLInputElement).value)}
                            autoFocus
                        />
                    </FloatingLabel>
                    {territoryHTH.map.polygons.map(p =>
                        <Card>
                            {p.buildings?.map(b => <>
                                {`${p.street} ${b.streetNumber}`.toLowerCase().includes(buildingAddress.toLowerCase()) &&
                                    <span>{p.street} {b.streetNumber}</span>
                                }
                            </>
                            )}
                        </Card>
                    )}
                </>
            }

        </Container>
        
    </>)
}
