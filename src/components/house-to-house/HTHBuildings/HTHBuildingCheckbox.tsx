import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import { Form } from 'react-bootstrap'
import { modifyHTHHouseholdService } from '../../../services'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeBlock, typeFace, typeHTHHousehold, typeTerritoryNumber } from '../../../models'
import { useDispatch } from 'react-redux'

type propsType = {
    // add and use:
    congregation: number
    doorName: string
    doorNumber: number
    level: number|null
    // use:
    block?: typeBlock
    closeBuildingModalHandler?: () => void
    face?: typeFace
    id?: number
    isChecked0?: boolean
    isManager?: boolean
    refreshHTHTerritoryHandler?: () => void
    setShow?: Dispatch<SetStateAction<boolean>>
    streetNumber?: number
    territoryNumber?: typeTerritoryNumber
}

export const HTHBuildingCheckbox: FC<propsType> = ({
    block, closeBuildingModalHandler, congregation, doorName, doorNumber, face, id, isChecked0,
    isManager, level, refreshHTHTerritoryHandler, setShow, streetNumber, territoryNumber
}) => {
    const dispatch = useDispatch()
    const [isChecked, setIsChecked] = useState<boolean>(isChecked0 ?? isChecked0 === undefined)

    const changeCallingState = (): void => {
        if (!territoryNumber || !block || !face || !streetNumber || !id || !refreshHTHTerritoryHandler) return
        modifyHTHHouseholdService(congregation, territoryNumber, block, face, streetNumber, id, !isChecked, !!isManager).then((success: boolean) => {
            if (!success) {
                if (closeBuildingModalHandler) closeBuildingModalHandler()
                else if (setShow) setShow(false)
                return dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Error",
                    message: "Falló el cambio de estado de la vivienda",
                    animation: 2,
                    execution: refreshHTHTerritoryHandler
                }))
            }
            refreshHTHTerritoryHandler()
        })
    }

    const isAddingModal: boolean = useMemo(() => {
        return isChecked0 === undefined
    }, [isChecked0])

    const inputValue: typeHTHHousehold = useMemo(() => {
        return {
            doorName,
            doorNumber,
            id: 0,
            isChecked,
            level,
            offDates: [],
            onDates: []
        }
    }, [doorName, doorNumber, isChecked, level])

    return (
        <>
            <input
                className={isManager ? '' : 'hthBuildingCheckboxInput'}
                type={'hidden'}
                value={JSON.stringify(inputValue)}
            />
            <Form.Group
                className={`d-flex align-items-center my-2 ${level !== undefined && doorName !== undefined ? 'bg-dark text-white' : ''}`}
                onClick={() => setIsChecked(x => !x)}
                style={{
                    border: level !== undefined && doorName !== undefined ? '1px solid black' : '',
                    borderRadius: '7px',
                    marginInline: '10px',
                    minHeight: '50px',
                    width: isManager ? '115px' : '98px'
                }}
            >
                {level !== undefined && doorName !== undefined &&
                    <Form.Check
                        checked={isChecked}
                        className={'checkbox-3 d-flex align-items-center'}
                        label={isManager ? 'Portería' : level === 0 ? `PB ${doorName}` : `${level}° ${doorName}`}
                        onChange={() => isAddingModal ? null : changeCallingState()}
                        type={'checkbox'}
                    />
                }
            </Form.Group>
        </>
    )
}
