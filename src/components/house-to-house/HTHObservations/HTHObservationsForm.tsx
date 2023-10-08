import { addHTHObservationService, editHTHObservationService, maskTheBlock } from '../../../services'
import { FC, FormEvent, useState } from 'react'
import { HTHForm } from '../'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeObservation, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    closeShowFormHandler: () => void
    currentFace: typePolygon
    editText: string
    idEdit: number
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHObservationsForm: FC<propsType> = ({ closeShowFormHandler, currentFace, editText, idEdit, refreshHTHTerritoryHandler, territoryNumber }) => {
    const { config, user } = useSelector((state: typeRootState) => ({
        config: state.config,
        user: state.user
    }))
    const dispatch = useDispatch()
    const [text, setText] = useState<string>(editText)
    const date: string = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
    
    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!text || !text.trim() || !user) return
        const newObservation: typeObservation = {
            creatorId: user.id,
            date,
            id: idEdit ? idEdit : +new Date(),
            text: text.trim()
        }
        
        if (!editText) {
            addHTHObservationService(territoryNumber, currentFace.block, currentFace.face, currentFace.id, newObservation).then((success: boolean) => {
                if (!success) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: 'Algo falló',
                        message: `No se pudo agregar esta Observación de la Manzana ${maskTheBlock(currentFace.block, config.usingLettersForBlocks)}, cara ${currentFace.street}: "${newObservation.text}"`,
                        execution: refreshHTHTerritoryHandler,
                        animation: 2
                    }))
                    return
                } else {
                    closeShowFormHandler()
                    refreshHTHTerritoryHandler()
                    setText('')
                }
            })
        } else {
            editHTHObservationService(territoryNumber, currentFace.block, currentFace.face, newObservation).then((success: boolean) => {
                if (success) {
                    closeShowFormHandler()
                    refreshHTHTerritoryHandler()
                    setText('')
                } else {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: 'Algo falló',
                        message: `No se pudo editar esta Observación de la Manzana ${maskTheBlock(currentFace.block, config.usingLettersForBlocks)}, cara ${currentFace.street}: "${newObservation.text}"`,
                        execution: refreshHTHTerritoryHandler,
                        animation: 2
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
            territoryNumber={territoryNumber}
            // specific
            text={text}
            setTextHandler={setTextHandler}
        />
    )
}
