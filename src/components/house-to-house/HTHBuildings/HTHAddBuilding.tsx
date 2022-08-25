import { useState } from 'react'
import { HTHAddBuildingModal } from './HTHAddBuildingModal'
import { typePolygon, typeTerritoryNumber } from '../../../models'

export const HTHAddBuilding = (props: any) => {

    const currentFace: typePolygon = props.currentFace
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territoryNumber: typeTerritoryNumber = props.territoryNumber
    const [showModal, setShowModal] = useState<boolean>(false)

    const closeHTHModalHandler = (): void => setShowModal(false)

    return (
        <>
            <button className={'btn btn-general-red d-block mx-auto py-2'}
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
