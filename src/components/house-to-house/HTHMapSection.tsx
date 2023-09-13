import { Container } from 'react-bootstrap'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { generalBlue } from '../../constants'
import { HTHBuildings, HTHChangeFaceStateButtons, HTHDeleteFaceButton, HTHDoNotCalls, HTHMap, HTHObservations, HTHSetIsFinishedButton } from '.'
import { typeBlock, typeFace, typeHTHTerritory, typePolygon, typeRootState, typeTerritoryNumber } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    currentFace: typePolygon|null
    refreshHTHTerritoryHandler: () => void
    setCurrentFace: Dispatch<SetStateAction<typePolygon|null>>
    setTerritoryHTH: Dispatch<SetStateAction<typeHTHTerritory|null>>
    territoryHTH: typeHTHTerritory|null
    territoryNumber: typeTerritoryNumber
}

export const HTHMapSection: FC<propsType> = ({
    currentFace,
    refreshHTHTerritoryHandler,
    setCurrentFace,
    setTerritoryHTH,
    territoryHTH,
    territoryNumber
}) => {
    const { config, isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const [isAddingNewBlock, setIsAddingNewBlock] = useState(false)
    const [isAddingNewFace, setIsAddingNewFace] = useState(false)
    const [isCompletingNewBlock, setIsCompletingNewBlock] = useState(false)
    const [isEditingView, setIsEditingView] = useState(false)
    const [showNewFaceOptions, setShowNewFaceOptions] = useState(false)
    
    const selectBlockAndFaceHandler = (selectedBlock?: typeBlock, selectedFace?: typeFace, hthTerritory0: typeHTHTerritory|null = null) => {
        if (selectedBlock === undefined && selectedFace === undefined)
            setCurrentFace(null)
        if (!selectedBlock || !selectedFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons)
            return
        const target = hthTerritory0 ?? territoryHTH
        let currentFace0 = target.map.polygons.find((x: typePolygon) => x.block === selectedBlock && x.face === selectedFace)
        if (!currentFace0) {
            return
        }
        if (currentFace0.doNotCalls) {
            currentFace0.doNotCalls = currentFace0.doNotCalls.sort((a, b) => a.streetNumber - b.streetNumber)
        }
        if (currentFace0.observations) {
            currentFace0.observations = currentFace0.observations.reverse()
        }
        if (currentFace0) {
            setCurrentFace(currentFace0)
        }
    }

    return (<>
        {!isAddingNewBlock && !isAddingNewFace && !isEditingView &&
            <h1 className={`text-center fw-bolder ${isDarkMode ? 'text-white' : ''} mt-3 mb-4`}>
                SELECCIONAR CARA DE MANZANA
            </h1>
        }

        {territoryHTH?.map && <>
            <HTHMap
                currentFace={currentFace}
                isAddingNewBlock={isAddingNewBlock}
                isAddingNewFace={isAddingNewFace}
                isCompletingNewBlock={isCompletingNewBlock}
                isEditingView={isEditingView}
                refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                selectBlockAndFaceHandler={selectBlockAndFaceHandler}
                setIsAddingNewBlock={setIsAddingNewBlock}
                setIsAddingNewFace={setIsAddingNewFace}
                setIsCompletingNewBlock={setIsCompletingNewBlock}
                setIsEditingView={setIsEditingView}
                setShowNewFaceOptions={setShowNewFaceOptions}
                setTerritoryHTH={setTerritoryHTH}
                showNewFaceOptions={showNewFaceOptions}
                territoryHTH={territoryHTH}
            />
            
            {!config.isDisabledCloseHthFaces && !showNewFaceOptions && !isEditingView && !isAddingNewFace && !isAddingNewBlock && !!territoryHTH.map.polygons?.length &&
                <HTHChangeFaceStateButtons
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryHTH.territoryNumber}
                />
            }
        </>}

        <Container
            className={isDarkMode ? 'bg-dark text-white' : ''}
            style={{ paddingBottom: isMobile ? '1px' : '30px' }}
        >

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
                
                {currentFace &&
                    <>
                        <br />
                        <span> Manzana {currentFace.block} </span>
                        <br />
                        <span> Cara {currentFace.face} - {currentFace.street} </span>
                    </>
                }
            </h1>
            
            {territoryHTH && currentFace && <>
                <HTHSetIsFinishedButton
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryHTH={territoryHTH}
                />
                <HTHBuildings
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryHTH.territoryNumber}
                />
                {!config.isDisabledHthFaceObservations &&
                    <HTHObservations
                        currentFace={currentFace}
                        refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                        territoryNumber={territoryHTH.territoryNumber}
                    />
                }
                <HTHDoNotCalls
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryHTH.territoryNumber}
                />

                {!config.isDisabledEditHthMaps && user.isAdmin && !isMobile &&
                    <HTHDeleteFaceButton
                        currentFace={currentFace}
                        refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                        territoryHTH={territoryHTH}
                    />
                }
            </>}

        </Container>
    </>)
}
