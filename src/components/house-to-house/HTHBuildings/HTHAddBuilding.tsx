import { FC, useState } from 'react'
import { HTHAddBuildingModalComplex, HTHAddBuildingModalSimple } from '..'
import { Modal } from 'react-bootstrap'
import { typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHAddBuilding: FC<propsType> = ({ currentFace, refreshHTHTerritoryHandler, territoryNumber }) => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)
    const [showComplex, setShowComplex] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const closeHTHModalHandler = (): void => setShowModal(false)

    return (<>
        <button className={'btn btn-general-blue d-block mx-auto py-2'}
            onClick={() => setShowModal(true)}
            style={{ width: '250px' }}
        >
            Agregar Edificio
        </button>

        {showModal &&
            <Modal
                backdrop={'static'}
                backdropClassName={isDarkMode ? 'bg-dark': ''}
                contentClassName={isDarkMode ? 'bg-dark text-white' : ''}
                keyboard={false}
                onHide={() => closeHTHModalHandler()}
                show={true}
                size={'xl'}
            >
                <Modal.Header closeButton>
                    <Modal.Title className={'text-center'}> Agregar edificio </Modal.Title>
                </Modal.Header>
    
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
            </Modal>
        }
    </>)
}
