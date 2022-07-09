import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '../../../context/authContext'
import { typeRootState } from '../../../store/store'
import { generalBlue } from '../../_App'
import { HTHObservationsForm } from './HTHObservationsForm'
import { HTHObservationsItem } from './HTHObservationsItem'
import { typeFace, typeObservation } from '../../../models/houseToHouse'
import { typeBlock, typeTerritoryNumber } from '../../../models/territory'
import { typeUser } from '../../../models/user'

export const HTHObservations = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const block: typeBlock = props.block
    const face: typeFace = props.face
    const observations: typeObservation[] = props.observations ?
        props.observations
            .filter((observation: typeObservation) => observation.block === block && observation.face === face)
            .reverse()
        :
        []
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
                {observations && !!observations.length ?
                    'OBSERVACIONES'
                    :
                    'No hay Observaciones en esta cara'}
            </h1>

            {observations && !!observations.length && observations.map((observation: typeObservation, index: number) => (
                <div key={index}>
                    <HTHObservationsItem
                        territory={territory}
                        block={block}
                        face={face}
                        observation={observation}
                        closeShowFormHandler={closeShowFormHandler}
                        refreshDoNotCallHandler={refreshHTHTerritoryHandler}
                    />
                </div>
            ))}

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
                    territory={territory}
                    block={block}
                    face={face}
                    closeShowFormHandler={closeShowFormHandler}
                    refreshDoNotCallHandler={refreshHTHTerritoryHandler}
                />
            }

        </div>
    )
}
