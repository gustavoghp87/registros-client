import { useState } from 'react'
import { HTHBuildingModal } from '..'
import { getCurrentLocalDate } from '../../../services'
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

    //console.log(building.dateOfLastSharing, getCurrentLocalDate(), getCurrentLocalDate(building.dateOfLastSharing))
    

    return (
        <>
            <div className={'text-center my-3'}>
                <button
                    className={`btn ${getFreeHouseholds(building.households) ? 'btn-general-blue' : 'btn-general-red'} d-inline mx-auto my-2`}
                    key={building.streetNumber}
                    onClick={() => setShow(true)}
                    style={{ width: '220px' }}
                >
                    {currentFace.street} {building.streetNumber} ({getFreeHouseholds(building.households)} libres)
                </button>
                <div className={'form-check form-check-inline ms-3 me-0'}>
                    <input className={'form-check-input share-building'}
                        style={{ height: '20px', width: '20px' }}
                        type={'checkbox'}
                        value={building.streetNumber}
                    />
                    <label className={'form-check-label'} htmlFor="inlineCheckbox1"></label>
                </div>
                {!!building.dateOfLastSharing && getCurrentLocalDate() === getCurrentLocalDate(building.dateOfLastSharing) &&
                    <h6>
                        <span className={'bg-info'}> (Ya compartido hoy) </span>
                    </h6>
                }
            </div>

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
