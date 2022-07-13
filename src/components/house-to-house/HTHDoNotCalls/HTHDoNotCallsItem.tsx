import { MdDelete } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { typeAppDispatch, typeRootState } from '../../../store/store'
import { typeUser } from '../../../models/user'
import { useAuth } from '../../../context/authContext'
import { typeDoNotCall, typePolygon } from '../../../models/houseToHouse'
import { deleteHTHDoNotCallService } from '../../../services/houseToHouseServices'
import { setValuesAndOpenAlertModalReducer } from '../../../store/AlertModalSlice'
import { typeTerritoryNumber } from '../../../models/territory'

export const HTHDoNotCallsItem = (props: any) => {
    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const dispatch: typeAppDispatch = useDispatch()
    const currentFace: typePolygon = props.currentFace
    const doNotCall: typeDoNotCall = props.doNotCall
    const territory: typeTerritoryNumber = props.territory
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler

    const deleteHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Eliminar No Tocar?',
            message: `Se va a eliminar este No Tocar de la Manzana ${currentFace.block} Cara ${currentFace.face}: ${currentFace.street} ${doNotCall.streetNumber} ${doNotCall.doorBell}`,
            execution: deleteConfirmedHandler
        }))
    }

    const deleteConfirmedHandler = (): void => {
        deleteHTHDoNotCallService(doNotCall.id, territory, currentFace.block, currentFace.face).then((success: boolean) => {
            console.log(success)
            if (success) {
                refreshHTHTerritoryHandler()
            } else {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: 'Algo falló',
                    message: `No se pudo eliminar este No Tocar de la Manzana ${currentFace.block} Cara ${currentFace.face}: ${currentFace.street} ${doNotCall.streetNumber} ${doNotCall.doorBell}`
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
                        {currentFace.street} {doNotCall.streetNumber} {doNotCall.doorBell}
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
                    {currentFace.street} {doNotCall.streetNumber} {doNotCall.doorBell}
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
