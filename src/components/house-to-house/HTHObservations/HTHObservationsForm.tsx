import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from '../../../context/authContext'
import { typeFace, typeObservation } from '../../../models/houseToHouse'
import { typeBlock, typeTerritoryNumber } from '../../../models/territory'
import { typeUser } from '../../../models/user'
import { addHTHObservationService, editHTHObservationService } from '../../../services/houseToHouseServices'
import { setValuesAndOpenAlertModalReducer } from '../../../store/AlertModalSlice'
import { typeAppDispatch } from '../../../store/store'
import { HTHForm } from '../HTHForm'

export const HTHObservationsForm = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const dispatch: typeAppDispatch = useDispatch()
    const block: typeBlock = props.block
    const closeShowFormHandler: Function = props.closeShowFormHandler
    const date: string = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
    const editText: string = props.editText
    const face: typeFace = props.face
    const idEdit: number = props.idEdit
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler
    const territory: typeTerritoryNumber = props.territory
    const [text, setText] = useState<string>(editText ?? '')
    
    const submitHandler = (e: Event) => {
        e.preventDefault()
        if (!text || !user) return
        const observation: typeObservation = {
            block,
            creator: user.email,
            date,
            face,
            id: idEdit ?? +new Date(),
            street: '',
            text
        }
        console.log(observation);
        
        if (!editText) {
            addHTHObservationService(observation, territory).then((success: boolean) => {
                if (success) {
                    closeShowFormHandler()
                    refreshDoNotCallHandler()
                    setText('')
                } else {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: 'Algo falló',
                        message: `No se pudo agregar esta Observación de la Manzana ${observation.block} Cara ${observation.face}: "${observation.text}"`,
                        execution: refreshDoNotCallHandler
                    }))
                }
            })
        } else {
            editHTHObservationService(observation, territory).then((success: boolean) => {
                if (success) {
                    closeShowFormHandler()
                    refreshDoNotCallHandler()
                    setText('')
                } else {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: 'Algo falló',
                        message: `No se pudo editar esta Observación de la Manzana ${observation.block} Cara ${observation.face}: "${observation.text}"`,
                        execution: refreshDoNotCallHandler
                    }))
                }
            })
        }
    }
    
    const cancelFormHandler = (): void => {
        closeShowFormHandler()
        setText('')
    }

    const setTextHandler = (text0: string): void => setTextHandler(text0)


    return (
        <HTHForm
            cancelFormHandler={cancelFormHandler}
            isDoNotCallForm={true}
            submitHandler={submitHandler}
            territory={territory}
            // specific
            text={text}
            setTextHandler={setTextHandler}
        />
    )
}
