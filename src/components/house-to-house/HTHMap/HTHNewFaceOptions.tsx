import { useEffect, useState } from "react"
import { Dropdown } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { typeFace } from "../../../models/houseToHouse"
import { danger, typeBlock, typeTerritoryNumber } from "../../../models/territory"
import { setValuesAndOpenAlertModalReducer } from "../../../store/AlertModalSlice"
import { typeAppDispatch, typeRootState } from "../../../store/store"

export const HTHNewFaceOptions = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const dispatch: typeAppDispatch = useDispatch()
    const addFaceHandler: Function = props.addFaceHandler
    const blocks: typeBlock[] = props.blocks
    const faces: typeFace[] = ['A', 'B', 'C', 'D', 'E', 'F']
    const territory: typeTerritoryNumber = props.territory
    const [selectedBlock, setSelectedBlock] = useState<typeBlock>()
    const [selectedFace, setSelectedFace] = useState<typeFace>()
    const [showFaceMenu, setShowFaceMenu] = useState<boolean>(false)

    const selectBlockHandler = (block: typeBlock): void => {
        setSelectedBlock(block)
        setShowFaceMenu(true)
    }

    const selectFaceHandler = (face: typeFace): void => {
        setSelectedFace(face)
    }
    
    useEffect(() => {
        if (!selectedBlock || !selectedFace) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title: 'Agregando Cara',
            message: `Se va a agregar la Cara ${selectedFace} en la Manzana ${selectedBlock} del territorio ${territory}. Si hay un error, cancelar.`
        }))
        addFaceHandler(selectedBlock, selectedFace)
    }, [selectedBlock, selectedFace])
    
    
    return (
        <div className={'d-flex justify-content-center mt-4'}>
            {!selectedBlock &&
                <Dropdown className={'d-inline mr-2'}>
                    <Dropdown.Toggle variant={danger}>
                        {selectedBlock ? `Manzana ${selectedBlock}` : "Seleccionar la Manzana"} &nbsp;
                    </Dropdown.Toggle>
                    <Dropdown.Menu show>
                        <Dropdown.Header> Seleccionar la Manzana </Dropdown.Header>
                        {blocks && !!blocks.length && blocks.map((block: typeBlock) => (
                            <Dropdown.Item key={block} eventKey={block} onClick={() => selectBlockHandler(block)}>
                                {`Manzana ${block}`}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            }
            {!selectedFace &&
                <Dropdown className={'d-inline ml-2'}>
                    <Dropdown.Toggle variant={danger}>
                        {selectedFace ? `==> Cara ${selectedFace}` : "Seleccionar la Cara"} &nbsp;
                    </Dropdown.Toggle>
                    <Dropdown.Menu show={showFaceMenu}>
                        <Dropdown.Header> Seleccionar la Cara </Dropdown.Header>
                        {faces && !!faces.length && faces.map((face: typeFace) => (
                            <Dropdown.Item key={face} eventKey={face} onClick={() => selectFaceHandler(face)}>
                                {`Cara ${face}`}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            }
            {selectedBlock && selectedFace &&
                <h2 className={isDarkMode ? 'text-white' : ''}> Agregando Manzana {selectedBlock} Cara {selectedFace} </h2>
            }
        </div>
    )
}
