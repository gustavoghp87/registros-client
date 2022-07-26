import { useState } from 'react'
import { useSelector } from 'react-redux'
import { HTHObservationsForm, HTHObservationsItem } from '../'
import { generalBlue } from '../../../config'
import { typeObservation, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'

export const HTHObservations = (props: any) => {

    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const currentFace: typePolygon = props.currentFace
    const date: string = props.date
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territory: typeTerritoryNumber = props.territory
    const [showForm, setShowForm] = useState<boolean>(false)

    const closeShowFormHandler = (): void => setShowForm(false)

    return (
        <div style={{ marginTop: '100px', marginBottom: '50px' }}>
            
            <h1 className={'py-3 text-center text-white d-block mx-auto'}
                style={{
                    backgroundColor: generalBlue,
                    marginBottom: '50px',
                    width: isMobile ? '100%' : '90%'
                }}
            >
                {currentFace.observations && !!currentFace.observations.length ?
                    'OBSERVACIONES'
                    :
                    'No hay Observaciones en esta cara'}
            </h1>

            {currentFace.observations && !!currentFace.observations.length &&
                currentFace.observations.map((observation: typeObservation) => (
                    <div key={observation.id}>
                        <HTHObservationsItem
                            closeShowFormHandler={closeShowFormHandler}
                            currentFace={currentFace}
                            date={date}
                            observation={observation}
                            refreshDoNotCallHandler={refreshHTHTerritoryHandler}
                            territory={territory}
                        />
                    </div>
                ))
            }

            {user && user.isAdmin &&
                <button className={'btn btn-general-blue d-block mx-auto'}
                    style={{ marginTop: '50px' }}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Ocultar' : 'Agregar Observación'}
                </button>
            }

            {user && user.isAdmin && showForm &&
                <HTHObservationsForm
                    closeShowFormHandler={closeShowFormHandler}
                    currentFace={currentFace}
                    date={date}
                    refreshDoNotCallHandler={refreshHTHTerritoryHandler}
                    territory={territory}
                />
            }

        </div>
    )
}
