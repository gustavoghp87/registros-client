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
                            territoryNumber={territoryNumber}
                        />
                    </div>
                ))
            }

            {user && user.isAdmin &&
                <button className={'btn btn-general-blue btn-size12 d-block mx-auto'}
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
                    territoryNumber={territoryNumber}    
                />
            }
        </div>
    )
}
