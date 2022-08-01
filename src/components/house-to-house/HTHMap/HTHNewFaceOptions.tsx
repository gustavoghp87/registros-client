import { useEffect, useState } from 'react'
import { Container, Dropdown, FloatingLabel, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { getHTHStreetsByTerritoryService } from '../../../services'
import { typeAppDispatch, typeBlock, typeFace, typeHTHTerritory, typeRootState } from '../../../models'

export const HTHNewFaceOptions = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const addFaceHandler: Function = props.addFaceHandler
    const territoryHTH: typeHTHTerritory = props.territoryHTH
    const [blocks, setBlocks] = useState<typeBlock[]>(['1', '2', '3', '4', '5', '6'])
    const [faces, setFaces] = useState<typeFace[]>(['A', 'B', 'C', 'D', 'E', 'F'])
    const [selectedBlock, setSelectedBlock] = useState<typeBlock>()
    const [selectedFace, setSelectedFace] = useState<typeFace>()
    const [selectedStreet, setSelectedStreet] = useState<string>()
    const [selectedStreetPrev, setSelectedStreetPrev] = useState<string>()
    const [showBlockMenu, setShowBlockMenu] = useState<boolean>(true)
    const [showFaceMenu, setShowFaceMenu] = useState<boolean>(false)
    const [showStreetMenu, setShowStreetMenu] = useState<boolean>(false)
    const [streets, setStreets] = useState<string[]>()

    const selectBlockHandler = (block: typeBlock): void => {
        setSelectedBlock(block)
        setShowFaceMenu(true)
    }

    const selectFaceHandler = (face: typeFace): void => {
        setSelectedFace(face)
        setShowStreetMenu(true)
    }

    const selectStreetHandler = (street: string): void => {
        setSelectedStreet(street)
    }

    const cancelHandler = (showBlock: boolean): void => {
        setBlocks(['1', '2', '3', '4', '5', '6'])
        setFaces(['A', 'B', 'C', 'D', 'E', 'F'])
        setSelectedBlock(undefined)
        setSelectedFace(undefined)
        setSelectedStreet(undefined)
        setShowBlockMenu(showBlock)
        setShowFaceMenu(false)
        setShowStreetMenu(false)
    }

    const acceptHandler = (): void => {
        addFaceHandler(selectedBlock, selectedFace, selectedStreet)
        cancelHandler(false)
    }

    useEffect(() => {
        let newFaces: typeFace[] = ['A', 'B', 'C', 'D', 'E', 'F']
        if (selectedBlock) {
            territoryHTH.map.polygons.forEach(x => {
                if (x.block === selectedBlock) newFaces = newFaces.filter(y => y !== x.face)
            })
            setFaces(newFaces)
        }
    }, [selectedBlock, territoryHTH.map.polygons])
    
    useEffect(() => {
        getHTHStreetsByTerritoryService(territoryHTH.territory).then((streets0: string[]|null) => {
            if (!streets0 || !streets0.length) return
            if (territoryHTH.streets) territoryHTH.streets.forEach(x => {
                if (!streets0.includes(x)) streets0.push(x)
            })
            setStreets(streets0)
        })
    }, [territoryHTH.streets, territoryHTH.territory])
    

    useEffect(() => {
        if (!selectedBlock || !selectedFace || !selectedStreet || selectedStreet === "other") return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title: 'Agregando Cara',
            message: `Se va a agregar la Cara ${selectedFace} en la calle ${selectedStreet} de la Manzana ${selectedBlock} del territorio ${territoryHTH.territory}. Si hay un error, cancelar abajo.`
        }))
        acceptHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBlock, selectedFace, selectedStreet, territoryHTH.territory, dispatch])
    
    
    return (<>
    <br/>
        <div className={'d-flex justify-content-center my-4'}>
            {!selectedBlock && showBlockMenu &&
                <Dropdown className={'d-inline'}>
                    <Dropdown.Toggle variant={'danger'}>
                        {selectedBlock ? `Manzana ${selectedBlock}` : "Seleccionar la Manzana"} &nbsp;
                    </Dropdown.Toggle>
                    <Dropdown.Menu show={showBlockMenu}>
                        <Dropdown.Header> Seleccionar la Manzana </Dropdown.Header>
                        {blocks && !!blocks.length && blocks.map((block: typeBlock) => (
                            <Dropdown.Item key={block} eventKey={block} onClick={() => selectBlockHandler(block)}>
                                {`Manzana ${block}`}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            }
            {!selectedFace && showFaceMenu &&
                <Dropdown className={'d-inline'}>
                    <Dropdown.Toggle variant={'danger'}>
                        {selectedFace ? `==> Cara ${selectedFace}` : "Seleccionar la Cara"} &nbsp;
                    </Dropdown.Toggle>
                    <Dropdown.Menu show={showFaceMenu}>
                        <Dropdown.Header> Seleccionar la Cara </Dropdown.Header>
                        {faces && !!faces.length && faces.map((face: typeFace) => (
                            <Dropdown.Item key={face} eventKey={face} onClick={() => selectFaceHandler(face)}>
                                Cara {face}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            }
            {!selectedStreet && showStreetMenu &&
                <Dropdown className={'d-inline'}>
                    <Dropdown.Toggle variant={'danger'}>
                        {selectedStreet ? `==> Calle ${selectedStreet}` : "Seleccionar la Calle"} &nbsp;
                    </Dropdown.Toggle>
                    <Dropdown.Menu show={showStreetMenu}>
                        <Dropdown.Header> Seleccionar la calle </Dropdown.Header>
                        {streets && !!streets.length && streets.map((street: string) => (
                            <Dropdown.Item key={street} eventKey={street} onClick={() => selectStreetHandler(street)}>
                                Calle {street}
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Divider />
                        <Dropdown.Item key={'other'} eventKey={'other'} onClick={() => selectStreetHandler('other')}>
                            Otra...
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
            <button className={'btn btn-secondary btn-size12 d-inline ms-4'} onClick={() => cancelHandler(true)}>
                &nbsp;&nbsp; Limpiar &nbsp; &nbsp;
            </button>
        </div>
        
        {selectedStreet?.trim() === 'other' &&
            <Container style={{ width: '300px', marginTop: '50px' }}>
                <h3 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                    Nombre de la calle:
                </h3>
                <FloatingLabel
                    label={"Nombre de la calle"}
                    className={'mb-3'}
                >
                    <Form.Control type={'text'} placeholder={" "} onChange={(event: any) => setSelectedStreetPrev(event.target.value)} />
                </FloatingLabel>
                <button className={'btn btn-general-red btn-size12 w-100'}
                    onClick={() => setSelectedStreet(selectedStreetPrev)}
                >
                    Aceptar
                </button>
            </Container>
        }

        {selectedBlock && selectedFace && selectedStreet && selectedStreet !== 'other' &&
            <h2 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                Agregando Manzana {selectedBlock} Cara {selectedFace} Calle {selectedStreet}
            </h2>
        }

    </>)
}
