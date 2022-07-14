import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import { typeRootState } from '../store/store'
import { Loading } from './commons/Loading'
import { useAuth } from '../context/authContext'
import { H2 } from './css/css'
import { typeUser } from '../models/user'
import { generalBlue } from './_App'
import { HTHDoNotCalls } from './house-to-house/HTHDoNotCalls/HTHDoNotCalls'
import { HTHObservations } from './house-to-house/HTHObservations/HTHObservations'
import { HTHMap } from './house-to-house/HTHMap/HTHMap'
import { typeBlock, typeTerritoryNumber } from '../models/territory'
import { getHTHStreetsByTerritoryService, getHTHTerritoryService, setHTHIsFinishedService } from '../services/houseToHouseServices'
import { typeDoNotCall, typeFace, typeHTHTerritory, typePolygon } from '../models/houseToHouse'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const CasaEnCasaPage = () => {
    
    const territory = useParams<any>().territory as typeTerritoryNumber
    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const [currentFace, setCurrentFace] = useState<typePolygon>()
    const [loading, setLoading] = useState<boolean>(true)
    const [territoryHTH, setTerritoryHTH] = useState<typeHTHTerritory>()

    const selectBlockAndFaceHandler = (selectedBlock: typeBlock, selectedFace: typeFace, hthTerritory0: typeHTHTerritory|null = null) => {
        if (!selectedBlock || !selectedFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        const target: typeHTHTerritory = hthTerritory0 ?? territoryHTH
        let currentFace0: typePolygon|undefined = target.map.polygons.find((x: typePolygon) =>
            x.block === selectedBlock && x.face === selectedFace
        )
        if (currentFace0) {
            if (currentFace0.doNotCalls)
                currentFace0.doNotCalls = currentFace0.doNotCalls.sort((a: typeDoNotCall, b: typeDoNotCall) => a.streetNumber - b.streetNumber)
            if (currentFace0.observations)
                currentFace0.observations = currentFace0.observations.reverse()
            if (currentFace0) setCurrentFace(currentFace0)
            console.log("Current Face:", currentFace0);
        }
    }

    const setTerritoryHTHHandler = (territoryHTH0: typeHTHTerritory, isFromInterval: boolean = false): void => {
        setTerritoryHTH(territoryHTH0)
    }

    const setHTHIsFinishedHandler = async (): Promise<void> => {
        if (!currentFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        setHTHIsFinishedService(!currentFace.isFinished, territory, currentFace.block, currentFace.face, currentFace.id)
        .then((success: boolean) => {
            if (success) refreshHTHTerritoryHandler()
        })
    }

    const refreshHTHTerritoryHandler = (): void => {
        //setLoading(true)
        console.log("Refreshing");
        // setTerritoryHTH({
        //     blocks: [],
        //     faces: [],
        //     map: {
        //         centerCoords: { lat: 0, lng: 0 },
        //         lastEditor: '',
        //         markers: [],
        //         polygons: [],
        //         zoom: 0
        //     },
        //     streets: [],
        //     territory
        // })
        getHTHStreetsByTerritoryService(territory).then((streets0: string[]|null) => {
            getHTHTerritoryService(territory).then((hthTerritory0: typeHTHTerritory|null) => {
                if (!hthTerritory0) return
                if (streets0 && streets0.length) streets0.forEach(x => { if (hthTerritory0.streets.indexOf(x) !== -1) hthTerritory0.streets.push(x) })
                setTerritoryHTHHandler(hthTerritory0)
                console.log(currentFace);
                if (currentFace) selectBlockAndFaceHandler(currentFace.block, currentFace.face, hthTerritory0)
                //setLoading(false)
            })
        })
    }

    useEffect(() => {
        if (user && !user.isAdmin) window.location.href = '/'
        if (!territory || !loading) return
        getHTHStreetsByTerritoryService(territory).then((streets0: string[]|null) => {
            getHTHTerritoryService(territory).then((hthTerritory0: typeHTHTerritory|null) => {
                if (!hthTerritory0) return
                if (streets0 && streets0.length)
                    streets0.forEach(x => {
                        if (hthTerritory0.streets.indexOf(x) !== -1) hthTerritory0.streets.push(x)
                    })
                setTerritoryHTH(hthTerritory0)
                if (currentFace) selectBlockAndFaceHandler(currentFace.block, currentFace.face, hthTerritory0)
                setLoading(false)
            })
        })
        return () => {
            setCurrentFace(undefined)
            setTerritoryHTH(undefined)
        }
    }, [territory, loading, user, currentFace])
    

    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''} style={{ fontSize: isMobile ? '2.7rem' : '' }}>
            CASA EN CASA
        </H2>

        <h1 className={`text-center mt-4 ${isDarkMode ? 'text-white' : ''}`} style={{ fontWeight: 'bolder' }}>
            SELECCIONAR CARA DE MANZANA
        </h1>

        {territoryHTH && territoryHTH.map && <>
            <HTHMap
                currentFace={currentFace}
                refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                selectBlockAndFaceHandler={selectBlockAndFaceHandler}
                setTerritoryHTHHandler={setTerritoryHTHHandler}
                territoryHTH={territoryHTH}
            />
        </>}

        {loading &&
            <>
                <br/> <br/> <br/>
                <Loading />
            </>
        }

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
                <br className={currentFace && currentFace.block ? '' : 'd-none'} />
                <span className={'mb-2'}> {currentFace && currentFace.block ? `MANZANA ${currentFace.block}` : ''} </span>
                <br className={currentFace && currentFace.face ? '' : 'd-none'} />
                <span> {currentFace && currentFace.face ? `CARA ${currentFace.face}` : ''} </span>
            </h1>
            
            {user && user.isAdmin && currentFace &&
                <button
                    className={`my-4 btn ${currentFace.isFinished ? 'btn-secondary btn-general-secondary' : 'btn-general-blue'} d-block m-auto w-75`}
                    onClick={() => setHTHIsFinishedHandler()}
                >
                    {currentFace.isFinished ?
                        `Desmarcar Cara ${currentFace.face} de Manzana ${currentFace.block} como terminada`
                        :
                        `Marcar esta CARA ${currentFace.face} de MANZANA ${currentFace.block} como terminada`
                    }
                </button>
            }

            {territoryHTH && currentFace && <>
                <HTHObservations
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territory={territoryHTH.territory}
                />
                <HTHDoNotCalls
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territory={territoryHTH.territory}
                />
            </>}

        </Container>
        
    </>)
}
