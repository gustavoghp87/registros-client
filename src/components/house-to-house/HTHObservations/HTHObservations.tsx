import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '../../../context/authContext'
import { typeRootState } from '../../../store/store'
import { generalBlue } from '../../_App'
import { HTHObservationsForm } from './HTHObservationsForm'
import { HTHObservationsItem } from './HTHObservationsItem'
import { typeObservation, typePolygon } from '../../../models/houseToHouse'
import { typeTerritoryNumber } from '../../../models/territory'
import { typeUser } from '../../../models/user'

export const HTHObservations = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const currentFace: typePolygon = props.currentFace
    const date: string = props.date
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territory: typeTerritoryNumber = props.territory
    const [showForm, setShowForm] = useState<boolean>(false)

    const closeShowFormHandler = (): void => {
        setShowForm(false)
    }

    return (
        <div style={{ marginTop: '100px', marginBottom: '50px' }}>
            
            <h1 className={'py-3 text-center text-white d-block mx-auto'}
                style={{
                    backgroundColor: generalBlue,
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
