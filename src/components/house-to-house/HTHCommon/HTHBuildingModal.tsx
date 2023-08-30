import { BsTrash } from 'react-icons/bs'
import { deleteHTHBuildingService } from '../../../services'
import { FC, useState } from 'react'
import { Hr, Loading } from '../../commons'
import { HTHBuildingCheckbox } from '..'
import { Modal } from 'react-bootstrap'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeHTHBuilding, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

type propsType = {
    closeBuildingModalHandler: () => void
    congregation: number
    currentBuilding: typeHTHBuilding
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHBuildingModal: FC<propsType> = ({
    closeBuildingModalHandler, congregation, currentBuilding,
    currentFace, refreshHTHTerritoryHandler, territoryNumber
}) => {
    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const levels: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]
    const doorNames: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

    const openDeleteBuildingModal = (): void => {
        if (!closeBuildingModalHandler) return
        closeBuildingModalHandler()
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Eliminar Edificio?",
            message: `Se va a eliminar el edificio ${currentFace.street} ${currentBuilding.streetNumber}. Esta acción es irreversible.`,
            execution: deleteHTHBuildingHandler
        }))
    }

    const deleteHTHBuildingHandler = (): void => {
        deleteHTHBuildingService(territoryNumber, currentFace.block, currentFace.face, currentBuilding.streetNumber).then((success: boolean) => {
            if (!success) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: "No se pudo eliminar el edificio",
                    animation: 2
                }))
                return
            }
            refreshHTHTerritoryHandler()
        })
    }

    return (
        <Modal
            backdrop={'static'}
            backdropClassName={''}
            contentClassName={isDarkMode ? 'bg-secondary' : ''}
            keyboard={false}
            onHide={() => closeBuildingModalHandler ? closeBuildingModalHandler() : navigate('/')}
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
                        {(user.isAdmin || currentBuilding.creatorId === user.id) &&
                            <>
                                &nbsp; &nbsp;
                                <BsTrash
                                    className={'pointer mb-1'}
                                    onClick={() => openDeleteBuildingModal()}
                                />
                            </>
                        }
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
                                    const currentHousehold = currentBuilding.households.find(x => x.level === level && x.doorNumber === doorNumber)
                                    if (!currentHousehold) return <></>
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
                    {!!currentBuilding.manager &&
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
                                refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                                setIsLoading={setIsLoading}
                                streetNumber={currentBuilding.streetNumber}
                                territoryNumber={territoryNumber}
                            />
                        </div>
                    }

                    {isLoading ?
                        <Loading mb={'15px'} />
                        :
                        <button className={'btn btn-general-blue btn-size12 w-100 mx-auto mt-1 mb-3'}
                            onClick={() => closeBuildingModalHandler ? closeBuildingModalHandler() : navigate('/')}
                            style={{ maxWidth: '300px' }}
                        >
                            Cerrar
                        </button>
                    }

                </div>
            </Modal.Body>
        </Modal>
    )
}
