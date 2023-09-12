import { addBuildingService, getHouseholdDoorBell } from '../../../services'
import { Button, Form, Modal } from 'react-bootstrap'
import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import { Hr } from '../../commons'
import { HTHAddBuildingCheckbox } from './HTHAddBuildingCheckbox'
import { hthConfigOptions } from '../../../app-config'
import { typeHTHBuilding, typeHTHHousehold, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    closeHTHModalHandler: () => void
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    setShowComplex: Dispatch<SetStateAction<boolean>>
    territoryNumber: typeTerritoryNumber
}

export const HTHAddBuildingModalComplex: FC<propsType> = ({ closeHTHModalHandler, currentFace, refreshHTHTerritoryHandler, setShowComplex, territoryNumber }) => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [hasNn, setHasNn] = useState(false)
    const [hasCharacters, setHasCharacters] = useState(true)
    const [hasContinuousNumbers, setHasContinuousNumbers] = useState(false)
    const [hasLowLevel, setHasLowLevel] = useState(true)
    const [hasManager, setHasManager] = useState(false)
    const [numberOfLevels, setNumberOfLevels] = useState<number>(4)
    const [numberPerLevel, setNumberPerLevel] = useState<number>(2)
    const [reverseOrderX, setReverseOrderX] = useState(false)
    const [reverseOrderY, setReverseOrderY] = useState(false)
    const [streetNumber, setStreetNumber] = useState(0)

    const submitHandler = (event: FormEvent<HTMLFormElement>) => {
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
            reverseOrderX,
            reverseOrderY,
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
                        <Form.Label> Pisos </Form.Label>
                        <Form.Select
                            className={'text-center'}
                            value={numberOfLevels === 0 ? 'Solo PB' : numberOfLevels}
                            onChange={e => setNumberOfLevels(parseInt(e.target.value))}
                        >
                            <option> {} </option>
                            {hthConfigOptions.buildingLevels.map(level =>
                                <option key={level}> {level ? level : 'Solo PB'} </option>
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
                                checked={hasContinuousNumbers}
                                onChange={() => {}}
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
                                label={'Agregar un Portería'}
                                checked={hasManager}
                                onChange={() => {}}
                            />
                        </Form.Group>
                        <Form.Group className={'mb-2'} onClick={() => setReverseOrderY(x => !x)}>
                            <Form.Check
                                type={'checkbox'}
                                className={'checkbox-3'}
                                label={'Invertir Verticalmente'}
                                checked={reverseOrderY}
                                onChange={() => {}}
                            />
                        </Form.Group>
                    </div>
                </div>

                <div className={`card my-4 ${streetNumber ? '' : 'd-none'}`}>

                    <h1 className={'bg-dark text-white text-center font-weight-bolder mt-4 mb-2 py-2'}
                        style={{ border: isDarkMode ? '' : '1px solid lightgray', fontSize: '1.6rem' }}
                    >
                        Esquema del Edificio:
                    </h1>

                    <Hr />

                    <div style={{ display: 'flex', flexDirection: reverseOrderY ? 'column' : 'column-reverse' }}>
                        {hthConfigOptions.buildingLevels.slice(hasLowLevel ? 0 : 1, numberOfLevels + 1).map((level, index) =>
                            <div key={level}>
                                <div className={'row d-flex justify-content-center align-self-center mb-3 mx-1'}>
                                    {hthConfigOptions.buildingDoorNumbers.slice(0, numberPerLevel).map((doorNumber, index1) =>
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
                    </div>

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
                    <Button variant={'success'} type={'submit'} style={{ height: '40px', width: '120px' }} disabled={!streetNumber}>
                        ACEPTAR
                    </Button>
                    <Button variant={'secondary'} style={{ height: '40px', width: '120px' }} onClick={() => closeHTHModalHandler()}>
                        CANCELAR
                    </Button>
                </Modal.Footer>

            </Form>
        </Modal.Body>
    )
}
