import { addBuildingService, getHouseholdDoorBell } from '../../../services'
import { Button, Form, Modal } from 'react-bootstrap'
import { FC, useState } from 'react'
import { Hr } from '../../commons'
import { HTHAddBuildingCheckbox } from './HTHAddBuildingCheckbox'
import { typeHTHBuilding, typeHTHHousehold, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    closeHTHModalHandler: () => void
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHAddBuildingModal: FC<propsType> = ({ closeHTHModalHandler, currentFace, refreshHTHTerritoryHandler, territoryNumber }) => {
    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const [hasNn, setHasNn] = useState(false)
    const [hasCharacters, setHasCharacters] = useState(true)
    const [hasContinuousNumbers, setHasContinuousNumbers] = useState(false)
    const [hasLowLevel, setHasLowLevel] = useState(true)
    const [hasManager, setHasManager] = useState(false)
    const [numberOfLevels, setNumberOfLevels] = useState<number>(4)
    const [numberPerLevel, setNumberPerLevel] = useState<number>(2)
    const [streetNumber, setStreetNumber] = useState(0)
    const doorNames: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    const levels: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]

    const submitHandler = (event: any): void => {
        event.preventDefault()
        const households: typeHTHHousehold[] = []
        const x = [...document.getElementsByClassName('hthBuildingCheckboxInput')] as HTMLInputElement[]
        x.forEach(y => {
            const newHousehold: typeHTHHousehold = JSON.parse(y.value)
            if (newHousehold && newHousehold.isChecked) households.push(newHousehold)
        })
        if (!territoryNumber || !currentFace.street || !streetNumber || !households || !households.length) {
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
            numberOfLevels,
            numberPerLevel,
            streetNumber
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
            if (!response) return alert("Error: Falló algo")
            if (!response.success && response.dataError) return alert("Falló algo en los datos")
            if (!response.success && response.alreadyExists) return alert("Este edificio ya existe o hay otro con el mismo número")
            if (!response.success) return alert("Algo falló")
            closeHTHModalHandler()
            refreshHTHTerritoryHandler()
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
                                value={streetNumber !== undefined && !isNaN(streetNumber) && streetNumber !== 0 ? streetNumber : ""}
                                onChange={(event: any) => setStreetNumber(parseInt(event.target.value))}
                                onInput={() => "event.target.value = event.target.value.replace(/[^0-9]*/g,'');"}
                                onKeyPress={(event: any) => {
                                    if (event.key === '.' || event.key === ',') event.preventDefault()
                                }}
                                step={1}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group
                            className={'font-weight-bolder m-2'}
                            style={{ width: '130px' }}
                        >
                            <Form.Label> Pisos </Form.Label>
                            <Form.Select
                                className={'text-center'}
                                onChange={(event: any) => setNumberOfLevels(isNaN(event.target.value) ? 0 : parseInt(event.target.value))}
                                value={numberOfLevels === undefined || numberOfLevels === null ? "" : numberOfLevels === 0 ? 'Solo PB' : numberOfLevels}
                            >
                                <option> {} </option>
                                {levels.map((currentLevel: number) =>
                                    <option key={currentLevel}> {currentLevel ? currentLevel : 'Solo PB'} </option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group
                            className={'font-weight-bolder m-2'}
                            style={{ width: '160px' }}
                        >
                            <Form.Label> Deptos. por piso </Form.Label>
                            <Form.Select
                                className={'text-center'}
                                onChange={(event: any) => setNumberPerLevel(isNaN(event.target.value) ? 0 : parseInt(event.target.value))}
                                style={{ width: '100px' }}
                                value={numberPerLevel ?? ""}
                            >
                                <option> {} </option>
                                {!!doorNames.length && doorNames.map((doorName: number) =>
                                    <option key={doorName}> {doorName} </option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <div className={`col-3 ${isMobile ? '' : 'ms-5'}`} style={{ marginTop: isMobile ? '25px' : '', width: '220px' }}>
                            <Form.Group className={'mb-2'} onClick={() => setHasCharacters(x => !x)}>
                                <Form.Check
                                    checked={hasCharacters}
                                    className={'checkbox-3'}
                                    label={'Deptos. con letras'}
                                    onChange={() => {}}
                                    type={'checkbox'}
                                />
                            </Form.Group>
                            {hasCharacters &&
                                <Form.Group className={'mb-2'} onClick={() => setHasNn(x => !x)}>
                                    <Form.Check
                                        checked={hasNn}
                                        className={'checkbox-3'}
                                        label={'Usar la Ñ'}
                                        onChange={() => {}}
                                        type={'checkbox'}
                                    />
                                </Form.Group>
                            }
                            <Form.Group className={'mb-2'} onClick={() => setHasContinuousNumbers(x => !x)}>
                                <Form.Check
                                    checked={hasContinuousNumbers}
                                    className={'checkbox-3'}
                                    label={isMobile ? 'Num. de corrido' : 'Numeración de corrido'}
                                    onChange={() => {}}
                                    type={'checkbox'}
                                />
                            </Form.Group>
                            <Form.Group className={'mb-2'} onClick={() => setHasLowLevel(x => !x)}>
                                <Form.Check
                                    checked={!hasLowLevel}
                                    className={'checkbox-3'}
                                    label={'Sin PB'}
                                    onChange={() => {}}
                                    type={'checkbox'}
                                />
                            </Form.Group>
                            <Form.Group className={'mb-2'} onClick={() => setHasManager(x => !x)}>
                                <Form.Check
                                    checked={hasManager}
                                    className={'checkbox-3'}
                                    label={'Agregar un Portería'}
                                    onChange={() => {}}
                                    type={'checkbox'}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <div className={'card my-4'}>

                        <h1 className={'bg-dark text-white text-center font-weight-bolder mt-4 mb-2 py-2'}
                            style={{ border: isDarkMode ? '' : '1px solid lightgray', fontSize: '1.6rem' }}
                        >
                            Esquema del Edificio:
                        </h1>

                        <Hr />

                        {[...levels].slice(hasLowLevel ? 0 : 1, numberOfLevels + 1).map((level: number, index: number) =>
                            <div key={level}>
                                <div className={'row d-flex justify-content-center align-self-center mb-3 mx-1'}>
                                    {[...doorNames].slice(0, numberPerLevel).map((doorNumber: number, index1: number) =>
                                        <HTHAddBuildingCheckbox key={doorNumber}
                                            doorName={getHouseholdDoorBell(doorNumber, index, index1, hasContinuousNumbers, hasCharacters, numberPerLevel, hasNn)}
                                            doorNumber={doorNumber}
                                            level={level}
                                            isManager={false}
                                        />
                                    )}
                                </div>
                                <Hr />
                            </div>
                        )}

                        {hasManager &&
                            <div className={'row d-flex justify-content-center align-self-center mb-3 mx-1'}>
                                <HTHAddBuildingCheckbox
                                    doorName={'Portería'}
                                    doorNumber={0}
                                    level={null}
                                    isManager={true}
                                />
                            </div>
                        }
                    </div>
                    
                    <Modal.Footer className={'justify-content-center align-items-center'}>
                        <Button variant={'success'} type={'submit'} style={{ height: '40px', width: '120px' }}>
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
