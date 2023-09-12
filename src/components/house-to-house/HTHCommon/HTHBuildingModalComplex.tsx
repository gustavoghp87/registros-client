import { Dispatch, FC, SetStateAction } from 'react'
import { typeHTHBuilding, typeHTHHousehold, typePolygon, typeTerritoryNumber } from '../../../models'
import { modifyHTHHouseholdService } from '../../../services'

type droppableType = {
    id: string
    content: typeHTHHousehold | null
}

const getItems = (currentBuilding: typeHTHBuilding, door: number): droppableType[] =>
    Array.from({ length: currentBuilding.numberOfLevels }, (_, level) => ({
        id: `item-${level + door}-${new Date().getTime()}`,
        content: currentBuilding.households.find(h => h.level === level && h.doorNumber === door) || null
    })
)

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
    const state: droppableType[][] = Array.from({ length: currentBuilding.numberPerLevel }, (_, i) => getItems(currentBuilding, i))

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
                                    
                                    {item.content ?
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
                                            onClick={() => changeCallingState(item.content?.id || 0, !!item.content?.isChecked)}
                                        >
                                            <div className="col-5">
                                                <input id={`checkbox-${item.content.id}`}
                                                    type='checkbox'
                                                    className={'form-check-input checkbox-xs'}
                                                    checked={item.content.isChecked}
                                                    onChange={() => {}}
                                                />
                                            </div>
                                            <div className="col-7">
                                                <label htmlFor={`checkbox-${item.content.id}`}
                                                    className={item.content.doorName.length > 5 ? 'animate__animated animate__fadeInLeft animate__slow animate__infinite infinite' : ''}
                                                    style={{
                                                        marginTop: '2px',
                                                        marginLeft: '5px',
                                                        overflowX: 'hidden',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {item.content.doorName}
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
