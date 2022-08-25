import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form } from 'react-bootstrap'
import { modifyHTHHouseholdService } from '../../../services'
import { typeAppDispatch, typeBlock, typeFace, typeHTHHousehold, typeTerritoryNumber } from '../../../models'
import { setValuesAndOpenAlertModalReducer } from '../../../store'

export const HTHBuildingCheckbox = (props: any) => {
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    // add and use:
    const level: number = props.level
    const doorName: string = props.doorName
    const doorNumber: number = props.doorNumber
    // use:
    const block: typeBlock = props.block
    const closeBuildingModalHandler: () => void = props.closeBuildingModalHandler
    const face: typeFace = props.face
    const id: number = props.id
    const isChecked0: boolean = props.isChecked0
    const refreshHTHTerritoryHandler: () => void = props.refreshHTHTerritoryHandler
    const streetNumber: number = props.streetNumber
    const territoryNumber: typeTerritoryNumber = props.territoryNumber

    const [isChecked, setIsChecked] = useState<boolean>(isChecked0 ?? isChecked0 === undefined)

    const changeCallingState = (): void => {
        console.log("Cambiando a", !isChecked ? "llamado" : "no llamado", "el", level, doorName)
        modifyHTHHouseholdService(territoryNumber, block, face, streetNumber, id, !isChecked).then((success: boolean) => {
            console.log({success});
            
            if (!success) {
                closeBuildingModalHandler()
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
            dateOfLastCall: 0,
            doorName,
            doorNumber,
            id: 0,
            isChecked,
            level
        }
    }, [doorName, doorNumber, isChecked, level])

    return (
        <>
            <input
                className={'hthBuildingCheckboxInput'}
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
                    width: '98px'
                }}
            >
                {level !== undefined && doorName !== undefined &&
                    <Form.Check
                        checked={isChecked}
                        className={'ml-1 checkbox-3 d-flex align-items-center'}
                        label={level === 0 ? `PB ${doorName}` : `${level}° ${doorName}`}
                        onChange={() => isAddingModal ? null : changeCallingState()}
                        type={'checkbox'}
                    />
                }
            </Form.Group>
        </>
    )
}
