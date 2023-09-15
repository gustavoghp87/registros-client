import { Dispatch, FC, SetStateAction } from 'react'
import { Form } from 'react-bootstrap'
import { modifyHTHHouseholdService } from '../../../services'
import { typeBlock, typeFace, typeTerritoryNumber } from '../../../models'

type propsType = {
    block: typeBlock
    congregation: number
    doorName: string
    face: typeFace
    id: number
    isChecked: boolean
    isManager: boolean
    level: number|null
    onDates: number[]
    refreshHTHTerritoryHandler: () => void
    setIsLoading: Dispatch<SetStateAction<boolean>>
    streetNumber: number
    territoryNumber: typeTerritoryNumber
}

export const HTHBuildingCheckbox: FC<propsType> = ({
    block, congregation, doorName, face, id, isChecked, isManager, level,
    onDates, refreshHTHTerritoryHandler, setIsLoading, streetNumber, territoryNumber
}) => {

    const changeCallingStateHandler = async () => {
        if (!territoryNumber || !block || !face || !streetNumber || !id) return
        if (isChecked && !onDates?.some(x => Date.now() - x < 86400000 && new Date(x).getDay() === new Date().getDay())) return
        setIsLoading(true)
        const success = await modifyHTHHouseholdService(congregation, territoryNumber, block, face, streetNumber, id, !isChecked, !!isManager)
        if (!success) {
            alert("Falló el cambio de estado de la vivienda")  // keep alert (modal vs modal)
            return
        }
        setIsLoading(false)
        refreshHTHTerritoryHandler()
    }

    return (
        <Form.Group
            className={'d-flex align-items-center my-2 bg-dark text-white'}
            onClick={() => {}}
            style={{
                border: '1px solid black',
                borderRadius: '7px',
                marginInline: '10px',
                minHeight: '50px',
                width: isManager ? '115px' : '98px'
            }}
        >
            <Form.Check
                type={'checkbox'}
                className={'checkbox-3 d-flex align-items-center'}
                label={isManager ? 'Portería' :
                    level === 0 ? `PB ${doorName}` : `${level}° ${doorName}`
                }
                checked={isChecked}
                onChange={() => changeCallingStateHandler()}
            />
        </Form.Group>
    )
}
