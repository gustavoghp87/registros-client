import { useState } from 'react'
import { HTHForm } from '../HTHForm'
import { useAuth } from '../../../context/authContext'
import { addHTHDoNotCallService } from '../../../services/houseToHouseServices'
import { typeBlock, typeTerritoryNumber } from '../../../models/territory'
import { typeDoNotCall, typeFace } from '../../../models/houseToHouse'
import { typeUser } from '../../../models/user'

export const HTHDoNotCallForm = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const block: typeBlock = props.block
    const closeShowFormHandler: Function = props.closeShowFormHandler
    const date: string = new Date(new Date().getTime()-(new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
    const face: typeFace = props.face
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler
    const streets: string[] = props.streets
    const territory: typeTerritoryNumber = props.territory
    const [street, setStreet] = useState<string>('')
    const [streetNumber, setStreetNumber] = useState<number>(0)
    const [doorBell, setDoorBell] = useState<string>('')

    const submitHandler = (e: Event): void => {
        e.preventDefault()
        if (!user || streetNumber < 1 || street === 'Seleccionar la calle') return
        const doNotCall: typeDoNotCall = {
            block,
            creator: user.email,
            date,
            doorBell,
            face,
            id: +new Date(),
            street,
            streetNumber
        }
        addHTHDoNotCallService(doNotCall, territory).then((success: boolean) => {
            if (success) {

            } else {
                
            }
        })
        closeShowFormHandler()
        refreshDoNotCallHandler()
        setStreet('')
        setStreetNumber(0)
        setDoorBell('')
    }

    const cancelFormHandler = (): void => {
        closeShowFormHandler()
        setStreet('')
        setStreetNumber(0)
        setDoorBell('')
    }

    const setDoorBellHandler = (doorBell0: string): void => setDoorBell(doorBell0)
    const setStreetHandler = (street0: string): void => setStreet(street0)
    const setStreetNumberHandler = (streetNumber0: number): void => setStreetNumber(streetNumber0)


    return (
        <HTHForm
            cancelFormHandler={cancelFormHandler}
            isDoNotCallForm={true}
            submitHandler={submitHandler}
            territory={territory}
            // specific
            block={block}
            date={date}
            doorBell={doorBell}
            face={face}
            setDoorBellHandler={setDoorBellHandler}
            setStreetHandler={setStreetHandler}
            setStreetNumberHandler={setStreetNumberHandler}
            streetNumber={streetNumber}
            streets={streets}
        />
    )
}
