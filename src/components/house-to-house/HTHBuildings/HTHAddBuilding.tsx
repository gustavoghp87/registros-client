import { FC, useState } from 'react'
import { HTHAddBuildingModalComplex, HTHAddBuildingModalSimple } from '..'
import { typePolygon, typeTerritoryNumber } from '../../../models'

type propsType = {
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHAddBuilding: FC<propsType> = ({ currentFace, refreshHTHTerritoryHandler, territoryNumber }) => {
    const [showComplex, setShowComplex] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const closeHTHModalHandler = () => {
        setShowModal(false)
        setShowComplex(false)
    }

    return (<>
        <button className={'btn btn-general-blue d-block mx-auto py-2'}
            onClick={() => setShowModal(true)}
            style={{ width: '250px' }}
        >
            Agregar Edificio
        </button>

        {showModal && <>
            {showComplex ?
                <HTHAddBuildingModalComplex
                    closeHTHModalHandler={closeHTHModalHandler}
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    setShowComplex={setShowComplex}
                    territoryNumber={territoryNumber}
                />
                :
                <HTHAddBuildingModalSimple
                    closeHTHModalHandler={closeHTHModalHandler}
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    setShowComplex={setShowComplex}
                    territoryNumber={territoryNumber}
                />
            }
        </>}
    </>)
}
