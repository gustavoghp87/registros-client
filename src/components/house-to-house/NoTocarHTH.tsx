import { useState } from 'react'
import { typeBlock, typeTerritoryNumber } from '../../models/territory'
import { MdDelete, MdEdit } from 'react-icons/md'
import { generalBlue } from '../_App'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'
import { typeUser } from '../../models/user'
import { useAuth } from '../../context/authContext'
import { typeDoNotCall, typeFace } from '../../models/houseToHouse'
import { deleteHTHDoNotCallService, editHTHDoNotCallService } from '../../services/houseToHouseServices'
import { NoTocarHTHForm } from './NoTocarHTHForm'

export const NoTocarHTH = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const territory: typeTerritoryNumber = props.territory
    const block: typeBlock = props.block
    const face: typeFace = props.face
    const doNotCalls: typeDoNotCall[] = props.doNotCalls ? props.doNotCalls
        .filter((noTocar: typeDoNotCall) => noTocar.block === block && noTocar.face === face)
        .sort((a: typeDoNotCall, b: typeDoNotCall) => a.street.localeCompare(b.street)) : ['']
    const streets: string[] = props.streets
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler
    const [showForm, setShowForm] = useState<boolean>(false)
    
    const closeShowFormHandler = (): void => {
        setShowForm(false)
    }

    return (
        <>
            <h1 className={'text-center text-white d-block mx-auto pt-3 mt-4'}
                style={{ backgroundColor: generalBlue, minHeight: '80px', width: '80%' }}
            >
                {doNotCalls && !!doNotCalls.length ? 'Listado de No Tocar' : 'No hay No Tocar en esta cara'}
            </h1>

            {doNotCalls && !!doNotCalls.length && doNotCalls.map((doNotCall: typeDoNotCall, index: number) => (
                <div key={index}>
                    <NoTocarHTHItem
                        territory={territory}
                        doNotCall={doNotCall}
                        refreshDoNotCallHandler={refreshDoNotCallHandler}
                    />
                </div>
            ))}

            <button className={'btn btn-general-blue d-block m-auto mt-4'} onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ocultar' : 'Agregar No Tocar'}
            </button>


            {showForm && user && user.isAdmin &&
                <NoTocarHTHForm
                    territory={territory}
                    block={block}
                    face={face}
                    streets={streets}
                    closeShowFormHandler={closeShowFormHandler}
                    refreshDoNotCallHandler={refreshDoNotCallHandler}
                />
            }
        </>
    )
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const NoTocarHTHItem = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const territory: typeTerritoryNumber = props.territory
    const doNotCall: typeDoNotCall = props.doNotCall
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler
    
    const editHandler = (doNotCall: typeDoNotCall): void => {
        console.log("Editando no tocar...", doNotCall)
        editHTHDoNotCallService(doNotCall, territory).then((success: boolean) => {
            console.log(success)
            if (success) {

            } else {

            }
            refreshDoNotCallHandler()
        })
    }

    const deleteHandler = (id: number): void => {
        console.log("Eliminando no tocar...", id)
        deleteHTHDoNotCallService(id, territory).then((success: boolean) => {
            console.log(success)
            if (success) {

            } else {

            }
            refreshDoNotCallHandler()
        })
    }


    return (<>
        {isMobile ?
            <div className={`mt-4 p-3 text-center ${isDarkMode ? 'text-white' : ''}`}
                style={{ border: isDarkMode ? '1px solid white' : '1px solid lightgray', borderRadius: '7px' }}
            >
                <div>
                    <h2 className={'mr-2'}>
                        {doNotCall.street} {doNotCall.streetNumber} {doNotCall.doorBell}
                    </h2>
                    <small className={'text-muted'}> Fecha: {doNotCall.date} </small>
                </div>

                {user && user.isAdmin &&
                    <>
                        <div>
                            <h4 className={'d-inline'} style={{ cursor: 'pointer' }}
                                onClick={() => editHandler(doNotCall)}
                            >
                                Editar &nbsp;
                            </h4>

                            <MdEdit className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                                onClick={() => editHandler(doNotCall)}
                            />
                        </div>

                        <div>
                            <h4 className={'d-inline'} style={{ cursor: 'pointer' }}
                                onClick={() => deleteHandler(doNotCall.id)}
                            >
                                Eliminar &nbsp;
                            </h4>
                            
                            <MdDelete className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                                onClick={() => deleteHandler(doNotCall.id)}
                            />
                        </div>
                    </>
                }
            </div>
        :
            <div className={`mt-4 p-3 d-flex align-items-center justify-content-center ${isDarkMode ? 'text-white' : ''}`}
                style={{ border: isDarkMode ? '1px solid white' : '1px solid lightgray', borderRadius: '7px' }}
            >

                <h2 className={'d-inline mr-2'}>
                    {doNotCall.street} {doNotCall.streetNumber} {doNotCall.doorBell} | <small className={'text-muted'}> Fecha: {doNotCall.date} </small> |
                </h2>

                {user && user.isAdmin &&
                    <>
                        
                        <h4 style={{ cursor: 'pointer' }}
                            onClick={() => editHandler(doNotCall)}
                        >
                            &nbsp; Editar &nbsp;
                        </h4>
                        
                        <MdEdit className={'d-inline align-top'} size={'2rem'} style={{ cursor: 'pointer' }}
                            onClick={() => editHandler(doNotCall)}
                        />
                        
                        <h4 style={{ cursor: 'pointer' }}
                            onClick={() => deleteHandler(doNotCall.id)}
                        >
                            &nbsp; | &nbsp; Eliminar &nbsp;
                        </h4>
                        
                        <MdDelete className={'d-inline align-top'} size={'2rem'} style={{ cursor: 'pointer' }}
                            onClick={() => deleteHandler(doNotCall.id)}
                        />
                    </>
                }
            </div>
        }
    </>)
}
