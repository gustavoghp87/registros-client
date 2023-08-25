import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { createHTHTerritoriesService } from '../../../services'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { H2, Hr } from '../../commons'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../../store'
import { useDispatch } from 'react-redux'

type propsType = {
    setShowCreateHthTerritories: Dispatch<SetStateAction<boolean>>
}

export const ConfigCreateHTHTerritories: FC<propsType> = ({ setShowCreateHthTerritories }) => {
    const [lat, setLat] = useState(0)
    const [lng, setLng] = useState(0)
    const [numberOfTerritories, setNumberOfTerritories] = useState(0)
    // const config = useSelector((state: typeRootState) => state.config)
    const dispatch = useDispatch()

    const createHthTerritoriesHandler = async () => {
        if (!numberOfTerritories || !Number.isInteger(numberOfTerritories) || !lat || !lng) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: 'Crear territorios',
            message: `Se van a crear ${numberOfTerritories} territorios para casa en casa y el punto centrar inicial va a ser latitud ${lat}, longitud ${lng}`,
            execution: async () => {
                dispatch(showLoadingModalReducer())
                const success = await createHTHTerritoriesService(numberOfTerritories, lat < 0 ? lat : lat*-1, lng < 0 ? lng : lng*-1)
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

            <Container style={{ maxWidth: '400px' }}>

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

                <Hr />

                <h5 className={'text-center my-4'}>
                    Establecer las coordenadas de algún punto central del territorio de la congregación
                </h5>

                <h5 className={'text-center mb-5'}>
                    Este punto va a ser el inicial antes de dibujar las caras de las manzanas. Se pueden conseguir en Google Maps.
                </h5>

                <FloatingLabel
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
                </FloatingLabel>

                <button
                    className={'btn btn-general-blue d-block w-100 mt-3'}
                    style={{ fontWeight: 'bolder', height: '50px' }}
                    onClick={createHthTerritoriesHandler}
                    disabled={!numberOfTerritories || !Number.isInteger(numberOfTerritories) || numberOfTerritories > 200 || !lat || !lng}
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
        </Container>
    )
}
