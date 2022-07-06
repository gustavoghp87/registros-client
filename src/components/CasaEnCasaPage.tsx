import React, { useState, useEffect } from 'react'
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
import { HTHMap } from './house-to-house/HTHMap'
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
    const [isFinished, setIsFinished] = useState<boolean>(false)

    const setHTHIsFinishedHandler = (): void => {
        if (!block || !face) return
        setHTHIsFinishedService(!isFinished, block, face, territory).then((success: boolean) => {
            if (success) {
                refreshHTHTerritoryHandler()
            } else {
                console.log("Algo falló")
            }
        })
    }

    const setBlockAndFaceHandler = (selectedBlock: typeBlock, selectedFace: typeFace) => {
        setBlock(selectedBlock)
        setFace(selectedFace)
    }
    
    const refreshHTHTerritoryHandler = (): void => {
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
        getBlocksService(territory).then((blocks: typeBlock[]|null) => {
            if (blocks && blocks.length) setBlocks(blocks)
        })
        getHTHTerritoryService(territory).then((hthTerritory: typeHTHTerritory|null) => {
            if (hthTerritory) {
                setTerritoryHTH(hthTerritory)
            }
        })
        getHTHStreetsByTerritoryService(territory).then((streets0: string[]|null) => {
            if (streets0 && streets0.length) {
                setStreets(streets0)
                setStreet(streets0[0])
            }
        })
        setLoading(false)
    }, [territory, loading, user])

    useEffect(() => {
        if (block && face && territoryHTH && territoryHTH.finished && territoryHTH.finished.length) {
            let isFinished: typeFinishedFace|undefined = territoryHTH.finished.find(x => x.block === block && x.face === face)
            setIsFinished(!isFinished ? false : true)
        } else {
            setIsFinished(false)
        }
    }, [block, face, territoryHTH])    
    

    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''} style={{ fontSize: isMobile ? '2.7rem' : '' }}>
            CASA EN CASA
        </H2>

        <h1 className={`text-center mt-4 ${isDarkMode ? 'text-white' : ''}`} style={{ fontWeight: 'bolder' }}>
            SELECCIONAR CARA DE MANZANA
        </h1>

        {territoryHTH && territoryHTH.hthMap && <>
            <HTHMap
                blocks={blocks}
                setBlockAndFaceHandler={setBlockAndFaceHandler}
                setTerritoryHTH={setTerritoryHTH}
                territory={territory}
                territoryHTH={territoryHTH}
            />
        </>}


        <Container className={isDarkMode ? 'bg-dark text-white' : ''} style={{ paddingBottom: isMobile ? '1px' : '30px' }}>

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
            
            {user && user.isAdmin && block && face &&
                <button className={`my-4 btn ${isFinished ? 'btn-secondary btn-general-secondary' : 'btn-general-blue'} d-block m-auto w-75`}
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
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                />
            }

            {territoryHTH && block && face &&
                <NoTocarHTH
                    territory={territory}
                    block={block}
                    face={face}
                    doNotCalls={territoryHTH.doNotCalls}
                    streets={streets}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                />
            }

            {loading &&
                <>
                    <br/>
                    <Loading />
                </>
            }

        </Container>
    </>)
}
