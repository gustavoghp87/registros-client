import { useEffect, useState } from 'react'
import { Col, Form } from 'react-bootstrap'

export const HouseholdCheckbox = (props: any) => {
    const idNumber: number = props.idNumber
    const piso: string = props.piso
    const depto: string = props.depto
    const register: any = props.register

    const [isChecked, setIsChecked] = useState<boolean>(true)

    useEffect(() => {
        register({
            idNumber,
            piso,
            depto,
            isChecked
        })
    }, [idNumber, piso, depto, isChecked, register])


    return (
        <>
            <Form.Group as={Col}
                className={'my-2 bg-dark text-white d-flex align-items-center'}
                style={{
                    marginLeft: '10px',
                    marginRight: '10px',
                    border: '1px solid black',
                    maxWidth: '95px',
                    minWidth: '95px',
                    minHeight: '50px'
                }}
                onClick={() => setIsChecked(!isChecked)}
            >
                <Form.Check type={'checkbox'}
                    className={'ml-1'}
                    checked={isChecked}
                    label={piso === "PB" ? `PB ${depto}` : `${piso}° ${depto}`}
                    onChange={() => setIsChecked(!isChecked)}
                    
                />
            </Form.Group>
        </>
    )
}
