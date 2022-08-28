import { useState } from 'react'
import { HTHBuildingModal } from '..'
import { typeHTHBuilding, typeHTHHousehold, typePolygon, typeTerritoryNumber } from '../../../models'

export const HTHBuildingItem = (props: any) => {

    const building: typeHTHBuilding = props.building
    const currentFace: typePolygon = props.currentFace
    const refreshHTHTerritoryHandler: () => void = props.refreshHTHTerritoryHandler
    const territoryNumber: typeTerritoryNumber = props.territoryNumber
    const [show, setShow] = useState<boolean>(false)

    const getFreeHouseholds = (households: typeHTHHousehold[]): number => {
        if (!households || !households.length) return 0
        return households.filter(x => !x.isChecked).length
    }

    const closeBuildingModalHandler = (): void => setShow(false)

    return (
        <>
            <button
                className={`btn ${getFreeHouseholds(building.households) ? 'btn-general-blue' : 'btn-general-red'} d-block mx-auto my-3`}
                key={building.streetNumber}
                onClick={() => setShow(true)}
                style={{ width: '250px' }}
            >
                <div> {currentFace.street} {building.streetNumber} ({getFreeHouseholds(building.households)} libres) </div>
            </button>

            {show &&
                <HTHBuildingModal
                    closeBuildingModalHandler={closeBuildingModalHandler}
                    currentBuilding={building}
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryNumber}
                />
            }
        </>
    )
}
