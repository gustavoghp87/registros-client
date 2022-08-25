import { useState } from 'react'
import { useSelector } from 'react-redux'
import { HTHDoNotCallsForm, HTHDoNotCallsItem } from '../'
import { generalBlue, typeDoNotCall, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'

export const HTHDoNotCalls = (props: any) => {

    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const currentFace: typePolygon = props.currentFace
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territoryNumber: typeTerritoryNumber = props.territoryNumber
    const [show, setShow] = useState<boolean>(false)
    const [showForm, setShowForm] = useState<boolean>(false)
    
    const closeShowFormHandler = (): void => setShowForm(false)

    return (
        <div style={{ marginTop: '100px', marginBottom: '50px' }}>

            <h1 className={'py-3 text-center text-white d-block mx-auto pointer'}
                onClick={() => setShow(x => !x)}
                style={{
                    backgroundColor: generalBlue,
                    marginBottom: '50px',
                    width: isMobile ? '100%' : '90%'
                }}
            >
                {!!currentFace.doNotCalls?.length ?
                    'NO TOCAR'
                    :
                    'No hay No Tocar en esta cara'
                }
            </h1>

            {show &&
                <>
                    {!!currentFace.doNotCalls?.length && currentFace.doNotCalls.map((doNotCall: typeDoNotCall) => (
                        <HTHDoNotCallsItem
                            currentFace={currentFace}
                            doNotCall={doNotCall}
                            key={doNotCall.id}
                            refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                            territoryNumber={territoryNumber}
                        />
                    ))}

                    {user.isAdmin &&
                        <button className={'btn btn-general-blue btn-size12 d-block mx-auto'}
                            onClick={() => setShowForm(!showForm)}
                            style={{ marginTop: '50px' }}
                        >
                            {showForm ? 'Ocultar' : 'Agregar No Tocar'}
                        </button>
                    }

                    {user.isAdmin && showForm &&
                        <HTHDoNotCallsForm
                            closeShowFormHandler={closeShowFormHandler}
                            currentFace={currentFace}
                            refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                            territoryNumber={territoryNumber}    
                        />
                    }
                </>
            }
        </div>
    )
}
