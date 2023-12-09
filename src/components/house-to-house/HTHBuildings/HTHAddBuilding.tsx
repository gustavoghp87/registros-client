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
    const [streetNumber, setStreetNumber] = useState(0)
    const [streetNumber2, setStreetNumber2] = useState(0)
    const [streetNumber3, setStreetNumber3] = useState(0)

    const closeHTHModalHandler = () => {
        setShowModal(false)
        setShowComplex(false)
        setStreetNumber(0)
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
                    setStreetNumber={setStreetNumber}
                    setStreetNumber2={setStreetNumber2}
                    setStreetNumber3={setStreetNumber3}
                    streetNumber={streetNumber}
                    streetNumber2={streetNumber2}
                    streetNumber3={streetNumber3}
                    territoryNumber={territoryNumber}
                />
                :
                <HTHAddBuildingModalSimple
                    closeHTHModalHandler={closeHTHModalHandler}
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    setShowComplex={setShowComplex}
                    setStreetNumber={setStreetNumber}
                    setStreetNumber2={setStreetNumber2}
                    setStreetNumber3={setStreetNumber3}
                    streetNumber={streetNumber}
                    streetNumber2={streetNumber2}
                    streetNumber3={streetNumber3}
                    territoryNumber={territoryNumber}
                />
            }
        </>}
    </>)
}
