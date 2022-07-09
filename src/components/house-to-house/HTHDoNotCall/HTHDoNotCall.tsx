import { useState } from 'react'
import { typeBlock, typeTerritoryNumber } from '../../../models/territory'
import { generalBlue } from '../../_App'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../../store/store'
import { typeUser } from '../../../models/user'
import { useAuth } from '../../../context/authContext'
import { typeDoNotCall, typeFace } from '../../../models/houseToHouse'
import { HTHDoNotCallForm } from './HTHDoNotCallForm'
import { HTHDoNotCallItem } from './HTHDoNotCallItem'

export const HTHDoNotCall = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const territory: typeTerritoryNumber = props.territory
    const block: typeBlock = props.block
    const face: typeFace = props.face
    const doNotCalls: typeDoNotCall[] = props.doNotCalls ?
        props.doNotCalls
            .filter((noTocar: typeDoNotCall) => noTocar.block === block && noTocar.face === face)
            .sort((a: typeDoNotCall, b: typeDoNotCall) => a.street.localeCompare(b.street) || a.streetNumber - b.streetNumber)
        :
        ['']
    const streets: string[] = props.streets
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const [showForm, setShowForm] = useState<boolean>(false)
    
    const closeShowFormHandler = (): void => {
        setShowForm(false)
    }

    return (
        <div style={{ marginTop: '100px', marginBottom: '50px' }}>

            <h1 className={'py-3 text-center text-white d-block mx-auto'}
                style={{
                    backgroundColor: generalBlue,
                    width: isMobile ? '100%' : '90%',
                    marginBottom: '40px'
                }}
            >
                {doNotCalls && !!doNotCalls.length ?
                    'NO TOCAR'
                    :
                    'No hay No Tocar en esta cara'
                }
            </h1>

            {doNotCalls && !!doNotCalls.length && doNotCalls.map((doNotCall: typeDoNotCall, index: number) => (
                <div key={index}>
                    <HTHDoNotCallItem
                        territory={territory}
                        doNotCall={doNotCall}
                        refreshDoNotCallHandler={refreshHTHTerritoryHandler}
                    />
                </div>
            ))}

            {user && user.isAdmin &&
                <button className={'btn btn-general-blue d-block mx-auto'}
                    style={{ marginTop: '50px' }}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Ocultar' : 'Agregar No Tocar'}
                </button>
            }

            {user && user.isAdmin && showForm &&
                <HTHDoNotCallForm
                    territory={territory}
                    block={block}
                    face={face}
                    streets={streets}
                    closeShowFormHandler={closeShowFormHandler}
                    refreshDoNotCallHandler={refreshHTHTerritoryHandler}
                />
            }
        </div>
    )
}
