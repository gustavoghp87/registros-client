import { FC, useState } from 'react'
import { HTHAddBuildingModal } from './HTHAddBuildingModal'
import { typePolygon, typeTerritoryNumber } from '../../../models'

type propsType = {
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHAddBuilding: FC<propsType> = ({ currentFace, refreshHTHTerritoryHandler, territoryNumber }) => {
    const [showModal, setShowModal] = useState(false)

    const closeHTHModalHandler = (): void => setShowModal(false)

    return (
        <>
            <button className={'btn btn-general-blue d-block mx-auto py-2'}
                onClick={() => setShowModal(true)}
                style={{ width: '250px' }}
            >
                Agregar Edificio
            </button>

            {showModal &&
                <HTHAddBuildingModal
                    closeHTHModalHandler={closeHTHModalHandler}
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryNumber}
                />
            }
        </>
    )
}
