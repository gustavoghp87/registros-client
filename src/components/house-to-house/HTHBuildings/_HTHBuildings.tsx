import { FC, useState } from 'react'
import { generalBlue } from '../../../constants'
import { Hr } from '../../commons'
import { HTHAddBuilding, HTHBuildingItem, HTHShareBuildingButton } from '..'
import { typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHBuildings: FC<propsType> = ({ currentFace, refreshHTHTerritoryHandler, territoryNumber }) => {
    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const [show, setShow] = useState(false)

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
                            {currentFace.buildings.map(building =>
                                <HTHBuildingItem key={building.streetNumber}
                                    building={building}
                                    currentFace={currentFace}
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
