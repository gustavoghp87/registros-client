import { FC, Fragment, useState } from 'react'
import { FloatingLabel, Form, ListGroup } from 'react-bootstrap'
import { Hr } from '../commons'
import { HTHBuildingModal } from '.'
import { timeConverter } from '../../services'
import { typeHTHBuilding, typeHTHTerritory, typePolygon, typeRootState, typeTerritoryNumber } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    refreshHTHTerritoryHandler: () => void
    territoryHTH: typeHTHTerritory
    territoryNumber: typeTerritoryNumber
}

export const HTHAllBuildings: FC<propsType> = ({
    refreshHTHTerritoryHandler, territoryHTH, territoryNumber
}) => {
    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const [currentBuilding, setCurrentBuilding] = useState<typeHTHBuilding|null>(null)
    const [currentFace, setCurrentFace] = useState<typePolygon|null>(null)
    const [buildingAddress, setBuildingAddress] = useState("")
    const [selectedAddress, setSelectedAddress] = useState("")

    const closeBuildingModalHandler = () => {
        setCurrentBuilding(null)
        setCurrentFace(null)
        setSelectedAddress("")
    }

    return (
        <>
            {!!currentFace && !!currentBuilding &&
                <HTHBuildingModal
                    congregation={user.congregation}
                    currentBuilding={currentBuilding}
                    currentFace={currentFace}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryNumber}
                    closeBuildingModalHandler={closeBuildingModalHandler}
                />
            }
            {!!territoryHTH?.map.polygons?.some(x => !!x.buildings?.length) ?
                <>
                <Hr styles={{ marginTop: '100px', marginBottom: '30px' }} />
                <div className={'container'} style={{ maxWidth: '400px' }}>
                    <h1 className={`text-center mb-5 ${isDarkMode ? 'text-white' : ''}`}>
                        BUSCAR EDIFICIO
                    </h1>
                    <FloatingLabel
                        className={'mb-3 text-dark'}
                        label={"Dirección"}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'text'}
                            value={buildingAddress}
                            onChange={e => setBuildingAddress((e.target as HTMLInputElement).value)}
                            autoFocus
                        />
                    </FloatingLabel>
                    <ListGroup as="ul">
                        {territoryHTH.map.polygons.map(p => <Fragment key={p.id}>
                            {!!p.buildings?.length && p.buildings.map(b => <Fragment key={b.streetNumber}>
                                {`${p.street} ${b.streetNumber}`.toLowerCase().includes(buildingAddress.toLowerCase()) && (
                                    () => {
                                        const ultVez = b.households.map(h => h.onDates?.length ? h.onDates[h.onDates.length - 1] : 0).sort((a, b) => a - b)?.at(-1)
                                        return (
                                            <ListGroup.Item key={b.streetNumber}
                                                as={'li'}
                                                className={'pointer bg-light bg-gradient hover-primary'}
                                                active={selectedAddress === `${p.street} ${b.streetNumber}`}
                                                onClick={() => {
                                                    setSelectedAddress(`${p.street} ${b.streetNumber}`)
                                                    setCurrentFace(p)
                                                    setCurrentBuilding(b)
                                                }}
                                            >
                                                <div className='row py-2'>
                                                    <h5 className='text-center'>
                                                        {p.street} {b.streetNumber}
                                                    </h5>
                                                </div>
                                                <div className='row text-center'>
                                                    <span className='text-center'>
                                                        {ultVez ? timeConverter(ultVez) : '-'}
                                                    </span>
                                                </div>
                                            </ListGroup.Item>
                                        )
                                    })()    
                                }
                            </Fragment>)}
                        </Fragment>)}
                    </ListGroup>
                </div>
                </>
                :
                <h4> No hay edificios cargados en este territorio </h4>
            }
        </>
    )
}