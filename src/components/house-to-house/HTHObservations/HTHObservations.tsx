import { BsArrowBarDown } from 'react-icons/bs'
import { FC, useState } from 'react'
import { generalBlue } from '../../../constants'
import { HTHObservationsForm, HTHObservationsItem } from '../'
import { typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHObservations: FC<propsType> = ({ currentFace, refreshHTHTerritoryHandler, territoryNumber }) => {
    const isMobile = useSelector((state: typeRootState) => state.mobileMode.isMobile)
    const [show, setShow] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const closeShowFormHandler = () => setShowForm(false)

    return (
        <div style={{ marginTop: '100px', marginBottom: '50px' }}>
            
            <h1 className={'py-3 text-center text-white d-block mx-auto pointer rounded-3'}
                style={{
                    backgroundColor: !!currentFace.observations?.length ? generalBlue : 'gray',
                    marginBottom: '50px',
                    width: isMobile ? '100%' : '90%'
                }}
                onClick={() => setShow(x => !x)}
            >
                {!!currentFace.observations?.length ? 'OBSERVACIONES' : 'No hay Observaciones en esta cara'} <BsArrowBarDown size={isMobile ? '2rem' : '1.4rem'} />
            </h1>

            {show && <>
                {!!currentFace.observations?.length && currentFace.observations.map(observation =>
                    <HTHObservationsItem
                        closeShowAddFormHandler={closeShowFormHandler}
                        currentFace={currentFace}
                        key={observation.id}
                        observation={observation}
                        refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                        territoryNumber={territoryNumber}
                    />
                )}

                <button className={'btn btn-general-blue btn-size12 d-block mx-auto'}
                    style={{ marginTop: '50px', width: '250px' }}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Ocultar' : 'Agregar Observación'}
                </button>

                {showForm &&
                    <HTHObservationsForm
                        closeShowFormHandler={closeShowFormHandler}
                        currentFace={currentFace}
                        refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                        territoryNumber={territoryNumber}
                        editText={''}
                        idEdit={0}
                    />
                }
            </>}

        </div>
    )
}
