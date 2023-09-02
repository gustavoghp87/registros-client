import { ConfigCreateHTHTerritoriesMap } from './ConfigCreateHTHTerritoriesMap'
import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { createHTHTerritoriesService } from '../../../services'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { H2 } from '../../commons'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../../store'
import { useDispatch } from 'react-redux'

type propsType = {
    setShowCreateHthTerritories: Dispatch<SetStateAction<boolean>>
}

export const ConfigCreateHTHTerritories: FC<propsType> = ({ setShowCreateHthTerritories }) => {
    const [map, setMap] = useState<google.maps.Map|null>(null)
    const [numberOfTerritories, setNumberOfTerritories] = useState(0)
    const dispatch = useDispatch()

    const createHthTerritoriesHandler = async () => {
        const centerLat = map?.getCenter()?.lat()
        const centerLng = map?.getCenter()?.lng()
        if (!numberOfTerritories || !Number.isInteger(numberOfTerritories) || !centerLat || !centerLng)
            return
        if (numberOfTerritories > 200) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Error",
                message: "Se permiten hasta 200 territorios",
                animation: 2
            }))
            return
        }
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: 'Crear territorios',
            message: `Se van a crear ${numberOfTerritories} territorios para casa en casa y el punto centrar inicial va a ser latitud ${centerLat}, longitud ${centerLng}`,
            execution: async () => {
                dispatch(showLoadingModalReducer())
                const success = await createHTHTerritoriesService(numberOfTerritories, centerLat, centerLng)
                dispatch(hideLoadingModalReducer())
                if (!success) {
                    setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Algo falló",
                        message: "No se pudieron crear los territorios. Mirar los logs.",
                        animation: 2
                    })
                    return
                }
                window.location.reload()
            }
        }))
    }

    return (
        <Container>

            <H2 title={'CREAR LOS TERRITORIOS PARA CASA EN CASA'} />

            <Container className={'maxw-400'}>
                <FloatingLabel
                    className={'mt-5 mb-4 text-dark'}
                    label={"Elegir la cantidad de territorios"}
                >
                    <Form.Control
                        className={'form-control'}
                        type={'number'}
                        value={numberOfTerritories ? numberOfTerritories : ''}
                        onChange={e => setNumberOfTerritories(parseInt((e.target as HTMLInputElement).value))}
                        autoFocus
                    />
                </FloatingLabel>
            </Container>

            {!!numberOfTerritories && <>

                <ConfigCreateHTHTerritoriesMap
                    setMap={setMap}
                />

                <Container className={'maxw-400'}>
                    {/* <FloatingLabel
                        className={'mb-3 text-dark'}
                        label={"Latitud"}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'number'}
                            value={lat ? lat : ''}
                            onChange={e => setLat(parseFloat((e.target as HTMLInputElement).value))}
                        />
                    </FloatingLabel>

                    <FloatingLabel
                        className={'mb-3 text-dark'}
                        label={"Longitud"}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'number'}
                            value={lng ? lng : ''}
                            onChange={e => setLng(parseFloat((e.target as HTMLInputElement).value))}
                            onKeyDown={e => e.key === 'Enter' ? createHthTerritoriesHandler() : null }
                        />
                    </FloatingLabel> */}

                    <button
                        className={'btn btn-general-blue d-block w-100 mt-5'}
                        style={{ fontWeight: 'bolder', height: '50px' }}
                        onClick={createHthTerritoriesHandler}
                    >
                        Aceptar
                    </button>

                    <button
                        className={'btn btn-general-red d-block w-100 mt-3'}
                        style={{ fontWeight: 'bolder', height: '50px' }}
                        onClick={() => setShowCreateHthTerritories(false)}
                    >
                        Cancelar
                    </button>
                </Container>
            </>}
        </Container>
    )
}
