import { useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { Hr } from '../../commons'
import { HTHBuildingCheckbox } from '..'
import { typeHTHBuilding, typeHTHHousehold, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'

export const HTHBuildingModal = (props: any) => {

    const { isDarkMode } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode
    }))
    const closeBuildingModalHandler: () => void = props.closeBuildingModalHandler
    const currentBuilding: typeHTHBuilding = props.currentBuilding
    const currentFace: typePolygon = props.currentFace
    const refreshHTHTerritoryHandler: () => void = props.refreshHTHTerritoryHandler
    const territoryNumber: typeTerritoryNumber = props.territoryNumber
    const levels: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]
    const doorNames: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

    return (
        <Modal
            backdrop={'static'}
            backdropClassName={isDarkMode ? 'bg-dark': ''}
            contentClassName={isDarkMode ? 'bg-dark text-white' : ''}
            keyboard={false}
            onHide={() => closeBuildingModalHandler()}
            show={true}
            size={'xl'}
        >
            <Modal.Header closeButton />

            <Modal.Body>
                <div className={'card my-4'}>

                    <h1 className={'bg-dark text-white text-center font-weight-bolder mt-4 mb-2 py-2'}
                        style={{ border: isDarkMode ? '' : '1px solid lightgray', fontSize: '1.6rem' }}
                        >
                        Edificio {currentFace.street} {currentBuilding.streetNumber}
                    </h1>

                    <Hr />

                    {[...levels]
                     .slice(currentBuilding.hasLowLevel ? 0 : 1, currentBuilding.numberOfLevels + 1)
                     .map((level: number) =>

                        <div key={level}>
                            <div className={'row d-flex justify-content-center align-self-center mb-3 mx-1'}>
                                {[...doorNames]
                                 .slice(0, currentBuilding.numberPerLevel)
                                 .map((doorNumber: number) => {

                                    const currentHousehold: typeHTHHousehold|undefined = currentBuilding.households.find(x => x.level === level && x.doorNumber === doorNumber)
                                    return (
                                        <HTHBuildingCheckbox
                                            doorName={currentHousehold?.doorName}
                                            doorNumber={currentHousehold?.doorNumber}
                                            key={doorNumber}
                                            level={currentHousehold?.level}
                                            
                                            block={currentFace.block}
                                            closeBuildingModalHandler={closeBuildingModalHandler}
                                            face={currentFace.face}
                                            id={currentHousehold?.id}
                                            isChecked0={currentHousehold?.isChecked}
                                            refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
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
            </Modal.Body>
        </Modal>
    )
}
