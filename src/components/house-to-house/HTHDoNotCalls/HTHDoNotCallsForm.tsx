import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HTHForm } from '..'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { addHTHDoNotCallService } from '../../../services'
import { typeAppDispatch, typeDoNotCall, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'

export const HTHDoNotCallsForm = (props: any) => {

    const { user } = useSelector((state: typeRootState) => ({
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const closeShowFormHandler: Function = props.closeShowFormHandler
    const currentFace: typePolygon = props.currentFace
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territoryNumber: typeTerritoryNumber = props.territoryNumber
    const [streetNumber, setStreetNumber] = useState<number>(0)
    const [doorBell, setDoorBell] = useState<string>("")
    const date: string = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]

    const submitHandler = (e: Event): void => {
        e.preventDefault()
        if (!user || streetNumber < 1) return
        const newDoNotCall: typeDoNotCall = {
            creatorId: user.id,
            date,
            doorBell: doorBell.trim(),
            id: +new Date(),
            streetNumber
        }
        addHTHDoNotCallService(territoryNumber, currentFace.block, currentFace.face, currentFace.id, newDoNotCall).then((success: boolean) => {
            if (success) {
                closeShowFormHandler()
                refreshHTHTerritoryHandler()
                setStreetNumber(0)
                setDoorBell('')
            } else {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: "Refrescar e intentar de nuevo",
                    animation: 2
                }))
            }
        })
    }

    const cancelFormHandler = (): void => {
        closeShowFormHandler()
        setStreetNumber(0)
        setDoorBell('')
    }

    const setDoorBellHandler = (doorBell0: string): void => setDoorBell(doorBell0)

    const setStreetNumberHandler = (streetNumber0: number): void => setStreetNumber(streetNumber0)

    return (
        <HTHForm
            cancelFormHandler={cancelFormHandler}
            currentFace={currentFace}
            isDoNotCallForm={true}
            submitHandler={submitHandler}
            territoryNumber={territoryNumber}
            // specific
            date={date}
            doorBell={doorBell}
            setDoorBellHandler={setDoorBellHandler}
            setStreetNumberHandler={setStreetNumberHandler}
            streetNumber={streetNumber}
        />
    )
}
