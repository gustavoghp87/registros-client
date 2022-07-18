import { useState } from 'react'
import { useSelector } from 'react-redux'
import { HTHDoNotCallsForm } from './HTHDoNotCallsForm'
import { HTHDoNotCallsItem } from './HTHDoNotCallsItem'
import { generalBlue } from '../../../config'
import { typeRootState } from '../../../store/store'
import { useAuth } from '../../../context/authContext'
import { typeUser } from '../../../models/user'
import { typeDoNotCall, typePolygon } from '../../../models/houseToHouse'
import { typeTerritoryNumber } from '../../../models/territory'

export const HTHDoNotCalls = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const currentFace: typePolygon = props.currentFace
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
                    marginBottom: '50px',
                    width: isMobile ? '100%' : '90%'
                }}
            >
                {currentFace.doNotCalls && !!currentFace.doNotCalls.length ?
                    'NO TOCAR'
                    :
                    'No hay No Tocar en esta cara'
                }
            </h1>

            {currentFace.doNotCalls && !!currentFace.doNotCalls.length &&
                currentFace.doNotCalls.map((doNotCall: typeDoNotCall, index: number) => (
                    <div key={index}>
                        <HTHDoNotCallsItem
                            currentFace={currentFace}
                            doNotCall={doNotCall}
                            refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
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
                    {showForm ? 'Ocultar' : 'Agregar No Tocar'}
                </button>
            }

            {user && user.isAdmin && showForm &&
                <HTHDoNotCallsForm
                    closeShowFormHandler={closeShowFormHandler}
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territory={territory}    
                />
            }
        </div>
    )
}
