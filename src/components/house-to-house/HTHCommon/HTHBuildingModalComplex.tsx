import { Dispatch, FC, SetStateAction } from 'react'
import { getHthComplexBuilding, modifyHTHHouseholdService } from '../../../services'
import { typeHTHBuilding, typePolygon, typeTerritoryNumber } from '../../../models'

type propsType = {
    closeBuildingModalHandler: () => void
    congregation: number
    currentBuilding: typeHTHBuilding
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    setIsLoading: Dispatch<SetStateAction<boolean>>
    territoryNumber: typeTerritoryNumber
}

export const HTHBuildingModalComplex: FC<propsType> = ({
    congregation, currentBuilding, currentFace, refreshHTHTerritoryHandler, setIsLoading, territoryNumber
}) => {
    const state = getHthComplexBuilding(currentBuilding)

    const changeCallingState = async (householdId: number, isChecked: boolean) => {
        if (!territoryNumber || !currentFace.block || !currentFace.face || !currentBuilding.streetNumber || !householdId) return
        setIsLoading(true)
        const success = await modifyHTHHouseholdService(congregation, territoryNumber, currentFace.block, currentFace.face, currentBuilding.streetNumber, householdId, !isChecked, false)
        if (!success) {
            setIsLoading(false)
            alert("Falló el cambio de estado de la vivienda")  // keep alert (modal vs modal)
            return
        }
        refreshHTHTerritoryHandler()
        setIsLoading(false)
    }

    return (
        <div style={{  }}>
            <div className={'container my-5'} style={{ maxWidth: '100%', overflowX: 'auto' }}>
                <div className={'d-flex'}>
                    {state.map((el, column) =>
                        <div key={column} className={'justify-content-center'}>
                            {el.map((item, row) =>
                                <div key={`checkbox-${column}-${row}`}
                                    style={{ display: 'flex', justifyContent: 'space-around' }}
                                >
                                    
                                    {item.household ?
                                        <div
                                            className={`row d-flex justify-content-start pointer bg-dark text-white text-center my-2 `}
                                            style={{
                                                
                                                border: '1px solid black',
                                                borderRadius: '7px',
                                                marginInline: '10px',
                                                height: '50px',
                                                // overflowX: 'hidden',
                                                // overflowY: 'hidden',
                                                paddingTop: '10px',
                                                width: '98px',
                                                // whiteSpace: 'nowrap'
                                            }}
                                            onClick={() => changeCallingState(item.household?.id || 0, !!item.household?.isChecked)}
                                        >
                                            <div className="col-5">
                                                <input id={`checkbox-${item.household.id}`}
                                                    type='checkbox'
                                                    className={'form-check-input checkbox-xs'}
                                                    checked={item.household.isChecked}
                                                    onChange={() => {}}
                                                />
                                            </div>
                                            <div className="col-7">
                                                <label htmlFor={`checkbox-${item.household.id}`}
                                                    className={item.household.doorName.length > 5 ? 'animate__animated animate__fadeInLeft animate__slow animate__infinite infinite' : ''}
                                                    style={{
                                                        marginTop: '2px',
                                                        marginLeft: '5px',
                                                        overflowX: 'hidden',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {item.household.doorName}
                                                </label>
                                            </div>
                                        </div>
                                        :
                                        <div
                                            className={'bg-white my-2'}
                                            style={{
                                                border: '1px solid white',
                                                borderRadius: '7px',
                                                marginInline: '10px',
                                                minHeight: '50px',
                                                paddingTop: '12px',
                                                width: '98px'
                                            }}
                                        >
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
