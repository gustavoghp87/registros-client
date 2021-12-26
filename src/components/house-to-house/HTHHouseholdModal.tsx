import { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row, Card } from 'react-bootstrap'
import { addBuildingService, modifyHTHBuildingService, responseType } from '../../services/houseToHouseServices'
import { HTHHouseholdCheckbox } from './HTHHouseholdCheckbox'
import { typeHTHBuilding, typeHTHHousehold } from '../../models/houseToHouse'

export const HTHHouseholdModal = (props: any) => {

    let h: number = 0
    let j: number = 0
    let pisos: string[] = ["Solo PB","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39"]
    const deptosPorPiso: string[] = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"]
    
    const closeHTHModalHandler: any = props.closeHTHModalHandler
    const showModal: boolean = props.showModal
    const streets: string[] = props.streets
    const territory: string = props.territory
    const building: typeHTHBuilding = props.building    // edit

    const [pisosX, setPisosX] = useState<number>(0)
    const [deptosX, setDeptosX] = useState<number>(0)
    const [conLetras, setConLetras] = useState<boolean>(true)
    const [numCorrido, setNumCorrido] = useState<boolean>(false)
    const [sinPB, setSinPB] = useState<boolean>(false)
    const [street, setStreet] = useState<string>("")
    const [streetNumber, setStreetNumber] = useState<number>(0)

    
    useEffect(() => {
        if (building && !!building.households.length) {
            setStreet(building.street)
            setStreetNumber(building.streetNumber)
            setPisosX(building.pisosX)
            setDeptosX(building.deptosX)
            setConLetras(building.conLetras)
            setNumCorrido(building.numCorrido)
            setSinPB(building.sinPB)
        }
    }, [building])

    const setPisosHandler = (pisos: string): void => {
        if (pisos === "Solo PB") setPisosX(1)
        else {
            try {
                const pisosNumber = parseInt(pisos)
                setPisosX(pisosNumber+1)
            } catch (error) {}
        }
    }

    const setDeptosHandler = (deptos: string): void => {
        try {
            const deptosNumber = parseInt(deptos)
            setDeptosX(deptosNumber)
        } catch (error) {}
    }

    const maskForLetraDepto = (depto: string): string => {
        if (depto === "1") return "A"
        else if (depto === "2") return "B"
        else if (depto === "3") return "C"
        else if (depto === "4") return "D"
        else if (depto === "5") return "E"
        else if (depto === "6") return "F"
        else if (depto === "7") return "G"
        else if (depto === "8") return "H"
        else if (depto === "9") return "I"
        else if (depto === "10") return "J"
        else if (depto === "11") return "K"
        else if (depto === "12") return "L"
        else if (depto === "13") return "M"
        else if (depto === "14") return "N"
        else if (depto === "15") return "Ñ"
        else if (depto === "16") return "O"
        else return "Z"
    }

    const maskForCorridoDepto = (piso: string, depto: string): string => {
        if (piso === "PB" && (depto === "A" || depto === "1")) h = 0
        h++
        if (conLetras) {
            if (h === 1) return "A"
            else if (h === 2) return "B"
            else if (h === 3) return "C"
            else if (h === 4) return "D"
            else if (h === 5) return "E"
            else if (h === 6) return "F"
            else if (h === 7) return "G"
            else if (h === 8) return "H"
            else if (h === 9) return "I"
            else if (h === 10) return "J"
            else if (h === 11) return "K"
            else if (h === 12) return "L"
            else if (h === 13) return "M"
            else if (h === 14) return "N"
            else if (h === 15) return "Ñ"
            else if (h === 16) return "O"
            else if (h === 17) return "P"
            else if (h === 18) return "Q"
            else if (h === 19) return "R"
            else if (h === 20) return "S"
            else if (h === 21) return "T"
            else if (h === 22) return "U"
            else if (h === 23) return "V"
            else if (h === 24) return "W"
            else if (h === 25) return "X"
            else if (h === 26) return "Y"
            else return "Z"
        } else {
            return h.toString()
        }
    }

    
    let payloads: typeHTHHousehold[] = []
    
    const register = (household: typeHTHHousehold): void => {
        let isIn: boolean = false
        let k = -1
        payloads.forEach((payload: typeHTHHousehold, index: number) => {
            if (payload.idNumber === household.idNumber) {
                isIn = true
                k = index
            }
        })
        if (building && building.households && building.households.length) for (let i = 0; i < building.households.length; i++) {
            if (building.households[i].idNumber === household.idNumber) household.estado = building.households[i].estado
        }
        if (!isIn) payloads.push(household)
        else payloads[k] = household
    }
    
    const closeHandler = (): void => {
        closeHTHModalHandler()
        if (building) {    // edit
            setPisosX(building.pisosX)
            setDeptosX(building.deptosX)
            setConLetras(building.conLetras)
            setNumCorrido(building.numCorrido)
            setSinPB(building.sinPB)
        } else {
            setStreet("")
            setStreetNumber(0)
            setPisosX(0)
            setDeptosX(0)
            setConLetras(true)
            setNumCorrido(false)
            setSinPB(false)
        }
    }

    const submitHandler = async (event: any): Promise<void> => {
        event.preventDefault()
        if (!territory || !street || !streetNumber || !payloads || !payloads.length) { alert("Faltan datos"); return }
        let someTrue: boolean = false
        payloads.forEach((household: typeHTHHousehold) => {
            if (household.isChecked === true) someTrue = true
        })
        if (!someTrue) { alert("No hay departamentos"); return }
        closeHandler()
        if (!building) {    // add
            const newBuilding: typeHTHBuilding = {
                conLetras,
                deptosX,
                households: payloads,
                numCorrido,
                pisosX,
                sinPB,
                street,
                streetNumber,
                territory
            }
            const response: responseType|null = await addBuildingService(newBuilding)
            if (!response || !response.success) return alert("Falló algo")
            if (response.exists) return alert("Ya existía; en todo caso editarlo")
        } else {            // edit
            building.conLetras = conLetras
            building.deptosX= deptosX
            building.households = payloads
            building.numCorrido = numCorrido
            building.street = street
            building.streetNumber = streetNumber
            const response: boolean = await modifyHTHBuildingService(building)
            if (!response) return alert("Falló algo")
        }
        document.location.reload()
    }


    return (
        <>
            <Modal
                show={showModal}
                onHide={() => closeHandler()}
                backdrop={'static'}
                keyboard={false}
                size={'xl'}
            >
                <Modal.Header closeButton>
                    <Modal.Title className={'text-center'}> {building ? "Editar edificio" : "Agregar edificio"} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitHandler}>

                        <div className={'mb-3 d-flex align-self-center'}>
                            <Form.Group
                                className={'col-6'}
                                // as={Col} style={{ maxWidth: '180px' }}
                            >
                                <Form.Label> Calle </Form.Label>
                                <Form.Select id={"streetSelect"}
                                    value={street}
                                    onChange={() => {
                                        const element = document.getElementById("streetSelect") as HTMLInputElement
                                        if (element) setStreet(element.value)
                                    }}
                                >
                                    <option> {} </option>
                                    {streets && !!streets.length && streets.map((street: string, index: number) =>
                                        <option id={index.toString()} key={index}> {street} </option>
                                    )}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group
                                className={'col-6'}
                                // as={Col} style={{ maxWidth: '180px' }}
                            >
                                <Form.Label> Número </Form.Label>
                                <Form.Control id={"streetNumberSelect"}
                                    type={'number'}
                                    min={'1'}
                                    max={'10000'}
                                    step={'1'}
                                    value={streetNumber ? streetNumber : ""}
                                    onChange={() => {
                                        const element = document.getElementById("streetNumberSelect") as HTMLInputElement
                                        if (element) {
                                            try {
                                                const numb: number = parseInt(element.value)
                                                setStreetNumber(numb)
                                            } catch (error) {}
                                        }
                                    }}
                                    onKeyPress={(event: any) => {if (event.key === '.' || event.key === ',') {event.preventDefault()}}}
                                    onInput={() => "event.target.value = event.target.value.replace(/[^0-9]*/g,'');"}
                                />
                            </Form.Group>
                        </div>




                        <div className={'my-3 d-flex align-self-center'}>
                            <Form.Group
                                className={'col-6'}
                                //as={Col} style={{ maxWidth: '180px' }}
                            >
                                <Form.Label> Pisos </Form.Label>
                                <Form.Select id={"formGridState0"}
                                    value={pisosX ? pisosX : ""}
                                    onChange={() => {
                                        const element = document.getElementById("formGridState0") as HTMLInputElement
                                        if (element) setPisosHandler(element.value)
                                    }
                                }>
                                    <option> {} </option>
                                    {pisos && !!pisos.length && pisos.map((piso: string, index: number) => {
                                        if (!sinPB || (index !== 0 && sinPB && piso !== "Solo PB")) return (
                                            <option id={index.toString()} key={index}> {piso} </option>
                                        )
                                        else return (<option key={index}></option>)
                                    })}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group
                                className={'col-6'}
                                // as={Col} style={{ maxWidth: '180px' }}
                            >
                                <Form.Label> Deptos. por piso </Form.Label>
                                <Form.Select id={"formGridState1"}
                                    value={deptosX ? deptosX : ""}
                                    onChange={() => {
                                        const element = document.getElementById("formGridState1") as HTMLInputElement
                                        if (element) setDeptosHandler(element.value)
                                    }
                                }>
                                    <option> {} </option>
                                    {deptosPorPiso && !!deptosPorPiso && deptosPorPiso.map((deptos: string, index: number) =>
                                        <option id={index.toString()} key={index}> {deptos} </option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </div>




                        <Row className={'mt-4'}>
                            <Form.Group as={Col} className={'mb-3'} onClick={() => setConLetras(!conLetras)}>
                                <Form.Check type={'checkbox'}
                                    label={`Deptos. con letras`}
                                    onChange={() => setConLetras(!conLetras)}
                                    checked={conLetras}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className={'mb-3'} onClick={() => setNumCorrido(!numCorrido)}>
                                <Form.Check type={'checkbox'}
                                    label={`Numeración de corrido`}
                                    onChange={() => setNumCorrido(!numCorrido)}
                                    checked={numCorrido}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className={'mb-3'} onClick={() => setSinPB(!sinPB)}>
                                <Form.Check type={'checkbox'}
                                    label={`Sin PB`}
                                    onChange={() => setSinPB(!sinPB)}
                                    checked={sinPB}
                                />
                            </Form.Group>
                        </Row>



                        <Card className={'my-4 '}>

                            <p className={'mt-4 mb-2 justify-content-center align-items-center text-center font-weight-bolder'}>
                                Esquema del Edificio:
                            </p>

                            <hr />

                            {pisos && !!pisos.length && pisos.map((piso: string, index: number) => {
                                if (piso === "Solo PB") piso = "PB"
                                if (index < pisosX && !(sinPB && piso === "PB")) return(
                                    <div key={index}>
                                        <div className={'row mb-3 mx-1 d-flex justify-content-center align-self-center'}>
                                            {deptosPorPiso && !!deptosPorPiso.length && deptosPorPiso.map((depto: string, index1: number) => {
                                                if (index1 < deptosX) {
                                                    j++
                                                    return (
                                                        <HTHHouseholdCheckbox
                                                            key={index1}
                                                            idNumber={j}
                                                            register={register}
                                                            piso={piso}
                                                            depto={conLetras
                                                                ? (numCorrido
                                                                    ? maskForCorridoDepto(depto, maskForLetraDepto(depto))
                                                                    : maskForLetraDepto(depto))
                                                                : (numCorrido
                                                                    ? maskForCorridoDepto(piso, depto)
                                                                    : depto)
                                                            }
                                                            isCheckedEdit={
                                                                !building
                                                                ? null
                                                                : sinPB && building && building.sinPB && building.households[j-1] !== undefined
                                                                    ? building.households[j-1].isChecked
                                                                    : !sinPB && building && building.sinPB && building.households[j-3]
                                                                        ? building.households[j-3]
                                                                        : false
                                                            }
                                                        />
                                                    )
                                                }
                                                else return (<div key={index1}></div>)
                                            })}
                                        </div>
                                        <hr />
                                    </div>
                                )
                                else return (<div key={index}></div>)
                            })}

                            {/* edit: */}

                        </Card>


                        
                        <Modal.Footer>
                            <Button variant={'success'} type={'submit'}>
                                ACEPTAR
                            </Button>
                            <Button variant={'secondary'} onClick={() => closeHandler()}>
                                CANCELAR
                            </Button>
                        </Modal.Footer>


                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
