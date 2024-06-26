import { generateRandomEmail, getHTHBuildingService } from '../../services'
import { HTHBuildingModal } from '../house-to-house'
import { hthChangeString } from '../../constants'
import { SERVER } from '../../app-config'
import { setAnonymousEmail, setValuesAndOpenAlertModalReducer } from '../../store'
import { Socket, io } from 'socket.io-client'
import { typeBlock, typeFace, typeHTHBuilding, typePolygon, typeRootState, typeTerritoryNumber } from '../../models'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useIdleTimer } from '../commons/custom-hooks/UseIdleTimer'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'

const socket: Socket = io(SERVER, { withCredentials: true })

export const HTHBuildingPage = () => {
    const user = useSelector((state: typeRootState) => state.user)  // remember user could be unauthorized
    const block = useParams().block as typeBlock
    const congregation = parseInt(useParams().congregation || '')
    const face = useParams().face as typeFace
    const streetNumber = parseInt(useParams().streetNumber || '')
    const territoryNumber = useParams().territoryNumber as typeTerritoryNumber

    const [currentBuilding, setCurrentBuilding] = useState<typeHTHBuilding|null>(null)
    const [currentFace, setCurrentFace] = useState<typePolygon|null>(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const closeBuildingModalHandler = () => navigate('/')

    const refreshHTHTerritoryHandler = (emitSocket: boolean = true): void => {
        if (!congregation || isNaN(congregation) || !territoryNumber || !block || !face || !streetNumber)
            return
        if (emitSocket) {
            if (user.email) {
                socket.emit(hthChangeString, congregation, territoryNumber, user.email)
            } else {
                const email = generateRandomEmail()
                dispatch(setAnonymousEmail(email))
                socket.emit(hthChangeString, congregation, territoryNumber, email)
            }
        }
        getHTHBuildingService(congregation, territoryNumber, block, face, streetNumber).then(response => {
            if (response?.notSharedToday) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: "Este edificio no fue compartido hoy por un capitán de salida",
                    animation: 2
                }))
                return
            }
            const hthTerritory0 = response?.hthTerritory
            const currentFace0: typePolygon|undefined = hthTerritory0?.map.polygons.find(x => x.block === block && x.face === face)
            const currentBuilding0: typeHTHBuilding|undefined = currentFace0?.buildings?.find(x => x.streetNumber === streetNumber)
            if (!hthTerritory0 || !currentFace0 || !currentBuilding0) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: "No se encontró el edificio; tal vez no haya internet",
                    animation: 2
                }))
                return
            }
            setCurrentFace(currentFace0)
            setCurrentBuilding(currentBuilding0)
        })
    }

    useIdleTimer(5*60*1000, () => closeBuildingModalHandler())

    useEffect(() => {
        refreshHTHTerritoryHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        socket.on(hthChangeString, (congregation0: number, territoryNumber0: typeTerritoryNumber, userEmail: string) => {
            if (!congregation0 || congregation0 !== congregation ||
                !territoryNumber0 || territoryNumber0 !== territoryNumber ||
                !userEmail || userEmail === user.email) {
                return
            }
            refreshHTHTerritoryHandler()
            console.log("Refrescado (2) por uso del usuario", userEmail)
        })
        return () => { socket.off(hthChangeString) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [congregation, territoryNumber, user.email])

    return (
        <>
            {currentBuilding && currentFace && !!territoryNumber &&
                <HTHBuildingModal
                    closeBuildingModalHandler={closeBuildingModalHandler}
                    congregation={congregation}
                    currentBuilding={currentBuilding}
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryNumber}
                />
            }
        </>
    )
}
