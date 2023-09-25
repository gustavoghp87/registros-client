import { addBuildingService, getHthNewComplexBuilding } from '../../../services'
import { Button, Form, Modal } from 'react-bootstrap'
import { Dispatch, FC, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { Hr } from '../../commons'
import { hthConfigOptions } from '../../../app-config'
import { typeHTHBuilding, typeHTHHousehold, typeHthNewComplexBuildingItem, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    closeHTHModalHandler: () => void
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    setShowComplex: Dispatch<SetStateAction<boolean>>
    territoryNumber: typeTerritoryNumber
}

export const HTHAddBuildingModalComplex: FC<propsType> = ({
    closeHTHModalHandler, currentFace, refreshHTHTerritoryHandler, setShowComplex, territoryNumber
}) => {
    const [isSecondStage, setIsSecondStage] = useState(false)
    const [numberOfLevels, setNumberOfLevels] = useState<number>(4)
    const [numberPerLevel, setNumberPerLevel] = useState<number>(2)
    const [state, setState] = useState<typeHthNewComplexBuildingItem[][]>(getHthNewComplexBuilding(numberOfLevels, numberPerLevel))
    const [streetNumber, setStreetNumber] = useState(0)
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)

    const submitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!isSecondStage) {
            setIsSecondStage(true)
            return
        }
        const households: typeHTHHousehold[] = []
        const x = [...document.getElementsByClassName('hthBuildingCheckboxInput')] as HTMLInputElement[]
        let areComplete = true
        x.forEach(y => {
            const obj = JSON.parse(y.value) as { row: number; column: number; }
            const element = document.getElementById(`checkbox-${obj.column}-${obj.row}`)
            if (element?.classList.contains('bg-dark')) {
                const input = document.getElementById(`input-${obj.column}-${obj.row}`) as HTMLInputElement
                if (input?.value) {
                    const doorName = input.value.trim()
                    if (doorName) {
                        households.push({
                            doorName: doorName.length > 20 ? doorName.substring(0, 20) : doorName,
                            doorNumber: obj.column,
                            id: 0,
                            isChecked: false,
                            level: obj.row,
                            offDates: [],
                            onDates: []
                        })
                    } else {
                        areComplete = false
                    }
                }
                
            }
        })
        if (!areComplete) {
            return alert("Completar todos los timbres")
        }
        if (!territoryNumber || !currentFace.street || !streetNumber || !households?.length) {
            alert("Faltan datos")
            return
        }
        const building: typeHTHBuilding = {
            creatorId: 1,
            dateOfLastSharing: 0,
            hasCharacters: false,
            hasContinuousNumbers: false,
            hasLowLevel: false,
            households,
            isComplex: true,
            numberOfLevels,
            numberPerLevel,
            reverseOrderX: false,
            reverseOrderY: false,
            streetNumber
        }
        addBuildingService(territoryNumber, currentFace.block, currentFace.face, building).then(response => {
            if (response?.success) {
                closeHTHModalHandler()
                refreshHTHTerritoryHandler()
                return
            }
            if (response?.dataError) {
                alert("Falló algo en los datos")  // keep alert (modal vs modal)
                return
            }
            if (response?.alreadyExists) {
                alert("Este edificio ya existe o hay otro con el mismo número")
                return
            }
            alert("Error: Falló algo")
        })
    }

    useEffect(() => {
        setState(getHthNewComplexBuilding(numberOfLevels, numberPerLevel))
    }, [numberOfLevels, numberPerLevel])

    return (
        <Modal
            backdrop={'static'}
            backdropClassName={isDarkMode ? 'bg-dark': ''}
            contentClassName={isDarkMode ? 'bg-dark text-white' : 'modal-fullscreen'}
            fullscreen
            keyboard={false}
            onHide={() => closeHTHModalHandler()}
            show={true}
        >
            <Modal.Header closeButton>
                <Modal.Title className={'text-center'}> Agregar edificio </Modal.Title>
            </Modal.Header>
    
            <Modal.Body>

                <button className={'btn btn-general-red d-block mx-auto my-3'}
                    style={{ width: '300px'}}
                    onClick={() => setShowComplex(false)}
                >
                    Cambiar a portero simple
                </button>

                <Hr classes={'my-4'} />

                <Form onSubmit={submitHandler}>

                    <div className={'row d-flex align-self-center justify-content-center mt-2 mb-3'}>

                        <Form.Group
                            className={'font-weight-bolder m-2'}
                            style={{ width: '170px' }}
                        >
                            <Form.Label> Calle </Form.Label>
                            <Form.Control
                                type={'text'}
                                value={currentFace.street}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group
                            className={'font-weight-bolder m-2'}
                            style={{ width: '120px' }}
                        >
                            <Form.Label> Número </Form.Label>
                            <Form.Control
                                type={'number'}
                                max={'100000'}
                                min={'1'}
                                value={streetNumber ? streetNumber : ""}
                                onChange={e => setStreetNumber(parseInt(e.target.value))}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group
                            className={'font-weight-bolder m-2'}
                            style={{ width: '130px' }}
                        >
                            <Form.Label> Filas </Form.Label>
                            <Form.Select
                                className={'text-center'}
                                value={numberOfLevels.toString()}
                                onChange={e => isSecondStage ? null : setNumberOfLevels(parseInt(e.target.value))}
                                disabled={isSecondStage}
                            >
                                {hthConfigOptions.buildingLevels.map(level =>
                                    <option key={level}> {level + 1} </option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group
                            className={'font-weight-bolder m-2'}
                            style={{ width: '160px' }}
                        >
                            <Form.Label> Columnas </Form.Label>
                            <Form.Select
                                className={'text-center'}
                                style={{ width: '100px' }}
                                value={numberPerLevel.toString()}
                                onChange={e => isSecondStage ? null : setNumberPerLevel(parseInt(e.target.value))}
                                disabled={isSecondStage}
                            >
                                {hthConfigOptions.buildingDoorNumbers.map(doorNumber =>
                                    <option key={doorNumber}> {doorNumber} </option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <div className={`card my-4 ${streetNumber ? '' : 'd-none'}`}>

                        <h1 className={'bg-dark text-white text-center font-weight-bolder mt-4 mb-2 py-2'}
                            style={{ border: isDarkMode ? '' : '1px solid lightgray', fontSize: '1.6rem' }}
                        >
                            Esquema del Edificio:
                        </h1>

                        <Hr />
                        
                        <div className={'container'} style={{ maxWidth: '100%', overflowX: 'auto' }}>
                            <div className={'d-flex'}>
                                {state.map((el, column) =>
                                    <div key={column} className={'justify-content-center'}>
                                        {el.map((item, row) =>
                                            <div key={`checkbox-${column}-${row}`}
                                                className={isSecondStage ? '' : 'pointer'}
                                                style={{ display: 'flex', justifyContent: 'space-around' }}
                                            >
                                                <div id={`checkbox-${column}-${row}`}
                                                    className={'d-flex align-items-center bg-dark text-white text-center my-2'}
                                                    style={{
                                                        border: '1px solid black',
                                                        borderRadius: '7px',
                                                        marginInline: '10px',
                                                        minHeight: '50px',
                                                        width: '98px'
                                                    }}
                                                    onClick={() => {
                                                        const thisButton = document.getElementById(`checkbox-${column}-${row}`)
                                                        if (isSecondStage || !thisButton) return
                                                        thisButton.classList.remove('bg-dark')
                                                        thisButton.style.border = '1px solid white'
                                                    }}
                                                >
                                                    <input
                                                        className={'hthBuildingCheckboxInput'}
                                                        type={'hidden'}
                                                        value={JSON.stringify({ column, row })}
                                                    />
                                                    {/* {level ? level : 'PB'} {String.fromCharCode(65 + door)} */}
                                                    {isSecondStage && document.getElementById(`checkbox-${column}-${row}`)?.classList.contains('bg-dark') ?
                                                        <input id={`input-${column}-${row}`} type='text' className={'form-control text-center'} />
                                                        :
                                                        item.label
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <Modal.Footer className={'justify-content-center align-items-center'}>
                        <Button variant={'success'} type={'submit'} style={{ height: '40px', width: '120px' }} disabled={!streetNumber}>
                            {isSecondStage ? 'ACEPTAR' : 'SIGUIENTE'}
                        </Button>
                        <Button variant={'secondary'} style={{ height: '40px', width: '120px' }} onClick={() => closeHTHModalHandler()}>
                            CANCELAR
                        </Button>
                    </Modal.Footer>

                </Form>
            </Modal.Body>
        </Modal>
    )
}
