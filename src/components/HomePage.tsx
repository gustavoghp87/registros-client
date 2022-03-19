import { useAuth } from '../context/authContext'
import { isMobile } from '../services/functions'
import { H2 } from './css/css'
import { typeUser } from '../models/typesUsuarios'
import { generalBlue } from './_App'

export const HomePage = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const isDarkMode: string = props.isDarkMode
    
    return (
    <>
        <H2 className={isDarkMode ? 'text-white' : ''}
            style={{ marginTop: '50px' }}
        >
            BIENVENIDOS
        </H2>

        <a href={user && user.isAuth ? "/index" : "/login"} style={{ textDecoration: 'none' }}>
            <h3 style={{
                margin: '30px auto',
                color: generalBlue,
                textAlign: 'center',
                backgroundColor: 'lightgray',
                padding: '32px 0',
                maxWidth: isMobile ? '100%' : '1136px',
                fontSize: isMobile ? '' : '2.7rem'
            }}>
                ENTRAR
            </h3>
        </a>

        <div style={{ textAlign: 'center', marginTop: isMobile ? '30px' : '40px' }}>
            
            <img src={"/img/world.png"} alt={"world"} style={{ margin: '15px auto 0 auto', maxWidth: '100%' }} />
        

            <div style={{
                textAlign: 'center', 
                backgroundColor: 'lightgray', 
                padding: '50px 0', 
                maxWidth: isMobile ? '100%' : '1136px',
                margin: 'auto'
            }}>

                <a href={"https://jw.org/es"} target={'_blank'} rel={'noopener noreferrer'}
                    style={{ textDecoration: 'none' }}>
                    
                    <h2 style={{ color: generalBlue, fontSize: isMobile ? '1.5rem' : '2rem' }}>
                        VISITAR JW.ORG
                    </h2>
                
                    <img src={"/img/jw.png"} alt={"jw"} style={{ margin: '15px auto', maxWidth: '100%' }} />
                
                </a>
            </div>
        </div>
    </>
    )
}
