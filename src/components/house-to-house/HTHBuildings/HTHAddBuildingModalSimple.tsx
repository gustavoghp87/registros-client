import { addBuildingService, getHouseholdDoorBell } from '../../../services'
import { Button, Form, Modal } from 'react-bootstrap'
import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import { Hr } from '../../commons'
import { HTHAddBuildingCheckbox } from '..'
import { hthConfigOptions } from '../../../app-config'
import { typeHTHBuilding, typeHTHHousehold, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    closeHTHModalHandler: () => void
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    setShowComplex: Dispatch<SetStateAction<boolean>>
    setStreetNumber: Dispatch<SetStateAction<number>>
    setStreetNumber2: Dispatch<SetStateAction<number>>
    setStreetNumber3: Dispatch<SetStateAction<number>>
    streetNumber: number
    streetNumber2: number
    streetNumber3: number
    territoryNumber: typeTerritoryNumber
}

export const HTHAddBuildingModalSimple: FC<propsType> = ({
    closeHTHModalHandler, currentFace, refreshHTHTerritoryHandler,
    setShowComplex, setStreetNumber, setStreetNumber2, setStreetNumber3,
    streetNumber, streetNumber2, streetNumber3, territoryNumber
}) => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [hasCharacters, setHasCharacters] = useState(true)
    const [hasContinuousNumbers, setHasContinuousNumbers] = useState(false)
    const [hasLowLevel, setHasLowLevel] = useState(true)
    const [hasManager, setHasManager] = useState(false)
    const [hasNn, setHasNn] = useState(false)
    const [numberOfLevels, setNumberOfLevels] = useState(4)
    const [numberOfNumbers, setNumberOfNumbers] = useState(1)
    const [numberPerLevel, setNumberPerLevel] = useState(2)
    const [reverseOrderX, setReverseOrderX] = useState(false)
    const [reverseOrderY, setReverseOrderY] = useState(false)

    const submitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const households: typeHTHHousehold[] = []
        const x = [...document.getElementsByClassName('hthBuildingCheckboxInput')] as HTMLInputElement[]
        x.forEach(y => {
            const newHousehold: typeHTHHousehold = JSON.parse(y.value)
            if (newHousehold && newHousehold.isChecked) households.push(newHousehold)
        })
        if (!territoryNumber || !currentFace.street || !streetNumber || !households.length) {
            alert("Faltan datos")
            return
        }
        const building: typeHTHBuilding = {
            creatorId: 1,
            dateOfLastSharing: 0,
            hasCharacters,
            hasContinuousNumbers,
            hasLowLevel,
            households,
            isComplex: false,
            numberOfLevels,
            numberPerLevel,
            reverseOrderX,
            reverseOrderY,
            streetNumber,
            streetNumber2: numberOfNumbers > 1 ? streetNumber2 : undefined,
            streetNumber3: numberOfNumbers > 2 ? streetNumber3 : undefined
        }
        if (hasManager) building.manager = {
            doorName: '',
            doorNumber: 0,
            id: +new Date(),
            isChecked: false,
            level: null,
            offDates: [],
            onDates: []
        }
        addBuildingService(territoryNumber, currentFace.block, currentFace.face, building).then(response => {
            if (response?.success) {
                refreshHTHTerritoryHandler()
                closeHTHModalHandler()
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

    return (
        <Modal
            backdrop={'static'}
            backdropClassName={isDarkMode ? 'bg-dark': ''}
            contentClassName={isDarkMode ? 'bg-dark text-white' : ''}
            keyboard={false}
            onHide={() => closeHTHModalHandler()}
            show={true}
            size={'xl'}
        >
            <Modal.Header closeButton>
                <Modal.Title className={'text-center'}> Agregar edificio </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <button className={'btn btn-general-blue d-block mx-auto my-3'}
                    style={{ width: '300px'}}
                    onClick={() => setShowComplex(true)}
                >
                    Cambiar a portero complejo
                </button>

                <Hr classes={'my-4'} />

                <Form onSubmit={submitHandler}>

                    <div className={'row d-flex align-self-center justify-content-center mt-2 mb-3'}>

                        <Form.Group
                            className={'fw-bolder m-2'}
                            style={{ width: '170px' }}
                        >
                            <Form.Label> Calle </Form.Label>
                            <Form.Control
                                type={'text'}
                                value={currentFace.street}
                                disabled
                            />
                        </Form.Group>

                        <div className={'col-auto'}>
                            <Form.Group
                                className={'fw-bolder m-2'}
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
                            {numberOfNumbers > 1 && <>
                                <Form.Group
                                    className={'fw-bolder m-2'}
                                    style={{ width: '120px' }}
                                >
                                    <Form.Label> Número 2 </Form.Label>
                                    <Form.Control
                                        type={'number'}
                                        max={'100000'}
                                        min={'1'}
                                        value={streetNumber2 ? streetNumber2 : ""}
                                        onChange={e => setStreetNumber2(parseInt(e.target.value))}
                                    />
                                </Form.Group>
                                {numberOfNumbers > 2 &&
                                    <Form.Group
                                        className={'fw-bolder m-2'}
                                        style={{ width: '120px' }}
                                    >
                                        <Form.Label> Número 3 </Form.Label>
                                        <Form.Control
                                            type={'number'}
                                            max={'100000'}
                                            min={'1'}
                                            value={streetNumber3 ? streetNumber3 : ""}
                                            onChange={e => setStreetNumber3(parseInt(e.target.value))}
                                        />
                                    </Form.Group>
                                }
                            </>}
                        </div>

                        <Form.Group
                            className={'fw-bolder m-2'}
                            style={{ width: '130px' }}
                        >
                            <Form.Label> Pisos </Form.Label>
                            <Form.Select
                                className={'text-center'}
                                onChange={e => setNumberOfLevels(parseInt(e.target.value) ? parseInt(e.target.value) : 0)}
                                value={numberOfLevels === undefined || numberOfLevels === null ? "" : numberOfLevels === 0 ? 'Solo PB' : numberOfLevels}
                            >
                                {hthConfigOptions.buildingLevels.map(level =>
                                    <option key={level}> {level ? level : 'Solo PB'} </option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group
                            className={'fw-bolder m-2'}
                            style={{ width: '160px' }}
                        >
                            <Form.Label> Deptos. por piso </Form.Label>
                            <Form.Select
                                className={'text-center'}
                                style={{ width: '100px' }}
                                value={numberPerLevel ?? ""}
                                onChange={e => setNumberPerLevel(parseInt(e.target.value) ? parseInt(e.target.value) : 0)}
                            >
                                {hthConfigOptions.buildingDoorNumbers.map(doorNumber =>
                                    <option key={doorNumber}> {doorNumber} </option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <div className={`col-3 ${isMobile ? '' : 'ms-5'}`} style={{ marginTop: isMobile ? '25px' : '', width: '220px' }}>
                            <Form.Group className={'mb-2'} onClick={() => setHasCharacters(x => !x)}>
                                <Form.Check
                                    type={'checkbox'}
                                    className={'checkbox-3'}
                                    label={'Deptos. con letras'}
                                    checked={hasCharacters}
                                    onChange={() => {}}
                                />
                            </Form.Group>
                            {hasCharacters &&
                                <Form.Group className={'mb-2'} onClick={() => setHasNn(x => !x)}>
                                    <Form.Check
                                        type={'checkbox'}
                                        className={'checkbox-3'}
                                        label={'Usar la Ñ'}
                                        checked={hasNn}
                                        onChange={() => {}}
                                    />
                                </Form.Group>
                            }
                            <Form.Group className={'mb-2'} onClick={() => setHasContinuousNumbers(x => !x)}>
                                <Form.Check
                                    type={'checkbox'}
                                    className={'checkbox-3'}
                                    label={isMobile ? 'Num. de corrido' : 'Numeración de corrido'}
                                    onChange={() => {}}
                                    checked={hasContinuousNumbers}
                                />
                            </Form.Group>
                            <Form.Group className={'mb-2'} onClick={() => setHasLowLevel(x => !x)}>
                                <Form.Check
                                    type={'checkbox'}
                                    className={'checkbox-3'}
                                    label={'Sin PB'}
                                    checked={!hasLowLevel}
                                    onChange={() => {}}
                                />
                            </Form.Group>
                            <Form.Group className={'mb-2'} onClick={() => setHasManager(x => !x)}>
                                <Form.Check
                                    type={'checkbox'}
                                    className={'checkbox-3'}
                                    label={'Portería separado'}
                                    checked={hasManager}
                                    onChange={() => {}}
                                />
                            </Form.Group>
                            <Form.Group className={'mb-2'} onClick={() => setReverseOrderY(x => !x)}>
                                <Form.Check
                                    type={'checkbox'}
                                    className={'checkbox-3'}
                                    label={'Invertir Vertical'}
                                    checked={reverseOrderY}
                                    onChange={() => {}}
                                />
                            </Form.Group>
                            <Form.Group className={'mb-2'} onClick={() => setReverseOrderX(x => !x)}>
                                <Form.Check
                                    type={'checkbox'}
                                    className={'checkbox-3'}
                                    label={'Invertir Horizontal'}
                                    checked={reverseOrderX}
                                    onChange={() => {}}
                                />
                            </Form.Group>
                            <div className={'mt-4'}>
                                <label className={'mb-1'}>Cantidad de números:</label>
                                <select className={'form-select'} style={{ maxWidth: '80px' }}
                                    value={numberOfNumbers}
                                    onChange={e => setNumberOfNumbers(parseInt(e.target.value))}
                                >
                                    <option value={1}> 1 </option>
                                    <option value={2}> 2 </option>
                                    <option value={3}> 3 </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={`card my-4 ${streetNumber ? '' : 'd-none'}`}>

                        <h1 className={'bg-dark text-white text-center fw-bolder mt-4 mb-2 py-2'}
                            style={{ border: isDarkMode ? '' : '1px solid lightgray', fontSize: '1.6rem' }}
                        >
                            Esquema del Edificio:
                        </h1>

                        <Hr />

                        <div style={{
                            display: 'flex',
                            flexDirection: reverseOrderY ? 'column' : 'column-reverse'
                        }}>
                            {hthConfigOptions.buildingLevels.slice(hasLowLevel ? 0 : 1, numberOfLevels + 1).map((level, index) =>
                                <div key={level}>
                                    <div className={'row d-flex justify-content-center align-self-center mb-3 mx-1'}>
                                        {hthConfigOptions.buildingDoorNumbers.slice(0, numberPerLevel)
                                         .sort((a, b) => reverseOrderX ? b - a : a - b)
                                         .map((doorNumber, index1) =>
                                            <HTHAddBuildingCheckbox key={doorNumber}
                                                doorName={getHouseholdDoorBell(
                                                    doorNumber,
                                                    index,
                                                    reverseOrderX ? numberPerLevel - index1 - 1 : index1,
                                                    hasContinuousNumbers,
                                                    hasCharacters,
                                                    numberPerLevel,
                                                    hasNn
                                                )}
                                                doorNumber={doorNumber}
                                                isManager={false}
                                                level={level}
                                            />
                                        )}
                                    </div>
                                    <Hr />
                                </div>
                            )}
                        </div>

                        {hasManager &&
                            <div className={'row d-flex justify-content-center align-self-center mb-3 mx-1'}>
                                <HTHAddBuildingCheckbox
                                    doorName={'Portería'}
                                    doorNumber={0}
                                    isManager={true}
                                    level={null}
                                />
                            </div>
                        }
                    </div>
                    
                    <Modal.Footer className={'justify-content-center align-items-center'}>
                        <Button variant={'success'} type={'submit'} style={{ height: '40px', width: '120px' }} disabled={!streetNumber}>
                            ACEPTAR
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
