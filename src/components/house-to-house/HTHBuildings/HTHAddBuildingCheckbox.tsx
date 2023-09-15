import { FC, useMemo, useState } from 'react'
import { Form } from 'react-bootstrap'
import { typeHTHHousehold } from '../../../models'

type propsType = {
    doorName: string
    doorNumber: number
    isManager: boolean
    level: number|null
}

export const HTHAddBuildingCheckbox: FC<propsType> = ({ doorName, doorNumber, isManager, level }) => {
    const [isChecked, setIsChecked] = useState(true)

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

    return (<>
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
                width: isManager ? '115px' : '98px'
            }}
        >
            {level !== undefined && doorName !== undefined &&
                <Form.Check
                    type={'checkbox'}
                    className={'checkbox-3 d-flex align-items-center'}
                    label={isManager ? 'Portería' : level === 0 ? `PB ${doorName}` : `${level}° ${doorName}`}
                    checked={isChecked}
                    onChange={() => {}}
                />
            }
        </Form.Group>
    </>)
}
