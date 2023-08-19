import { H2 } from "../commons"
import { subirAlTop } from "../../services"
import { typeRootState } from "../../models"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"

export const Config = () => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)
    const navigate = useNavigate()

    useEffect(() => {
        subirAlTop()
    }, [])

    return (<>
    
        <H2 title="Configuración de la Aplicación (en construcción)" />
        
        <button className={'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-0'} style={{ width: '350px' }}>
            Cargar cantidad de Territorios
        </button>

        <button className={'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-0'} style={{ width: '350px' }}>
            Cargar Excel de Telefónica
        </button>

        <button className={'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-0'} style={{ width: '350px' }}>
            Cargar dirección de Tablero Google
        </button>

        <button className={'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-0'} style={{ width: '350px' }}
            onClick={() => navigate('/gmail')}
        >
            Renovar credenciales de la API de Gmail
        </button>

        <h2 className={isDarkMode ? 'text-white' : ''}> Establecer localidad </h2>

        <h2 className={isDarkMode ? 'text-white' : ''}> Establecer punto central del territorio </h2>

        <h2 className={isDarkMode ? 'text-white' : ''}> Duración de cookie de acceso: 3 meses </h2>

    </>)
}
