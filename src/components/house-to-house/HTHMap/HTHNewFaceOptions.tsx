import { Dropdown } from 'react-bootstrap'
import { getHTHStreetsByTerritoryService, getStreetsByHTHTerritory } from '../../../services'
import { hthConfigOptions } from '../../../app-config'
import { HTHNewFaceOptionsStreet } from './HTHNewFaceOptionsStreet'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeBlock, typeFace, typeHTHTerritory, typeRootState } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

type propsType = {
    initFaceAddingHandler: (selectedBlock: typeBlock|null, selectedFace: typeFace|null, selectedStreet: string|null) => void
    show: boolean
    territoryHTH: typeHTHTerritory
}

export const HTHNewFaceOptions = ({ initFaceAddingHandler, show, territoryHTH }: propsType) => {
    const [blocks, setBlocks] = useState<typeBlock[]>(hthConfigOptions.blockOptions)
    const [faces, setFaces] = useState<typeFace[]>(hthConfigOptions.facesOptions)
    const [selectedBlock, setSelectedBlock] = useState<typeBlock>()
    const [selectedFace, setSelectedFace] = useState<typeFace>()
    const [selectedStreet, setSelectedStreet] = useState('')
    const [showBlockMenu, setShowBlockMenu] = useState(true)
    const [showFaceMenu, setShowFaceMenu] = useState(false)
    const [showStreetMenu, setShowStreetMenu] = useState(false)
    const [streets, setStreets] = useState<string[]>()
    const dispatch = useDispatch()
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)

    const selectBlockHandler = (block: typeBlock): void => {
        setSelectedBlock(block)
        setShowFaceMenu(true)
    }

    const selectFaceHandler = (face: typeFace): void => {
        setSelectedFace(face)
        setShowStreetMenu(true)
    }

    const cancelHandler = (showBlock: boolean): void => {
        setBlocks(hthConfigOptions.blockOptions)
        setFaces(hthConfigOptions.facesOptions)
        setSelectedBlock(undefined)
        setSelectedFace(undefined)
        setShowBlockMenu(showBlock)
        setShowFaceMenu(false)
        setShowStreetMenu(false)
    }

    useEffect(() => {
        let newFaces: typeFace[] = [...hthConfigOptions.facesOptions]
        if (selectedBlock) {
            territoryHTH.map.polygons.forEach(x => {
                if (x.block === selectedBlock) newFaces = newFaces.filter(y => y !== x.face)
            })
            setFaces(newFaces)
        }
    }, [selectedBlock, territoryHTH.map.polygons])
    
    useEffect(() => {
        const streets000: string[] = []
        const streets111: string[] = getStreetsByHTHTerritory(territoryHTH)
        streets111.forEach(x => streets000.push(x))
        getHTHStreetsByTerritoryService(territoryHTH.territoryNumber).then((streets0: string[]|null) => {
            if (streets0 && streets0.length) streets0.forEach(x => {
                if (!streets000.includes(x)) streets000.push(x)
            })
            setStreets(streets000)
        })
    }, [territoryHTH])

    useEffect(() => {
        if (!selectedBlock || !selectedFace || !selectedStreet || selectedStreet === "other") return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title: 'Agregando Cara',
            message: `Se va a agregar la Cara ${selectedFace} en la calle ${selectedStreet} de la Manzana ${selectedBlock} del territorio ${territoryHTH.territoryNumber}. Si hay un error, cancelar abajo.`
        }))
        initFaceAddingHandler(selectedBlock, selectedFace, selectedStreet)
    }, [dispatch, selectedBlock, selectedFace, selectedStreet, territoryHTH.territoryNumber])

    return (<>
        <br/>
        {show &&
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
                                <Dropdown.Item key={street} eventKey={street} onClick={() => setSelectedStreet(street)}>
                                    Calle {street}
                                </Dropdown.Item>
                            ))}
                            <Dropdown.Divider />
                            <Dropdown.Item key={'other'} eventKey={'other'} onClick={() => setSelectedStreet('other')}>
                                Otra...
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                }
                <button className={'btn btn-secondary btn-size12 d-inline ms-4'} onClick={() => cancelHandler(true)}>
                    &nbsp;&nbsp; Limpiar &nbsp; &nbsp;
                </button>
            </div>
        }
        
        {selectedStreet?.trim() === 'other' &&
            <HTHNewFaceOptionsStreet
                setSelectedStreet={setSelectedStreet}
            />
        }

        {!!selectedBlock && !!selectedFace && !!selectedStreet && selectedStreet !== 'other' &&
            <h2 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                Agregando Manzana {selectedBlock} Cara {selectedFace} Calle {selectedStreet}
            </h2>
        }

    </>)
}
