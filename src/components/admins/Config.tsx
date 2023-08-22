import { H2 } from "../commons"
import { goToTop } from "../../services"
import { typeRootState } from "../../models"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { Container, FloatingLabel, Form } from "react-bootstrap"

const btnClasses = 'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-0'

const btnStyles = { width: '350px', minHeight: '60px' }

export const Config = () => {
    const { config, isDarkMode } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode
    }))
    const [showSetNumberOfTerritories, setShowSetNumberOfTerritories] = useState(false)
    const navigate = useNavigate()

    useEffect(() => goToTop(), [])

    return (<>
    
        <H2 title="Configuración de la Aplicación (en construcción)" />

        {!showSetNumberOfTerritories && <>
            {!config.numberOfTerritories &&
                <button className={btnClasses} style={btnStyles} onClick={() => setShowSetNumberOfTerritories(true)}>
                    Cargar cantidad de Territorios
                </button>
            }

            <button className={btnClasses} style={btnStyles}>
                Cargar Excel de Telefónica
            </button>

            <button className={btnClasses} style={btnStyles}>
                Cargar dirección de Tablero Google
            </button>

            <button className={btnClasses} style={btnStyles}
                onClick={() => navigate('/gmail')}
            >
                Renovar credenciales de la API de Gmail
            </button>

            <h2 className={isDarkMode ? 'text-white' : ''}> Establecer localidad </h2>

            <h2 className={isDarkMode ? 'text-white' : ''}> Establecer punto central del territorio </h2>

            <h2 className={isDarkMode ? 'text-white' : ''}> Duración de cookie de acceso: 3 meses </h2>
        </>}
        
        {showSetNumberOfTerritories &&
            <SetNumberOfTerritories />
        }

    </>)
}

const SetNumberOfTerritories = () => {
    const [numberOfTerritories, setNumberOfTerritories] = useState(0)

    const setNumberOfTerritoriesHandler = () => {

    }

    return (
        <Container>
            <FloatingLabel
                className={'mb-3 text-dark'}
                label={"Elegir la cantidad de territorios"}
            >
                <Form.Control
                    className={'form-control'}
                    type={'number'}
                    value={numberOfTerritories ? numberOfTerritories : ''}
                    placeholder={"Elegir la cantidad de territorios"}
                    onChange={e => setNumberOfTerritories(parseInt((e.target as HTMLInputElement).value))}
                    onKeyDown={e => e.key === 'Enter' ? setNumberOfTerritoriesHandler() : null }
                />
            </FloatingLabel>

            <button
                className={`btn btn-general-blue d-block w-100 mt-3`}
                style={{ fontWeight: 'bolder', height: '50px' }}
                onClick={setNumberOfTerritoriesHandler}
            >
                Aceptar
            </button>
        </Container>
    )
}
