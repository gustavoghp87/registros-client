import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Hr } from '../../commons'
import { HTHAddBuilding, HTHBuildingItem, HTHShareBuildingButton } from '..'
import { generalBlue, typeHTHBuilding, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'

export const HTHBuildings = (props: any) => {

    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
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
                    backgroundColor: !!currentFace.buildings?.length ? generalBlue : 'gray',
                    marginBottom: '50px',
                    width: isMobile ? '100%' : '90%'
                }}
            >
                {!!currentFace.buildings?.length ? "EDIFICIOS" : "No hay edificios en esta cara"}
            </h1>

            {show &&
                <>
                    {user.isAdmin &&
                        <>
                            <HTHAddBuilding
                                currentFace={currentFace}
                                refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                                territoryNumber={territoryNumber}
                            />
                            <Hr classes={'mx-auto my-4'} styles={{ maxWidth: '500px' }} />
                        </>
                    }

                    {!!currentFace.buildings?.length &&
                        <>
                            {currentFace.buildings.map((building: typeHTHBuilding) =>
                                <HTHBuildingItem
                                    building={building}
                                    currentFace={currentFace}
                                    key={building.streetNumber}
                                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                                    territoryNumber={territoryNumber}
                                />
                            )}
                            <Hr />
                            <HTHShareBuildingButton
                                currentFace={currentFace}
                                refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                                territoryNumber={territoryNumber}
                            />
                        </>
                    }
                </>
            }
        </div>
    )
}
