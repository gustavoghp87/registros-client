import { Dispatch, FC, Fragment, SetStateAction } from 'react'
import { Hr } from '../../commons'
import { HTHBuildingCheckbox } from '..'
import { hthConfigOptions } from '../../../app-config'
import { typeHTHBuilding, typePolygon, typeTerritoryNumber } from '../../../models'

type propsType = {
    congregation: number
    currentBuilding: typeHTHBuilding
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    setIsLoading: Dispatch<SetStateAction<boolean>>
    territoryNumber: typeTerritoryNumber
}

export const HTHBuildingModalSimple: FC<propsType> = ({
    congregation, currentBuilding, currentFace, refreshHTHTerritoryHandler, setIsLoading, territoryNumber
}) => (
    <div>
        <div style={{ display: 'flex' ,flexDirection: currentBuilding.reverseOrderY ? 'column' : 'column-reverse' }}>
            {hthConfigOptions.buildingLevels
                .slice(currentBuilding.hasLowLevel ? 0 : 1, currentBuilding.numberOfLevels + 1)
                .map(level =>
                <div key={level}>
                    <div className={'row d-flex justify-content-center align-self-center mb-3 mx-1'}>
                        {hthConfigOptions.buildingDoorNumbers
                         .slice(0, currentBuilding.numberPerLevel)
                         .sort((a, b) => currentBuilding.reverseOrderX ? b - a : a - b)
                         .map(doorNumber => {
                            const currentHousehold = currentBuilding.households.find(x => x.level === level && x.doorNumber === doorNumber)
                            if (!currentHousehold) return <Fragment key={level + '-' + doorNumber}></Fragment>
                            return (
                                <HTHBuildingCheckbox key={level + '-' + doorNumber}
                                    block={currentFace.block}
                                    congregation={congregation}
                                    doorName={currentHousehold.doorName}
                                    face={currentFace.face}
                                    id={currentHousehold.id}
                                    isChecked={currentHousehold.isChecked}
                                    isManager={false}
                                    level={currentHousehold.level}
                                    onDates={currentHousehold.onDates}
                                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                                    setIsLoading={setIsLoading}
                                    streetNumber={currentBuilding.streetNumber}
                                    territoryNumber={territoryNumber}
                                />
                            )
                        })}
                    </div>
                    <Hr />
                </div>
            )}
        </div>
        {currentBuilding.manager &&
            <div className={'row d-flex justify-content-center align-self-center mb-3 mx-1'}>
                <HTHBuildingCheckbox
                    block={currentFace.block}
                    congregation={congregation}
                    doorName={''}
                    face={currentFace.face}
                    id={currentBuilding.manager.id}
                    isChecked={currentBuilding.manager.isChecked}
                    isManager={true}
                    level={null}
                    onDates={currentBuilding.manager.onDates}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    setIsLoading={setIsLoading}
                    streetNumber={currentBuilding.streetNumber}
                    territoryNumber={territoryNumber}
                />
            </div>
        }
    </div>
);
