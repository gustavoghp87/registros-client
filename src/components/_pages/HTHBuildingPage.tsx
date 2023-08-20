import { getCurrentLocalDate, getHTHBuildingService } from '../../services'
import { HTHBuildingModal } from '../house-to-house'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { typeBlock, typeFace, typeHTHBuilding, typeHTHTerritory, typePolygon, typeTerritoryNumber } from '../../models'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

export const HTHBuildingPage = () => {
    const [currentBuilding, setCurrentBuilding] = useState<typeHTHBuilding>()
    const [currentFace, setCurrentFace] = useState<typePolygon>()
    const block = useParams().block as typeBlock
    const congregation = parseInt(useParams().congregation || '')
    const dispatch = useDispatch()
    const face = useParams().face as typeFace
    const streetNumber = parseInt(useParams().streetNumber || '')
    const territoryNumber = useParams().territoryNumber as typeTerritoryNumber

    const refreshHTHTerritoryHandler = (): void => { }

    useEffect(() => {
        if (!congregation || isNaN(congregation) || !territoryNumber || !block || !face || !streetNumber) return
        getHTHBuildingService(congregation, territoryNumber, block, face, streetNumber).then((hthTerritory: typeHTHTerritory|null) => {
            if (!hthTerritory) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: "No se encontró el territorio; tal vez no haya internet",
                animation: 2
            }))
            const currentFace0: typePolygon|undefined = hthTerritory.map.polygons.find(x => x.block === block && x.face === face)
            if (!currentFace0) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: "No se encontró la calle",
                animation: 2
            }))
            const currentBuilding0: typeHTHBuilding|undefined = currentFace0.buildings?.find(x => x.streetNumber === streetNumber)
            if (!currentBuilding0) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: "No se encontró el edificio",
                animation: 2
            }))
            if (!currentBuilding0.dateOfLastSharing || getCurrentLocalDate() !== getCurrentLocalDate(currentBuilding0.dateOfLastSharing)) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: "Este edificio no fue compartido hoy por un capitán de salida",
                animation: 2
            }))
            setCurrentFace(currentFace0)
            setCurrentBuilding(currentBuilding0)
        })
        return () => {
            setCurrentBuilding(undefined)
            setCurrentFace(undefined)
        }
    }, [block, congregation, dispatch, face, streetNumber, territoryNumber])

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
