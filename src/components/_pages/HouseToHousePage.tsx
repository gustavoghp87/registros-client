import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import { io, Socket } from 'socket.io-client'
import { HTHDoNotCalls, HTHMap, HTHObservations } from '../house-to-house'
import { H2, Loading, WarningToaster } from '../commons'
import { SERVER } from '../../config'
import { getHTHTerritoryService, setHTHIsFinishedService } from '../../services'
import { generalBlue, hthChangeString, typeAppDispatch, typeBlock, typeDoNotCall, typeFace, typeHTHTerritory, typePolygon, typeRootState, typeTerritoryNumber } from '../../models'
import { setValuesAndOpenAlertModalReducer } from '../../store'

const socket: Socket = io(SERVER, { withCredentials: true })

export const HouseToHousePage = () => {
    
    const territoryNumber = useParams<any>().territory as typeTerritoryNumber
    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [currentFace, setCurrentFace] = useState<typePolygon>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [territoryHTH, setTerritoryHTH] = useState<typeHTHTerritory>()

    const setTerritoryHTHHandler = (territoryHTH0: typeHTHTerritory): void => {
        setTerritoryHTH(territoryHTH0)
    }

    const openConfirmModalHTHIsFinishedHandler = (): void => {
        if (!currentFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Cambiar estado de la Cara",
            message: currentFace.isFinished ? `Descarmar esta CARA ${currentFace.face} de MANZANA ${currentFace.block} como terminada` : `Marcar esta CARA ${currentFace.face} de MANZANA ${currentFace.block} como terminada`,
            execution: setHTHIsFinishedHandler
        }))
    }

    const setHTHIsFinishedHandler = async (): Promise<void> => {
        if (!currentFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        setHTHIsFinishedService(territoryNumber, currentFace.block, currentFace.face, currentFace.id, !currentFace.isFinished).then((success: boolean) => {
            if (!success) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo ${currentFace.isFinished ? "abrir" : "cerrar"} la cara ${currentFace.face} de la manzana ${currentFace.block} (territorio ${territoryNumber})`,
                animation: 2
            }))
            refreshHTHTerritoryHandler()
        })
    }

    const selectBlockAndFaceHandler = (selectedBlock: typeBlock, selectedFace: typeFace, hthTerritory0: typeHTHTerritory|null = null) => {
        if (selectedBlock === undefined && selectedFace === undefined) setCurrentFace(undefined)
        if (!selectedBlock || !selectedFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        const target: typeHTHTerritory = hthTerritory0 ?? territoryHTH
        let currentFace0: typePolygon|undefined = target.map.polygons.find((x: typePolygon) =>
            x.block === selectedBlock && x.face === selectedFace
        )
        if (!currentFace0) return
        if (currentFace0.doNotCalls)
            currentFace0.doNotCalls = currentFace0.doNotCalls.sort((a: typeDoNotCall, b: typeDoNotCall) => a.streetNumber - b.streetNumber)
        if (currentFace0.observations)
            currentFace0.observations = currentFace0.observations.reverse()
        if (currentFace0) setCurrentFace(currentFace0)
    }

    const refreshHTHTerritoryHandler = useCallback((): void => {
        setIsLoading(true)
        getHTHTerritoryService(territoryNumber).then((hthTerritory0: typeHTHTerritory|null) => {
            setIsLoading(false)
            if (!hthTerritory0) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo recuperar el territorio ${territoryNumber}`,
                animation: 2
            }))
            setTerritoryHTHHandler(hthTerritory0)
            setCurrentFace(x => {
                if (x && x.block && x.face) {
                    const currentFace0: typePolygon|undefined = hthTerritory0.map.polygons.find((y: typePolygon) =>
                        y.block === x.block && y.face === x.face
                    )
                    if (currentFace0) {
                        if (currentFace0.doNotCalls)
                            x.doNotCalls = currentFace0.doNotCalls.sort((a: typeDoNotCall, b: typeDoNotCall) => a.streetNumber - b.streetNumber)
                        if (currentFace0.observations)
                            x.observations = currentFace0.observations.reverse()
                    }
                }
                return x
            })
        })
        socket.emit(hthChangeString, territoryNumber, user.email)
    }, [dispatch, territoryNumber, user.email])

    useEffect(() => {
        refreshHTHTerritoryHandler()
        return () => {
            setCurrentFace(undefined)
            setTerritoryHTH(undefined)
        }
    }, [refreshHTHTerritoryHandler])

    useEffect(() => {
        socket.on(hthChangeString, (territoryNumber0: typeTerritoryNumber, userEmail: string) => {
            if (userEmail && territoryNumber && userEmail !== user.email && territoryNumber0 === territoryNumber) {
                //refreshHTHTerritoryHandler()
                console.log("Refrescado por uso del usuario", userEmail)
            }
        })
        return () => { socket.off(hthChangeString) }
    }, [refreshHTHTerritoryHandler, territoryNumber, user.email])

    return (
    <>
        <H2 title={"CASA EN CASA"} />

        {isLoading && <Loading mt={'60px'} />}

        {territoryHTH && (!socket || !socket.connected) &&
            <div style={{ marginTop: '30px', position: 'fixed', zIndex: 4 }}>
                <WarningToaster
                    bodyText={"Refrescar la página y verificar que hay internet"}
                    headerText={<strong>Hay un problema de conexión</strong>}
                />
            </div>
        }

        <h1 className={`text-center mt-3 mb-4 ${isDarkMode ? 'text-white' : ''}`} style={{ fontWeight: 'bolder' }}>
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
                <span> TERRITORIO {territoryNumber} </span>
                <br className={currentFace && currentFace.block ? '' : 'd-none'} />
                <span className={'mb-2'}> {currentFace && currentFace.block ? `MANZANA ${currentFace.block}` : ''} </span>
                <br className={currentFace && currentFace.face ? '' : 'd-none'} />
                <span> {currentFace && currentFace.face ? `CARA ${currentFace.face}` : ''} </span>
            </h1>
            
            {user && user.isAdmin && currentFace &&
                <button
                    className={`my-4 btn ${currentFace.isFinished ? 'btn-secondary' : 'btn-general-blue'} btn-size12 d-block m-auto w-75`}
                    onClick={() => openConfirmModalHTHIsFinishedHandler()}
                >
                    {currentFace.isFinished ?
                        `Desmarcar Cara ${currentFace.face} de Manzana ${currentFace.block} como terminada`
                        :
                        `Marcar esta CARA ${currentFace.face} de Manzana ${currentFace.block} como terminada`
                    }
                </button>
            }

            {territoryHTH && currentFace && <>
                <HTHObservations
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryHTH.territoryNumber}
                />
                <HTHDoNotCalls
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryHTH.territoryNumber}
                />
            </>}

        </Container>
        
    </>)
}
