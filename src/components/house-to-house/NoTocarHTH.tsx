import { useState } from 'react'
import { typeBlock, typeTerritoryNumber } from '../../models/territory'
import { MdDelete } from 'react-icons/md'
import { generalBlue } from '../_App'
import { useDispatch, useSelector } from 'react-redux'
import { typeAppDispatch, typeRootState } from '../../store/store'
import { typeUser } from '../../models/user'
import { useAuth } from '../../context/authContext'
import { typeDoNotCall, typeFace } from '../../models/houseToHouse'
import { deleteHTHDoNotCallService } from '../../services/houseToHouseServices'
import { NoTocarHTHForm } from './NoTocarHTHForm'
import { setValuesAndOpenAlertModalReducer } from '../../store/AlertModalSlice'

export const NoTocarHTH = (props: any) => {

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
                    <NoTocarHTHItem
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
                <NoTocarHTHForm
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const NoTocarHTHItem = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const dispatch: typeAppDispatch = useDispatch()
    const territory: typeTerritoryNumber = props.territory
    const doNotCall: typeDoNotCall = props.doNotCall
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler

    const deleteHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Eliminar No Tocar?',
            message: `Se va a eliminar este No Tocar de la Manzana ${doNotCall.block} Cara ${doNotCall.face}: ${doNotCall.street} ${doNotCall.streetNumber} ${doNotCall.doorBell}`,
            execution: deleteConfirmedHandler
        }))
    }

    const deleteConfirmedHandler = (): void => {
        deleteHTHDoNotCallService(doNotCall.id, territory).then((success: boolean) => {
            console.log(success)
            if (success) {
                refreshDoNotCallHandler()
            } else {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: 'Algo falló',
                    message: `No se pudo eliminar este No Tocar de la Manzana ${doNotCall.block} Cara ${doNotCall.face}: ${doNotCall.street} ${doNotCall.streetNumber} ${doNotCall.doorBell}`,
                    execution: refreshDoNotCallHandler
                }))
            }
        })
    }


    return (<>
        {isMobile ?
            <div className={`mt-4 p-3 text-center bg-dark text-white`}
                style={{
                    border: isDarkMode ? '1px solid white' : '1px solid lightgray',
                    borderRadius: '7px'
                }}
            >
                <small> Fecha: {doNotCall.date} </small>

                <div>
                    <h2 className={'mt-2'}>
                        {doNotCall.street} {doNotCall.streetNumber} {doNotCall.doorBell}
                    </h2>
                </div>

                {user && user.isAdmin &&
                    <>
                        <div className={'mt-3 mb-2 py-1'}
                            style={{ border: '1px solid lightgray', borderRadius: '5px', cursor: 'pointer' }}
                            onClick={() => deleteHandler()}
                        >
                            <h4 className={'d-inline'} style={{ cursor: 'pointer' }}>
                                Eliminar &nbsp;
                            </h4>
                            <MdDelete className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }} />
                        </div>
                    </>
                }
            </div>
        :
            <div className={`my-4 p-3 d-block mx-auto w-75 d-flex align-items-center justify-content-center ${isDarkMode ? 'text-white' : ''}`}
                style={{ border: isDarkMode ? '1px solid white' : '1px solid lightgray', borderRadius: '7px' }}
            >

                <h2 className={'d-inline mr-2'}>
                    {doNotCall.street} {doNotCall.streetNumber} {doNotCall.doorBell}
                </h2>
                
                &nbsp;<small> (Fecha: {doNotCall.date})</small>

                {user && user.isAdmin &&
                    <>
                        <h4 className={'d-inline'} style={{ cursor: 'pointer' }} onClick={() => deleteHandler()}>
                            &nbsp; Eliminar &nbsp;
                        </h4>
                        <MdDelete className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                            onClick={() => deleteHandler()}
                        />
                    </>
                }
            </div>
        }
    </>)
}
