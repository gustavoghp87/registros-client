import { addHTHPolygonFaceService, getHTHStreetsByTerritoryService, getStreetsByHTHTerritory, maskTheBlock, maskTheFace } from '../../../services'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { H2, Hr } from '../../commons'
import { hthConfigOptions } from '../../../app-config'
import { HTHNewFaceOptionsStreet } from '..'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeBlock, typeFace, typeHTHTerritory, typePolygon, typeRootState } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'

type typeColor = 'green' | 'red' | 'blue' | 'yellow'

const colors: typeColor[] = ['green', 'red', 'blue', 'yellow']

type typeOption = {
    color: typeColor
    face: typeFace|null
    street: string
}

type propsType = {
    initBlockAddingHandler: (block: typeBlock) => void
    isCompletingNewBlock: boolean
    setRunIntervals: Dispatch<SetStateAction<boolean>>
    setTerritoryHTH: Dispatch<SetStateAction<typeHTHTerritory|null>>
    territoryHTH: typeHTHTerritory
}

export const HTHNewBlockOptions: FC<propsType> = ({
    initBlockAddingHandler, isCompletingNewBlock, setRunIntervals, territoryHTH
}) => {
    const { config, isDarkMode } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode
    }))
    const usedBlocks = [...new Set(territoryHTH.map.polygons.map(x => x.block))]
    const [options, setOptions] = useState<typeOption[]>([
        { color: 'yellow', face: null, street: '' },
        { color: 'blue', face: null, street: '' },
        { color: 'red', face: null, street: '' },
        { color: 'green', face: null, street: '' }
    ])
    const [streets, setStreets] = useState<string[]>([])
    const dispatch = useDispatch()

    const selectBlockHandler = (block: typeBlock) => {
        setRunIntervals(true)
        initBlockAddingHandler(block)
    }

    const setOptionsHandler = (color: typeColor, face: typeFace, street: string) => {
        if (!color || !face || !street) return
        setOptions(ops => ops.map(o => o.color === color ?
            ({ color, face, street })
            :
            o
        ))
    }

    const createNewFacesHandler = () => {
        const block = territoryHTH.map.polygons.find(x => x.face === 'x')?.block
        if (!block) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Confirmar",
            message: `Se van a agregar estas 4 caras correspondientes a la manzana ${maskTheBlock(block, config.usingLettersForBlocks)}`,
            execution: () => {
                let success = true
                options.forEach(async o => {
                    const np = territoryHTH.map.polygons.find(p => p.face === 'x' && p.color === o.color)
                    if (!np || !o.face || !o.street) return
                    const newPolygon: typePolygon = {
                        ...np,
                        face: o.face,
                        street: o.street
                    }
                    delete newPolygon.color
                    const success1 = await addHTHPolygonFaceService(territoryHTH.territoryNumber, newPolygon)
                    if (!success1) {
                        success = false
                    }
                })
                if (!success) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Algo falló",
                        message: "",
                        animation: 2
                    }))
                    return
                }
                window.location.reload()
            }
        }))
    }

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

    return (
        <div className={`container pb-5 ${isDarkMode ? 'bg-dark' : ''}`}>
            {!territoryHTH.map.newBlockPolygon && !isCompletingNewBlock && <>
                <h2 className={'text-center my-5'}> Seleccionar la cara que se va a agregar: </h2>
                <Dropdown className={'d-block m-auto text-center mb-5'}>
                    <Dropdown.Toggle variant={'danger'} className={'text-center'}>
                        Seleccionar la Manzana que se va a agregar &nbsp;
                    </Dropdown.Toggle>
                    <Dropdown.Menu show={true} className={'text-center'}>
                        <Dropdown.Header> Seleccionar la letra </Dropdown.Header>
                        {hthConfigOptions.blocks.filter(x => !usedBlocks.includes(x)).map(b =>
                            <Dropdown.Item key={b} onClick={() => selectBlockHandler(b)}>
                                Manzana {maskTheBlock(b, config.usingLettersForBlocks)}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </>}

            {isCompletingNewBlock && <>
                <H2 title={`COMPLETAR MANZANA NUEVA ${maskTheBlock(territoryHTH.map.polygons.find(x => x.face === 'x')?.block || '1', config.usingLettersForBlocks)}`} />

                {colors.map(c =>
                    <NewBlockOption key={c}
                        color={c}
                        setOptionsHandler={setOptionsHandler}
                        streets={streets}
                        territoryHTH={territoryHTH}
                    />
                )}

                <button className={'btn btn-general-blue d-block mx-auto mt-4 py-2'}
                    style={{ width: '400px' }}
                    onClick={() => createNewFacesHandler()}
                    disabled={!!options.filter(o => !o.face || !o.street)?.length
                        || new Set(options.map(o => o['face'])).size !== options.map(o => o['face']).length
                        || new Set(options.map(o => o['street'])).size !== options.map(o => o['street']).length
                    }
                >
                    ACEPTAR
                </button>
            </>}
            
        </div>
    )
}

type propsType1 = {
    color: typeColor
    setOptionsHandler: (color: typeColor, face: typeFace, street: string) => void
    streets: string[]
    territoryHTH: typeHTHTerritory
}

const NewBlockOption: FC<propsType1> = ({ color, setOptionsHandler, streets }) => {
    const { config, isDarkMode } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode
    }))
    const [face, setFace] = useState<typeFace|null>(null)
    const [street, setStreet] = useState("")

    const translateColor = (color: typeColor) => {
        if (color === 'blue') return 'Azul'
        if (color === 'green') return 'Verde'
        if (color === 'red') return 'Rojo'
        if (color === 'yellow') return 'Amarillo'
    }

    useEffect(() => {
        if (!face || !street) return
        setOptionsHandler(color, face, street)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color, face, street])

    return (
        <div className={'container my-5'} style={{ maxWidth: '600px' }}>
            <h3 className={`mb-3 ${isDarkMode ? 'text-white' : ''}`}>
                Cara {translateColor(color)}: {face ? `cara ${maskTheFace(face, config.usingLettersForBlocks)}` : ''} {street ? `, calle ${street}` : ''}
            </h3>
            <Dropdown className={'d-inline me-3'}>
                <Dropdown.Toggle
                    variant={color === 'red' ? 'danger' : color === 'blue' ? 'primary' : color === 'yellow' ? 'warning' : 'success'}
                >
                    {face ? `==> Cara ${maskTheFace(face, config.usingLettersForBlocks)}` : `Seleccionar la letra de la cara ${translateColor(color)}`} &nbsp;
                </Dropdown.Toggle>
                <Dropdown.Menu show={false}>
                    <Dropdown.Header> Seleccionar la letra </Dropdown.Header>
                    {hthConfigOptions.faces.map(face =>
                        <Dropdown.Item key={face} eventKey={face} onClick={() => setFace(face)}>
                            Cara {maskTheFace(face, config.usingLettersForBlocks)}
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            {face &&
                <Dropdown className={'d-inline'}>
                    <Dropdown.Toggle variant={color === 'red' ? 'danger' : color === 'blue' ? 'primary' : color === 'yellow' ? 'warning' : 'success'}>
                        {street ? `==> Calle ${street === 'other' ? '' : street}` : "Seleccionar la Calle"} &nbsp;
                    </Dropdown.Toggle>
                    <Dropdown.Menu show={false}>
                        <Dropdown.Header> Seleccionar la calle </Dropdown.Header>
                        {!!streets?.length && streets.map(s =>
                            <Dropdown.Item key={s} eventKey={s} onClick={() => setStreet(s)}>
                                Calle {s}
                            </Dropdown.Item>
                        )}
                        <Dropdown.Divider />
                        <Dropdown.Item key={'other'} eventKey={'other'} onClick={() => setStreet('other')}>
                            Otra...
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }

            {street === 'other' &&
                <HTHNewFaceOptionsStreet
                    setSelectedStreet={setStreet}
                />
            }

            <Hr classes={'mt-5'} />
        </div>
    )
}
