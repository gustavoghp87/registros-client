import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { HTHForm } from '../'
import { useAuth } from '../../../context/authContext'
import { setValuesAndOpenAlertModalReducer } from '../../../store/AlertModalSlice'
import { addHTHObservationService, editHTHObservationService } from '../../../services'
import { typeAppDispatch, typeObservation, typePolygon, typeTerritoryNumber, typeUser } from '../../../models'

export const HTHObservationsForm = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const closeShowFormHandler: Function = props.closeShowFormHandler
    const currentFace: typePolygon = props.currentFace
    const editText: string = props.editText || ''
    const idEdit: number = props.idEdit || 0
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler
    const territory: typeTerritoryNumber = props.territory
    const [text, setText] = useState<string>(editText)
    const date: string = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
    
    const submitHandler = (e: Event) => {
        e.preventDefault()
        if (!text || !user) return
        const newObservation: typeObservation = {
            creator: user.email,
            date,
            id: idEdit ? idEdit : +new Date(),
            text
        }
        console.log("New observation:", newObservation)
        
        if (!editText) {
            addHTHObservationService(newObservation, territory, currentFace.block, currentFace.face, currentFace.id).then((success: boolean) => {
                if (success) {
                    closeShowFormHandler()
                    refreshDoNotCallHandler()
                    setText('')
                } else {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: 'Algo falló',
                        message: `No se pudo agregar esta Observación de la Manzana ${currentFace.block} Cara ${currentFace.face}: "${newObservation.text}"`,
                        execution: refreshDoNotCallHandler
                    }))
                }
            })
        } else {
            editHTHObservationService(newObservation, territory, currentFace.block, currentFace.face).then((success: boolean) => {
                if (success) {
                    closeShowFormHandler()
                    refreshDoNotCallHandler()
                    setText('')
                } else {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: 'Algo falló',
                        message: `No se pudo editar esta Observación de la Manzana ${currentFace.block} Cara ${currentFace.face}: "${newObservation.text}"`,
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

    const setTextHandler = (text0: string): void => setText(text0)

    return (
        <HTHForm
            cancelFormHandler={cancelFormHandler}
            currentFace={currentFace}
            date={date}
            isDoNotCallForm={false}
            submitHandler={submitHandler}
            territory={territory}
            // specific
            text={text}
            setTextHandler={setTextHandler}
        />
    )
}
