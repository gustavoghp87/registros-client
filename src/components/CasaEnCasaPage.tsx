import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { typeRootState } from '../store/store'
import { Loading } from './commons/Loading'
import { useAuth } from '../context/authContext'
import { H2 } from './css/css'
import { typeUser } from '../models/user'
import { generalBlue } from './_App'
import { NoTocar, typeNoTocar } from './house-to-house/NoTocarHTH'
import { ObservacionesHTH, typeObservacion } from './house-to-house/ObservacionesHTH'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { Button, Card, Nav } from 'react-bootstrap'

export type typeHTHTerritory = {
    noTocar: typeNoTocar[]
    observaciones: typeObservacion[]
}

export const CasaEnCasaPage = () => {
    
    const { territory } = useParams<any>()
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const user: typeUser|undefined = useAuth().user
    const [loading, setLoading] = useState<boolean>(true)
    const [territoryHTH, setTerritoryHTH] = useState<typeHTHTerritory>();
    const [block, setBlock] = useState<string>('')
    const [blocks, setBlocks] = useState<string[]>([''])
    const [face, setFace] = useState<string>('')
    const [wholeTerritory, setWholeTerritory] = useState<boolean>(true)
    const [imageSrc, setImageSrc] = useState<string>(isMobile ? `/img/img-hth/${territory}v00.png` : `/img/img-hth/${territory}h00.png`)

    useEffect(() => {
        if (user && !user.isAdmin) window.location.href = "/"
        setBlocks(['1', '2', '3'])
        setTerritoryHTH({
            noTocar: [
                { direccion: 'Directorio 123', block: '1', face: 'A', date: '2022-06-12', id: '1' },
                { direccion: 'Directorio 456', block: '1', face: 'A', date: '2022-06-11', id: '2' },
                { direccion: 'Directorio 789', block: '1', face: 'B', date: '2022-06-10', id: '3' }
            ],
            observaciones: [
                { text: 'Directorio no completado 1', block: '1', face: 'A', date: '2022-06-08', id: '1' },
                { text: 'Directorio no completado 2', block: '1', face: 'A', date: '2022-06-09', id: '2' },
                { text: 'Directorio no completado 3', block: '1', face: 'B', date: '2022-06-10', id: '3' },
                { text: 'Directorio no completado 4', block: '1', face: '', date: '2022-06-11', id: '4' },
                { text: 'Directorio no completado 5', block: '', face: '', date: '2022-06-12', id: '5' }
            ]
        })
        
        if (!block) {
            if (isMobile) setImageSrc(`/img/img-hth/${territory}v00.png`)
            else setImageSrc(`/img/img-hth/${territory}h00.png`)
        }
        
        setLoading(false)
        return () => { }
    }, [isMobile, territory, block, face, loading, user])

    const blockSelection = (blockSelected: string) => {
        setBlock(blockSelected)
        setFace('')
        setWholeTerritory(false)
        if (isMobile) setImageSrc(`/img/img-hth/${territory}v00.png`)
        else setImageSrc(`/img/img-hth/${territory}h00.png`)
    }

    const selectWholeTerritory = () => {
        setWholeTerritory(true)
        setFace('')
        setBlock('')
    }

    const executeX = (e: any) => {
        const x = parseInt(e.pageX) - parseInt(e.target.offsetLeft);
        const y = parseInt(e.pageY) - parseInt(e.target.offsetTop);
        console.log("X:", x, ", Y:", y);
    }

    const setBlockAndFaceHandler = (selectedBlock: string, selectedFace: string) => {             //     HERE      <---------------------
        setBlock(selectedBlock)
        setFace(selectedFace)
        setWholeTerritory(false)
        setImageSrc(`/img/img-hth/${territory}${isMobile ? 'v' : 'h'}${selectedBlock}${selectedFace}.png`)
    }
    
    const changeImageSrc = (selectedBlock: string = "0", selectedFace: string = "0") => {
        if (face !== '') return
        setImageSrc(`/img/img-hth/${territory}${isMobile ? 'v' : 'h'}${selectedBlock}${selectedFace}.png`)
    }

    
    


    const imagesStyle = {
        border: '1px solid black',
        borderRadius: '8px',
        display: 'block',
        height: 'auto',
        margin: '60px auto',
        padding: 0,
        width: isMobile ? '280px' : '800px'
    }


    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ fontSize: isMobile ? '2.7rem' : '' }}>
            CASA EN CASA
        </H2>

        <h1 className={`text-center mt-4 ${isDarkMode ? 'text-white' : ''}`} style={{ fontWeight: 'bolder' }}>
            SELECCIONAR CARA DE MANZANA
        </h1>

        <img id={"imgx"} alt={'map'} useMap={"#workmap"}
            src={imageSrc}
            style={ imagesStyle }
            onClick={(e) => executeX(e)}
        />

        <button className={`btn ${wholeTerritory ? 'btn-general-blue' : 'btn-dark'} mt-2 mb-4 d-block mx-auto py-3`}
            style={{ width: isMobile ? '220px' : '420px' }}
            onClick={() => selectWholeTerritory()}>
                Todo el Territorio {territory}
        </button>

        {blocks && !!blocks.length &&
            <div className={'row d-flex align-items-center'} style={{ justifyContent: 'space-evenly' }}>
                {blocks.map((currentBlock: string) =>
                    <button key={currentBlock}
                        className={`btn ${block === currentBlock && face === '' ? 'btn-general-blue' : 'btn-dark'} mx-1 my-2`}
                        style={{ width: isMobile ? '120px' : '220px' }}
                        onClick={() => blockSelection(currentBlock)}
                    >
                        {`Manzana ${currentBlock}`}
                    </button>
                )}
            </div>
        }

        <Card>
            <Card.Header>
                <Nav variant="tabs" defaultActiveKey="#first">
                    <Nav.Item>
                        <Nav.Link href="#first">Manzana 1</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#block2">Manzana 2</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#block3">Manzana 3</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Card.Header>
            <Card.Body>
                <Card.Title>Special title treatment</Card.Title>
                <Card.Text>With supporting text below as a natural lead-in to additional content.</Card.Text>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>

        <map name={"workmap"}>
            {
                territory === "1" ? <>
                    <area alt=""></area>
                </> :
                territory === "2" ? <>
                    {isMobile ?
                        <>
                        <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                            coords={"135,114, 227,168, 223,55"}
                            onMouseOver={() => changeImageSrc("1", "A")}
                            onMouseLeave={() => changeImageSrc()}
                            onClick={() => setBlockAndFaceHandler("1", "A")}
                        ></area>
                        <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                            coords={"135,114, 57,169, 227,168"}
                            onMouseOver={() => changeImageSrc("1", "B")}
                            onMouseLeave={() => changeImageSrc()}
                            onClick={() => setBlockAndFaceHandler("1", "B")}
                        ></area>
                        <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                            coords={"135,114, 57,55, 57,169"}
                            onMouseOver={() => changeImageSrc("1", "C")}
                            onMouseLeave={() => changeImageSrc()}
                            onClick={() => setBlockAndFaceHandler("1", "C")}
                        ></area>
                        <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                            coords={"135,114, 57,55, 223,55"}
                            onMouseOver={() => changeImageSrc("1", "D")}
                            onMouseLeave={() => changeImageSrc()}
                            onClick={() => setBlockAndFaceHandler("1", "D")}
                        ></area>
                        </>
                        :
                        <>
                        <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                            coords={"78,77, 169,210, 251,70"}
                            onMouseOver={() => changeImageSrc("1", "A")}
                            onMouseLeave={() => changeImageSrc()}
                            onClick={() => setBlockAndFaceHandler("1", "A")}
                        ></area>
                        <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                            coords={"215,70, 169,210, 252,328"}
                            onMouseOver={() => changeImageSrc("1", "B")}
                            onMouseLeave={() => changeImageSrc()}
                            onClick={() => setBlockAndFaceHandler("1", "B")}
                        ></area>
                        <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                            coords={"252,328, 169,210, 78,328"}
                            onMouseOver={() => changeImageSrc("1", "C")}
                            onMouseLeave={() => changeImageSrc()}
                            onClick={() => setBlockAndFaceHandler("1", "C")}
                        ></area>
                        <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                            coords={"78,77, 78,328, 169,210"}
                            onMouseOver={() => changeImageSrc("1", "D")}
                            onMouseLeave={() => changeImageSrc()}
                            onClick={() => setBlockAndFaceHandler("1", "D")}
                        ></area>
                        </>}
                </> :
                territory === "3" ? <>
                    <area></area>
                </> :
                territory === "56" ? <>
                    <area></area>
                </> : <></>
            }
        </map>


        <h1 className={'text-white py-3'}
            style={{
                backgroundColor: generalBlue,
                fontSize: isMobile ? '2.3rem' : '2.8rem',
                fontWeight: 'bolder',
                margin: isMobile ? '30px auto 20px auto' : '60px auto 40px auto',
                textAlign: 'center'
            }}
        >
            <span> TERRITORIO {territory} </span>
            <br className={block ? '' : 'd-none'} />
            <span className={'mb-2'}> {block ? `MANZANA ${block}` : ''} </span>
            <br className={face ? '' : 'd-none'} />
            <span> {face ? `CARA ${face}` : ''} </span>
        </h1>

        {!block && !face &&
            <button className={'btn btn-general-blue d-block m-auto mb-4'}>
                Marcar esta TERRITORIO {territory} como terminado
            </button>
        }

        {block && !face &&
            <button className={'btn btn-general-blue d-block m-auto mb-4'}>
                Marcar esta MANZANA {block} como terminada
            </button>
        }
        
        {block && face &&
            <button className={'btn btn-general-blue d-block m-auto mb-4'}>
                Marcar esta CARA {face} de MANZANA {block} como terminada
            </button>
        }

        {territoryHTH && territoryHTH.observaciones && !!territoryHTH.observaciones.length &&
            <ObservacionesHTH
                territory={territory}
                block={block}
                face={face}
                observacionesArray={territoryHTH.observaciones}
            />
        }

        {face && territoryHTH && territoryHTH.noTocar && !!territoryHTH.noTocar.length &&
            <NoTocar
                territory={territory}
                block={block}
                face={face}
                noTocarArray={territoryHTH.noTocar}
            />
        }


        <br />
        <hr style={{ border: '1px solid black' }} />





        {loading &&
            <>
                <br/>
                <Loading />
            </>
        }






            {/* <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                coords={"58,99, 114,186, 167,98"}
                onClick={() => setBlockAndFaceHandler("1", "A")}
            ></area>
            <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                coords={"58,99, 58,276, 114,186"}
                onClick={() => setBlockAndFaceHandler("1", "B")}
            ></area>
            <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                coords={"58,276, 114,186, 176,280"}
                onClick={() => setBlockAndFaceHandler("1", "C")}
            ></area>
            <area shape={'poly'} alt={`Manzana 1 de Territorio ${territory}`} style={{ cursor: 'pointer' }}
                coords={"114,186, 176,280, 167,98"}
                onClick={() => setBlockAndFaceHandler("1", "D")}
            ></area> */}

            {/* <area shape="rect" coords="34,44,270,350" alt="Computer" href="#computer" />
            <area shape="rect" coords="290,172,333,250" alt="Phone" href="#phone" />
            <area shape="circle" coords="337,300,44" alt="Cup of coffee" href="#coffee" /> */}
            {/* rect - defines a rectangular region    shape="rect" coords="34, 44, 270, 350"         x1-y1 x2-y2
            circle - defines a circular region         shape="circle" coords="337, 300, 44"           x y radius
            poly - defines a polygonal region          shape="poly" coords="140,121,181,116,204,160   x1-y1 x2-y2 x3-y3 etc
            default - defines the entire region */}

        </>

    )
}
