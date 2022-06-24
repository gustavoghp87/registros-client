import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { typeRootState } from '../store/store'
import { Loading } from './commons/Loading'
import { useAuth } from '../context/authContext'
import { H2 } from './css/css'
import { typeUser } from '../models/user'
import { generalBlue } from './_App'
import { NoTocarHTH } from './house-to-house/NoTocarHTH'
import { ObservacionesHTH } from './house-to-house/ObservacionesHTH'
import { Container } from 'react-bootstrap'
import { typeBlock, typeTerritoryNumber } from '../models/territory'
import { getBlocksService } from '../services/territoryServices'
import { getHTHStreetsByTerritoryService, getHTHTerritoryService, setHTHIsFinishedService } from '../services/houseToHouseServices'
import { typeFace, typeFinishedFace, typeHTHTerritory } from '../models/houseToHouse'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const CasaEnCasaPage = () => {
    
    const user: typeUser|undefined = useAuth().user
    const territory = useParams<any>().territory as typeTerritoryNumber
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const [loading, setLoading] = useState<boolean>(true)
    const [territoryHTH, setTerritoryHTH] = useState<typeHTHTerritory>()
    const [block, setBlock] = useState<typeBlock>()
    const [blocks, setBlocks] = useState<typeBlock[]>()
    const [face, setFace] = useState<typeFace>()
    const [street, setStreet] = useState<string>()
    const [streets, setStreets] = useState<string[]>()
    const [imageSrc, setImageSrc] = useState<string>()
    const [isFinished, setIsFinished] = useState<boolean>(false)

    const setHTHIsFinishedHandler = (): void => {
        if (!block || !face) return
        setHTHIsFinishedService(!isFinished, block, face, territory).then((success: boolean) => {
            if (success) {
                refreshDoNotCallHandler()
            } else {
                console.log("Algo falló")
            }
        })
    }
    
    const executeX = (e: any) => {
        const x = parseInt(e.pageX) - parseInt(e.target.offsetLeft);
        const y = parseInt(e.pageY) - parseInt(e.target.offsetTop);
        console.log("X:", x, ", Y:", y);
    }

    const setBlockAndFaceHandler = (selectedBlock: typeBlock, selectedFace: typeFace) => {
        setBlock(selectedBlock)
        setFace(selectedFace)
        setImageSrc(`/img/img-hth/${territory}${isMobile ? 'v' : 'h'}${selectedBlock}${selectedFace}.png`)
    }
    
    const changeImageSrc = (selectedBlock: typeBlock|'0' = '0', selectedFace: typeFace|'0' = '0') => {
        if (face) return
        setImageSrc(`/img/img-hth/${territory}${isMobile ? 'v' : 'h'}${selectedBlock}${selectedFace}.png`)
        // TODO: click out of image => set image 2h00.png
    }

    const refreshDoNotCallHandler = (): void => {
        setLoading(true)
        if (territory) getHTHTerritoryService(territory).then((hthTerritory: typeHTHTerritory|null) => {
            if (hthTerritory) {
                setTerritoryHTH(hthTerritory)
                if (hthTerritory.finished && hthTerritory.finished.length) {
                    let isFinished: typeFinishedFace|undefined = hthTerritory.finished.find(x => x.block === block && x.face === face)
                    setIsFinished(!isFinished ? false : true)
                } else {
                    setIsFinished(false)
                }
            } else {
                console.log("Algo falló")
            }
        })
        setLoading(false)
    }


    useEffect(() => {
        if (user && !user.isAdmin) window.location.href = "/"                   // to change
        if (!territory || !loading) return
        if (!blocks || !face) {
            getBlocksService(territory).then((blocks: typeBlock[]|null) => {
                if (blocks && blocks.length) setBlocks(blocks)
            })
        }
        if (territory && !territoryHTH) {
            getHTHTerritoryService(territory).then((hthTerritory: typeHTHTerritory|null) => {
                if (hthTerritory) setTerritoryHTH(hthTerritory)
            })
        }
        if (territory && !streets) {        
            getHTHStreetsByTerritoryService(territory).then((streets: string[]|null) => {
                if (streets && streets.length) {
                    setStreets(streets)
                    setStreet(streets[0])
                }
            })
        }
        if (block && face && territoryHTH && territoryHTH.finished && territoryHTH.finished.length) {
            let isFinished: typeFinishedFace|undefined = territoryHTH.finished.find(x => x.block === block && x.face === face)
            setIsFinished(!isFinished ? false : true)
        } else {
            setIsFinished(false)
        }
        setLoading(false)
        return () => {
            // setTerritoryHTH(undefined)
            // setBlock(undefined)
            // setBlocks(undefined)
            // setFace(undefined)
            // setStreet(undefined)
            // setStreets(undefined)
            // setImageSrc(undefined)
        }
    }, [isMobile, territory, block, blocks, face, loading, user, streets, territoryHTH, imageSrc])

    useEffect(() => {
        if (!territory) return
        if (isMobile) setImageSrc(`/img/img-hth/${territory}v00.png`)
        else setImageSrc(`/img/img-hth/${territory}h00.png`)
    }, [territory, isMobile])


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
            style={{
                border: '1px solid black',
                borderRadius: '8px',
                display: 'block',
                height: 'auto',
                margin: '60px auto',
                padding: 0,
                width: isMobile ? '280px' : '800px'
            }}
            onClick={(e) => executeX(e)}
        />

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
                    {/* <area></area> */}
                </> :
                territory === "56" ? <>
                    {/* <area></area> */}
                </> : <></>
            }
        </map>



        <Container className={`${isDarkMode ? 'bg-dark text-white' : ''}`}>

            <h1 className={'text-white py-3 mb-4'}
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
            
            {block && face &&
                <button className={`my-4 btn ${isFinished ? 'btn-danger' : 'btn-general-blue'} d-block m-auto w-75`}
                    onClick={() => setHTHIsFinishedHandler()}
                >
                    {isFinished ?
                        `Desmarcar Cara ${face} de Manzana ${block} como terminada`
                        :
                        `Marcar esta CARA ${face} de MANZANA ${block} como terminada`
                    }
                </button>
            }

            {territoryHTH && block && face &&
                <ObservacionesHTH
                    territory={territory}
                    block={block}
                    face={face}
                    street={street}
                    observations={territoryHTH.observations}
                    refreshDoNotCallHandler={refreshDoNotCallHandler}
                />
            }

            {territoryHTH && block && face &&
                <NoTocarHTH
                    territory={territory}
                    block={block}
                    face={face}
                    doNotCalls={territoryHTH.doNotCalls}
                    streets={streets}
                    refreshDoNotCallHandler={refreshDoNotCallHandler}
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

        </Container>




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
