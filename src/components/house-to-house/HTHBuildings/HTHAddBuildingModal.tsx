import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Form, Modal, Card } from 'react-bootstrap'
import { Hr } from '../../commons'
import { HTHBuildingCheckbox } from '..'
import { addBuildingService, getHouseholdDoorBell } from '../../../services'
import { typeHTHBuilding, typeHTHHousehold, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'

export const HTHAddBuildingModal = (props: any) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const closeHTHModalHandler: any = props.closeHTHModalHandler
    const currentFace: typePolygon = props.currentFace
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territoryNumber: typeTerritoryNumber = props.territoryNumber
    const [numberOfLevels, setNumberOfLevels] = useState<number>(4)
    const [numberPerLevel, setNumberPerLevel] = useState<number>(2)
    const [hasCharacters, setHasCharacters] = useState<boolean>(true)
    const [hasContinuousNumbers, setHasContinuousNumbers] = useState<boolean>(false)
    const [hasLowLevel, setHasLowLevel] = useState<boolean>(true)
    const [streetNumber, setStreetNumber] = useState<number>(0)
    const levels: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]
    const doorNames: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

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
            hasCharacters,
            hasContinuousNumbers,
            hasLowLevel,
            households,
            numberOfLevels,
            numberPerLevel,
            streetNumber
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
                                disabled
                                type={'text'}
                                value={currentFace.street}
                            />
                        </Form.Group>

                        <Form.Group
                            className={'font-weight-bolder m-2'}
                            style={{ width: '120px' }}
                        >
                            <Form.Label> Número </Form.Label>
                            <Form.Control
                                max={'100000'}
                                min={'1'}
                                onChange={(event: any) => setStreetNumber(parseInt(event.target.value))}
                                onInput={() => "event.target.value = event.target.value.replace(/[^0-9]*/g,'');"}
                                onKeyPress={(event: any) => {
                                    if (event.key === '.' || event.key === ',') event.preventDefault()
                                }}
                                step={1}
                                type={'number'}
                                value={streetNumber !== undefined && !isNaN(streetNumber) && streetNumber !== 0 ? streetNumber : ""}
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
                            <Form.Group className={'mb-2'} onClick={() => setHasContinuousNumbers(x => !x)}>
                                <Form.Check
                                    checked={hasContinuousNumbers}
                                    className={'checkbox-3'}
                                    label={'Numeración de corrido'}
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
                        </div>
                    </div>

                    <Card className={'my-4'}>

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
                                        <HTHBuildingCheckbox
                                            doorName={getHouseholdDoorBell(doorNumber, index, index1, hasContinuousNumbers, hasCharacters, numberPerLevel)}
                                            doorNumber={doorNumber}
                                            key={doorNumber}
                                            level={level}
                                        />
                                    )}
                                </div>
                                <Hr />
                            </div>
                        )}
                    </Card>
                    
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
