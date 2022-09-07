import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Hr } from '../../commons'
import { HTHAddBuilding, HTHBuildingItem } from '..'
import { generalBlue, typeHTHBuilding, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'

export const HTHBuildings = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile
    }))
    const currentFace: typePolygon = props.currentFace
    const refreshHTHTerritoryHandler: () => void = props.refreshHTHTerritoryHandler
    const territoryNumber: typeTerritoryNumber = props.territoryNumber
    const [show, setShow] = useState<boolean>(false)

    return (
        <div style={{ marginTop: '100px', marginBottom: '50px' }}>

            <h1 className={'py-3 text-center text-white d-block mx-auto pointer rounded-3'}
                onClick={() => setShow(x => !x)}
                style={{
                    backgroundColor: generalBlue,
                    marginBottom: '50px',
                    width: isMobile ? '100%' : '90%'
                }}
            >
                EDIFICIOS
            </h1>

            {show &&
                <>
                    <HTHAddBuilding
                        currentFace={currentFace}
                        refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                        territoryNumber={territoryNumber}
                    />

                    {!!currentFace.buildings?.length &&
                        <>
                            <Hr classes={'mx-auto my-4'} styles={{ maxWidth: '500px' }} />

                            {currentFace.buildings.map((building: typeHTHBuilding) =>
                                <HTHBuildingItem
                                    building={building}
                                    currentFace={currentFace}
                                    key={building.streetNumber}
                                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                                    territoryNumber={territoryNumber}
                                />
                            )}
                        </>
                    }
                </>
            }
        </div>
    )
}
