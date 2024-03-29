import { BsArrowBarDown } from 'react-icons/bs'
import { FC, useState } from 'react'
import { generalBlue } from '../../../constants'
import { HTHDoNotCallsForm, HTHDoNotCallsItem } from '../'
import { typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHDoNotCalls: FC<propsType> = ({ currentFace, refreshHTHTerritoryHandler, territoryNumber }) => {
    const isMobile = useSelector((state: typeRootState) => state.mobileMode.isMobile)
    const [show, setShow] = useState(false)
    const [showForm, setShowForm] = useState(false)
    
    const closeShowFormHandler = (): void => setShowForm(false)

    return (
        <div style={{ marginTop: '100px', marginBottom: '50px' }}>

            <h1 className={'py-3 text-center text-white d-block mx-auto pointer rounded-3'}
                style={{
                    backgroundColor: !!currentFace.doNotCalls?.length ? generalBlue : 'gray',
                    marginBottom: '50px',
                    width: isMobile ? '100%' : '90%'
                }}
                onClick={() => setShow(x => !x)}
            >
                {!!currentFace.doNotCalls?.length ? 'NO TOCAR' : 'No hay No Tocar en esta cara'} <BsArrowBarDown size={isMobile ? '2rem' : '1.4rem'} />
            </h1>

            {show &&
                <>
                    {!!currentFace.doNotCalls?.length && currentFace.doNotCalls.map(doNotCall =>
                        <HTHDoNotCallsItem
                            currentFace={currentFace}
                            doNotCall={doNotCall}
                            key={doNotCall.id}
                            refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                            territoryNumber={territoryNumber}
                        />
                    )}

                    <button className={'btn btn-general-blue btn-size12 d-block mx-auto'}
                        onClick={() => setShowForm(!showForm)}
                        style={{ marginTop: '50px', width: '250px' }}
                    >
                        {showForm ? 'Ocultar' : 'Agregar No Tocar'}
                    </button>

                    {showForm &&
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
