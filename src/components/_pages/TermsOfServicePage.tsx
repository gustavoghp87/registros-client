import { subirAlTop } from '../../services'
import { typeRootState } from '../../models'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export const TermsOfServicePage = () => {
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)

    useEffect(() => subirAlTop(), [])

    return (
        <div className={isDarkMode ? 'text-white' : ''} style={{ marginTop: '80px' }}>

            <h2 className={'text-center'}>
                <strong>Términos y Condiciones de Uso</strong>
            </h2>
        

            <br/>
            <p><strong>INFORMACIÓN RELEVANTE</strong></p>
            
            <p>Es requisito necesario para la creación de una cuenta de usuario en este sitio que lea y acepte los siguientes Términos y Condiciones que a continuación se redactan.</p>
            
            <p>El usuario puede elegir y cambiar la clave para su acceso de administración de la cuenta en cualquier momento, en caso de que se haya registrado. https://www.misericordiaweb.com no asume la responsabilidad en caso de que entregue dicha clave a terceros.</p>
            
            <p>Este sitio web no incluye ventas ni transacciones comerciales de ningún tipo.</p>
            

            
            <br/>
            <p><strong>PRIVACIDAD</strong></p>
            
            <p>Este sitio https://www.misericordiaweb.com garantiza que la información personal que usted envía cuenta con la seguridad necesaria. Los datos ingresados por el usuario no serán entregados a terceros, salvo que deba ser revelada en cumplimiento a una orden judicial o requerimientos legales.</p>
            
            <p>La suscripción a boletines de correos electrónicos publicitarios es voluntaria y podría ser seleccionada al momento de crear su cuenta.</p>
            
            <p>Misericordia Web reserva los derechos de cambiar o de modificar estos términos sin previo aviso.</p>
            
        </div>
    )
}