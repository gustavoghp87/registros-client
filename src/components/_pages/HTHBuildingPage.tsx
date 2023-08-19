import { getCurrentLocalDate, getHTHTerritoryService } from '../../services'
import { HTHBuildingModal } from '../house-to-house'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { typeHTHBuilding, typeHTHTerritory, typePolygon, typeTerritoryNumber } from '../../models'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

export const HTHBuildingPage = () => {
    const territoryNumber = useParams().territoryNumber as typeTerritoryNumber
    const { block, face, streetNumber } = useParams()
    const dispatch = useDispatch()
    const [currentFace, setCurrentFace] = useState<typePolygon>()
    const [currentBuilding, setCurrentBuilding] = useState<typeHTHBuilding>()

    const refreshHTHTerritoryHandler = (): void => { }

    useEffect(() => {
        if (!territoryNumber || !block || !face || !streetNumber) return
        getHTHTerritoryService(territoryNumber).then((hthTerritory: typeHTHTerritory|null) => {
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
            const currentBuilding0: typeHTHBuilding|undefined = currentFace0.buildings?.find(x => x.streetNumber === parseInt(streetNumber))
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
    }, [block, dispatch, face, streetNumber, territoryNumber])

    return (
        <>
            {!!currentBuilding && !!currentFace && !!territoryNumber &&
                <HTHBuildingModal
                    // closeBuildingModalHandler={closeBuildingModalHandler}
                    currentBuilding={currentBuilding}
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryNumber}
                />
            }
        </>
    )
}
