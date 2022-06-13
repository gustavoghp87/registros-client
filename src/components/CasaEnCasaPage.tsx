import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Button, Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeRootState } from '../store/store'
import { Loading } from './commons/Loading'
import { useAuth } from '../context/authContext'
import { H2 } from './css/css'
import { typeUser } from '../models/user'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { dark } from '../models/territory'

export const CasaEnCasaPage = () => {
    
    const { territory } = useParams<any>()
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const user: typeUser|undefined = useAuth().user
    const isFinished = false
    const [loading, setLoading] = useState(true)
    const [block, setBlock] = useState('')
    const [blocks, setBlocks] = useState([''])
    const [face, setFace] = useState('')
    const [imageSrc, setImageSrc] = useState<string>(isMobile ? `/img/img-hth/${territory}v00.png` : `/img/img-hth/${territory}h00.png`)

    useEffect(() => {
        setBlocks(['1', '2', '3'])
        if (isMobile) setImageSrc(`/img/img-hth/${territory}v00.png`)
        else setImageSrc(`/img/img-hth/${territory}h00.png`)
        return () => { }
    }, [isMobile, territory])

    const blockSelection = (blockSelected: string) => {
        setBlock(blockSelected)
        setFace('')
        if (isMobile) setImageSrc(`/img/img-hth/${territory}v00.png`)
        else setImageSrc(`/img/img-hth/${territory}h00.png`)
    }

    const executeX = (e: any) => {
        const x = parseInt(e.pageX) - parseInt(e.target.offsetLeft);
        const y = parseInt(e.pageY) - parseInt(e.target.offsetTop);
        console.log("X:", x, ", Y:", y);
    }

    const setBlockAndFaceHandler = (selectedBlock: string, selectedFace: string) => {             //     HERE      <---------------------
        setBlock(selectedBlock)
        setFace(selectedFace)
        //changeImageSrc(selectedBlock, selectedFace)
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

        <div className={'row d-flex align-items-center'} style={{ justifyContent: 'space-evenly' }}>
            {(blocks && !!blocks.length && blocks.map((currentBlock: string) =>
                <button className={`btn ${block === currentBlock && face === '' ? 'btn-general-blue' : 'btn-dark'} mx-1 my-2`}
                    style={{ width: isMobile ? '120px' : '220px' }}
                    onClick={() => blockSelection("1")}
                >
                    {`Manzana ${currentBlock}`}
                </button>
            ))}
        </div>

        <map name={"workmap"}>
            {
                territory === "1" ? <>
                    <area></area>
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


        <h1 className={isDarkMode ? 'text-white' : ''}
            style={{
                textAlign: 'center',
                margin: isMobile ? '30px auto 20px auto' : '60px auto 40px auto',
                fontSize: isMobile ? '2.3rem' : '2.8rem',
                fontWeight: 'bolder'
            }}
        >
            {block ? `MANZANA ${block}` : ''} {face ? `CARA ${face}` : ''}
            <br/>
            TERRITORIO {territory}
        </h1>



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



        <br />
        <hr style={{ border: '1px solid black' }} />


        {/* {loading &&
            <>
                <br/>
                <Loading />
            </>
        } */}

    </>
    )
}
