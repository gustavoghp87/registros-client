import { getHTHTerritoryService, goToTop } from '../../services'
import { H2, Loading, WarningToaster } from '../commons'
import { HTHAllBuildings, HTHDoNotTouchs, HTHMapSection } from '../house-to-house'
import { hthChangeString } from '../../constants'
import { io, Socket } from 'socket.io-client'
import { SERVER } from '../../app-config'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { typeDoNotCall, typeHTHTerritory, typePolygon, typeRootState, typeTerritoryNumber } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useState, useEffect } from 'react'

const socket: Socket = io(SERVER, { withCredentials: true })

export const HouseToHousePage = () => {
    const user = useSelector((state: typeRootState) => state.user)
    const territoryNumber = useParams<any>().territoryNumber as typeTerritoryNumber
    const urlSearchParams = new URLSearchParams(window.location.search)
    const queryParams = Object.fromEntries(urlSearchParams.entries())
    const b = queryParams.b
    const f = queryParams.f

    const [currentFace, setCurrentFace] = useState<typePolygon|null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [territoryHTH, setTerritoryHTH] = useState<typeHTHTerritory|null>(null)
    const dispatch = useDispatch()

    const refreshHTHTerritoryHandler = (emitSocket: boolean = true, isFirstLoading?: boolean): void => {
        if (emitSocket) {
            socket.emit(hthChangeString, user.congregation, territoryNumber, user.email)
        }
        setIsLoading(true)
        getHTHTerritoryService(territoryNumber).then((hthTerritory0: typeHTHTerritory|null) => {
            setIsLoading(false)
            if (!hthTerritory0) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: `No se pudo recuperar el territorio ${territoryNumber}`,
                    animation: 2
                }))
                return
            }
            setTerritoryHTH(hthTerritory0)
            setCurrentFace(x => {
                if (!x) {
                    if (isFirstLoading && b && f) {
                        const currentFace0: typePolygon|null = hthTerritory0.map.polygons?.find(y => y.block === b && y.face === f) ?? null
                        if (currentFace0) {
                            if (currentFace0.doNotCalls) {
                                currentFace0.doNotCalls = currentFace0.doNotCalls.sort((a: typeDoNotCall, b: typeDoNotCall) => a.streetNumber - b.streetNumber)
                            }
                            if (currentFace0.observations) {
                                currentFace0.observations = currentFace0.observations.reverse()
                            }
                        }
                        return currentFace0
                    } else {
                        return x
                    }
                }
                const currentFace0: typePolygon|null = hthTerritory0.map.polygons?.find(y => y.block === x.block && y.face === x.face) ?? null
                if (currentFace0) {
                    if (currentFace0.doNotCalls) {
                        currentFace0.doNotCalls = currentFace0.doNotCalls.sort((a: typeDoNotCall, b: typeDoNotCall) => a.streetNumber - b.streetNumber)
                    }
                    if (currentFace0.observations) {
                        currentFace0.observations = currentFace0.observations.reverse()
                    }
                }
                return currentFace0
            })
            hthTerritory0.map.polygons.forEach(x => {
                x.completionData?.completionDates?.forEach(y => {
                    // console.log("Closed:", new Date(y))
                    // const date = new Date(y)
                    // const month = date.getUTCMonth()
                    // const year = date.getUTCFullYear()
                    // console.log("Closed:", date)
                    // if (monthAndYear && monthAndYear.month === month && monthAndYear.year === year) return
                    // if (monthAndYear) twoMonths = true
                    // monthAndYear = { month, year }
                })
                x.completionData?.reopeningDates?.forEach(y => {
                    // console.log("Opened:", new Date(y))
                })
            })
        })
    }

    useEffect(() => goToTop(), [])

    useEffect(() => {
        refreshHTHTerritoryHandler(false, true)
    }, [])

    useEffect(() => {
        socket.on(hthChangeString, (congregation: number, territoryNumber0: typeTerritoryNumber, userEmail: string) => {
            if (!congregation || congregation !== user.congregation ||
                !territoryNumber || territoryNumber0 !== territoryNumber ||
                !userEmail || userEmail === user.email) {
                return
            }
            refreshHTHTerritoryHandler(false)
            console.log("Refrescado (1) por uso del usuario", userEmail)
        })
        return () => { socket.off(hthChangeString) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [territoryNumber, user.congregation, user.email])

    return (<>

        <H2 title={"CASA EN CASA"} />

        {isLoading && <Loading mt={'60px'} />}

        {territoryHTH && (!socket || !socket.connected) &&
            <div style={{ marginTop: '30px', position: 'fixed', zIndex: 4 }}>
                <WarningToaster
                    bodyText={"Refrescar la página y verificar que hay internet"}
                    headerText={<strong>Hay un problema de conexión</strong>}
                />
            </div>
        }

        {(user.isAdmin || !!user.hthAssignments?.includes(parseInt(territoryNumber))) && <>
            <HTHMapSection
                currentFace={currentFace}
                refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                setCurrentFace={setCurrentFace}
                setTerritoryHTH={setTerritoryHTH}
                territoryHTH={territoryHTH}
                territoryNumber={territoryNumber}
            />
        </>}

        {territoryHTH &&
            <HTHDoNotTouchs
                hthTerritory={territoryHTH}
            />
        }

        {territoryHTH &&
            <HTHAllBuildings
                refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                territoryHTH={territoryHTH}
                territoryNumber={territoryNumber}
            />
        }
    </>)
}
