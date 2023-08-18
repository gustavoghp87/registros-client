import { H2 } from "../commons"

export const Config = () => {

    return (<>
    
        <H2 title="Configuración de la Aplicación" />
        
        <button className={'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-0'} style={{ width: '350px' }}>
            Cargar cantidad de Territorios
        </button>

        <button className={'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-0'} style={{ width: '350px' }}>
            Cargar Excel de Telefónica
        </button>

        <button className={'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-0'} style={{ width: '350px' }}>
            Cargar dirección de Tablero
        </button>

        Duración de cookie de acceso: 3 meses
    
    </>)
}
