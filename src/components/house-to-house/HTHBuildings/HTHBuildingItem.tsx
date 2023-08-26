import { FC, useState } from 'react'
import { getCurrentLocalDate, getFreeHouseholds } from '../../../services'
import { HTHBuildingModal } from '..'
import { typeHTHBuilding, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    building: typeHTHBuilding
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHBuildingItem: FC<propsType> = ({ building, currentFace, refreshHTHTerritoryHandler, territoryNumber }) => {
    const user = useSelector((state: typeRootState) => state.user)
    const [show, setShow] = useState(false)

    const closeBuildingModalHandler = (): void => setShow(false)

    return (
        <>
            <div className={'text-center my-3'}>
                <button
                    className={`btn ${!!getFreeHouseholds(building) ? 'btn-general-blue' : 'btn-general-red'} d-inline mx-auto my-2`}
                    key={building.streetNumber}
                    onClick={() => setShow(true)}
                    style={{ width: '220px' }}
                >
                    {currentFace.street} {building.streetNumber} ({getFreeHouseholds(building)} libres)
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
                    congregation={user.congregation}
                    currentBuilding={building}
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryNumber}
                />
            }
        </>
    )
}
