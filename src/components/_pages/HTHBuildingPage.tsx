import { generateRandomEmail, getCurrentLocalDate, getHTHBuildingService } from '../../services'
import { HTHBuildingModal } from '../house-to-house'
import { hthChangeString } from '../../constants'
import { SERVER } from '../../app-config'
import { setAnonymousEmail, setValuesAndOpenAlertModalReducer } from '../../store'
import { Socket, io } from 'socket.io-client'
import { typeBlock, typeFace, typeHTHBuilding, typeHTHTerritory, typePolygon, typeRootState, typeTerritoryNumber } from '../../models'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'

const socket: Socket = io(SERVER, { withCredentials: true })

export const HTHBuildingPage = () => {
    const unauthUser = useSelector((state: typeRootState) => state.user)
    const [currentBuilding, setCurrentBuilding] = useState<typeHTHBuilding|null>(null)
    const [currentFace, setCurrentFace] = useState<typePolygon|null>(null)
    const block = useParams().block as typeBlock
    const congregation = parseInt(useParams().congregation || '')
    const dispatch = useDispatch()
    const face = useParams().face as typeFace
    const streetNumber = parseInt(useParams().streetNumber || '')
    const territoryNumber = useParams().territoryNumber as typeTerritoryNumber

    const refreshHTHTerritoryHandler = (emitSocket: boolean = true): void => {
        if (!congregation || isNaN(congregation) || !territoryNumber || !block || !face || !streetNumber)
            return
        if (emitSocket) {
            let email = generateRandomEmail()
            dispatch(setAnonymousEmail(email))
            socket.emit(hthChangeString, congregation, territoryNumber, email)
        }
        getHTHBuildingService(congregation, territoryNumber, block, face, streetNumber).then((hthTerritory: typeHTHTerritory|null) => {
            if (!hthTerritory) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: "No se encontró el territorio; tal vez no haya internet",
                    animation: 2
                }))
                return
            }
            const currentFace0: typePolygon|undefined = hthTerritory.map.polygons.find(x => x.block === block && x.face === face)
            if (!currentFace0) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: "No se encontró la calle",
                    animation: 2
                }))
                return
            }
            const currentBuilding0: typeHTHBuilding|undefined = currentFace0.buildings?.find(x => x.streetNumber === streetNumber)
            if (!currentBuilding0) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: "No se encontró el edificio",
                    animation: 2
                }))
                return
            }
            if (!currentBuilding0.dateOfLastSharing || getCurrentLocalDate() !== getCurrentLocalDate(currentBuilding0.dateOfLastSharing)) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: "Este edificio no fue compartido hoy por un capitán de salida",
                    animation: 2
                }))
                return
            }
            setCurrentFace(currentFace0)
            setCurrentBuilding(currentBuilding0)
        })
    }

    useEffect(() => {
        refreshHTHTerritoryHandler()
    }, [])

    useEffect(() => {
        socket.on(hthChangeString, (congregation0: number, territoryNumber0: typeTerritoryNumber, userEmail: string) => {
            if (!congregation0 || congregation0 !== congregation ||
                !territoryNumber0 || territoryNumber0 !== territoryNumber ||
                !userEmail || userEmail === unauthUser.email) {
                return
            }
            refreshHTHTerritoryHandler()
            console.log("Refrescado (2) por uso del usuario", userEmail)
        })
        return () => { socket.off(hthChangeString) }
    }, [unauthUser.email])

    return (
        <>
            {!!currentBuilding && !!currentFace && !!territoryNumber &&
                <HTHBuildingModal
                    // closeBuildingModalHandler={closeBuildingModalHandler}
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
