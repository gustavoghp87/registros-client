import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import { FloatingLabel, Form, ListGroup } from 'react-bootstrap'
import { getFreeHouseholds, timeConverter } from '../../services'
import { HTHBuildingModal } from '.'
import { typeHTHBuilding, typeHTHTerritory, typePolygon, typeRootState, typeTerritoryNumber } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    refreshHTHTerritoryHandler: () => void
    territoryHTH: typeHTHTerritory
    territoryNumber: typeTerritoryNumber
}

export const HTHAllBuildings: FC<propsType> = ({ refreshHTHTerritoryHandler, territoryHTH, territoryNumber }) => {
    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const [buildingAddress, setBuildingAddress] = useState("")
    const [currentBuilding, setCurrentBuilding] = useState<typeHTHBuilding|null>(null)
    const [currentFace, setCurrentFace] = useState<typePolygon|null>(null)
    const [selectedAddress, setSelectedAddress] = useState("")

    const allBuildings: (typeHTHBuilding & { face: typePolygon })[] = useMemo(() =>
        territoryHTH.map.polygons
            .map(p => p.buildings ? p.buildings.map(b => ({ ...b, face: p})) : [])
            .flat()
            .sort((a, b) => a.face.street.localeCompare(b.face.street) || (a.streetNumber - b.streetNumber))
    , [territoryHTH.map.polygons])

    const closeBuildingModalHandler = () => {
        setCurrentBuilding(null)
        setCurrentFace(null)
        setSelectedAddress("")
    }

    useEffect(() => {
        setCurrentFace(x => x ?
            territoryHTH.map.polygons.find(p => p.id === x.id) ?? null
            :
            x
        )
    }, [territoryHTH])

    useEffect(() => {
        setCurrentBuilding(x => x ?
            currentFace?.buildings?.find(b => b.streetNumber === x.streetNumber) ?? null
            :
            x
        )
    }, [currentFace])

    return (<>
        {currentFace && currentBuilding &&
            <HTHBuildingModal
                closeBuildingModalHandler={closeBuildingModalHandler}
                congregation={user.congregation}
                currentBuilding={currentBuilding}
                currentFace={currentFace}
                refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                territoryNumber={territoryNumber}
            />
        }

        {!!allBuildings?.length ?
            <>
            <div className={'container maxw-400'}>
                <h1 className={`text-center mb-5 ${isDarkMode ? 'text-white' : ''}`}>
                    BUSCAR EDIFICIO
                </h1>
                <FloatingLabel
                    className={'mb-3 text-dark'}
                    label={"Dirección"}
                >
                    <Form.Control
                        type={'text'}
                        className={'form-control'}
                        placeholder={""}
                        value={buildingAddress}
                        onChange={e => setBuildingAddress((e.target as HTMLInputElement).value)}
                        // autoFocus
                    />
                </FloatingLabel>
                <ListGroup as={'ul'}>
                    {allBuildings.map(b =>
                        <Fragment key={b.face.street + "-" + b.streetNumber}>
                            {`${b.face.street} ${b.streetNumber}`.toLowerCase().includes(buildingAddress.toLowerCase()) && (
                                () => {
                                    const lastTime = b.households
                                        .map(h => h.onDates?.length ? h.onDates[h.onDates.length - 1] : 0)
                                        .sort((a, b) => a - b)?.at(-1)
                                    return (
                                        <ListGroup.Item
                                            as={'li'}
                                            className={'pointer bg-light bg-gradient hover-primary'}
                                            active={selectedAddress === `${b.face.street} ${b.streetNumber}`}
                                            onClick={() => {
                                                setSelectedAddress(`${b.face.street} ${b.streetNumber}`)
                                                setCurrentFace(b.face)
                                                setCurrentBuilding(b)
                                            }}
                                        >
                                            <div className='row py-2'>
                                                <h5 className='text-center'>
                                                    {b.face.street} {b.streetNumber}
                                                </h5>
                                            </div>
                                            <div className='row text-center'>
                                                <span className='text-center'>
                                                    {getFreeHouseholds(b)} libres | {lastTime ? timeConverter(lastTime) : '-'}
                                                </span>
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })()
                            }
                        </Fragment>
                    )}
                </ListGroup>
            </div>
            </>
            :
            <h4 className={`text-center mt-4 ${isDarkMode ? 'text-white' : ''}`}>
                No hay Edificios cargados en este Territorio
            </h4>
        }
    </>)
}
