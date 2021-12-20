import { useState } from 'react'
import { Button, Col, Form, Modal, Row, Card } from 'react-bootstrap'
import { typeHTHBuilding, typeHTHHousehold } from '../../models/houseToHouse'
import { addBuildingService } from '../../services/houseToHouseServices'
import { HouseholdCheckbox } from './HouseholdCheckbox'

export const NewHouseholdModal = (props: any) => {

    const show: boolean = props.show
    const showHandler: any = props.showHandler
    const territory: string = props.territory
    let h: number = 0
    let j: number = 0

    const [pisosX, setPisosX] = useState<number>(1)
    const [deptosX, setDeptosX] = useState<number>(1)
    const [conLetras, setConLetras] = useState<boolean>(true)
    const [numCorrido, setNumCorrido] = useState<boolean>(false)
    const [sinPB, setSinPB] = useState<boolean>(false)
    const [street, setStreet] = useState<string>("")
    const [streetNumber, setStreetNumber] = useState<number>(0)
    
    const calles: string[] = ["Av. Alberdi", "Pumacahua", "Av. Rivadavia", "Av. Carabobo", "Lautaro", "Camacuá", "Cnl. Ramón L. Falcón"]
    let pisos: string[] = ["Solo PB","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22"]
    const deptosPorPiso: string[] = ["1","2","3","4","5","6","7","8","9","10","11","12"]


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
    
    const register = (newPayload: typeHTHHousehold): void => {
        let isIn: boolean = false
        let k = -1
        payloads.forEach((payload: typeHTHHousehold, index: number) => {
            if (payload.idNumber === newPayload.idNumber) {
                isIn = true
                k = index
            }
        });
        if (!isIn) payloads.push(newPayload)
        else payloads[k] = newPayload
        console.log("register:", payloads)
    }
    
    const closeHandler = (): void => {
        showHandler()
        setPisosX(1)
        setDeptosX(1)
        setConLetras(true)
        setNumCorrido(false)
        setSinPB(false)
    }

    const submitHandler = async (event: any): Promise<void> => {
        event.preventDefault()
        if (!territory || !street || !streetNumber || !payloads || !payloads.length) {
            alert("Faltan datos")
            return
        } else {
            let someTrue: boolean = false
            payloads.forEach((household: typeHTHHousehold) => {
                if (household.isChecked === true) someTrue = true
            })
            if (!someTrue) {
                alert("No hay departamentos")
                return
            }
            closeHandler()
            console.log("Submitting...")
            // ver que no exista ya
            const response: typeHTHBuilding[]|null = await addBuildingService(territory, street, streetNumber, payloads)
            console.log(response)
        }
    }


    return (
        <>
            <Modal
                show={show}
                onHide={() => closeHandler()}
                backdrop={'static'}
                keyboard={false}
                size={'xl'}
            >
                <Modal.Header closeButton>
                    <Modal.Title> Agregar edificio </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitHandler}>


                        <Row className={'mb-3'}>
                            <Form.Group as={Col}>
                                <Form.Label> Calle </Form.Label>
                                <Form.Select id={"calleSelect"}
                                    onChange={() => {
                                        const element = document.getElementById("calleSelect") as HTMLInputElement
                                        if (element) setStreet(element.value)
                                    }}
                                >
                                    <option> {} </option>
                                    {calles.map((calle: string, index: number) =>
                                        <option key={index}> {calle} </option>
                                    )}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label> Número </Form.Label>
                                <Form.Control id={"numeroSelect"}
                                    onChange={() => {
                                        const element = document.getElementById("numeroSelect") as HTMLInputElement
                                        try {
                                            if (element) {
                                                const numb: number = parseInt(element.value)
                                                setStreetNumber(numb)
                                            }
                                        } catch (error) {
                                            
                                        }
                                    }}
                                    type={'number'}
                                    min={'1'}
                                    max={'10000'}
                                    step={'1'}
                                    onKeyPress={(event: any) => {if (event.key === '.' || event.key === ',') {event.preventDefault()}}}
                                    onInput={() => "event.target.value = event.target.value.replace(/[^0-9]*/g,'');"}
                                />
                            </Form.Group>
                        </Row>




                        <Row className={'my-3'}>
                            <Form.Group as={Col}>
                                <Form.Label> Pisos </Form.Label>
                                <Form.Select id={"formGridState0"}
                                    onChange={() => {
                                        const element = document.getElementById("formGridState0") as HTMLInputElement
                                        if (element) setPisosHandler(element.value)
                                    }
                                }>
                                    {/* <option> {} </option> */}
                                    {pisos.map((piso: string, index: number) => {
                                        if (!sinPB || (index !== 0 && sinPB && piso !== "Solo PB")) return (
                                            <option key={index}> {piso} </option>
                                        )
                                        else return <></>
                                    }
                                    )}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label> Deptos. por piso </Form.Label>
                                <Form.Select id={"formGridState1"}
                                    onChange={() => {
                                        const element = document.getElementById("formGridState1") as HTMLInputElement
                                        if (element) setDeptosHandler(element.value)
                                    }
                                }>
                                    {/* <option> {} </option> */}
                                    {deptosPorPiso.map((deptos: string, index: number) =>
                                        <option value={deptos} key={index}> {deptos} </option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Row>




                        <Row>
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



                        <Card className={'my-4'}>

                            <p className={'mt-4'} style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                                Esquema del Edificio:
                            </p>

                            <hr />

                            {pisos.map((piso: string, index: number) => {
                                if (piso === "Solo PB") piso = "PB"
                                if (index < pisosX && !(sinPB && piso === "PB")) return(
                                <>
                                    <Row className={'mb-3 mx-1 d-flex align-self-center'} key={index}>
                                        {deptosPorPiso.map((depto: string, index2: number) => {
                                            if (index2 < deptosX) {
                                                j++
                                                return(
                                                    <HouseholdCheckbox key={index2}
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
                                                    />
                                                )
                                            }
                                            else return (<></>)
                                        })}
                                    </Row>
                                    <hr />
                                </>
                                )
                                else return (<></>)
                            })}

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
