import { FC, useState } from 'react'
import { generalBlue, typeObservation, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { HTHObservationsForm, HTHObservationsItem } from '../'
import { useSelector } from 'react-redux'

type propsType = {
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHObservations: FC<propsType> = ({ currentFace, refreshHTHTerritoryHandler, territoryNumber }) => {
    const { isMobile } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile
    }))
    const [show, setShow] = useState<boolean>(false)
    const [showForm, setShowForm] = useState<boolean>(false)

    const closeShowFormHandler = () => setShowForm(false)

    return (
        <div style={{ marginTop: '100px', marginBottom: '50px' }}>
            
            <h1 className={'py-3 text-center text-white d-block mx-auto pointer rounded-3'}
                onClick={() => setShow(x => !x)}
                style={{
                    backgroundColor: !!currentFace.observations?.length ? generalBlue : 'gray',
                    marginBottom: '50px',
                    width: isMobile ? '100%' : '90%'
                }}
            >
                {!!currentFace.observations?.length ?
                    'OBSERVACIONES'
                    :
                    'No hay Observaciones en esta cara'
                }
            </h1>

            {show &&
                <>
                    {!!currentFace.observations?.length && currentFace.observations.map((observation: typeObservation) => (
                        <HTHObservationsItem
                            closeShowAddFormHandler={closeShowFormHandler}
                            currentFace={currentFace}
                            key={observation.id}
                            observation={observation}
                            refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                            territoryNumber={territoryNumber}
                        />
                    ))}

                    <button className={'btn btn-general-blue btn-size12 d-block mx-auto'}
                        onClick={() => setShowForm(!showForm)}
                        style={{ marginTop: '50px', width: '250px' }}
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
                </>
            }

        </div>
    )
}
