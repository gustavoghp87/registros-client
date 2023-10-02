import { DOMAIN } from '../../app-config'
import { generalBlue } from '../../constants'
import { Link } from 'react-router-dom'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'

export const Footer = () => {
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    
    return (
        <>
            <div className={'main-footer'}
                style={{
                    backgroundColor: generalBlue,
                    height: isMobile ? '180px' : '170px',
                    marginTop: '200px',
                    paddingBottom: '20px',
                    paddingTop: isMobile ? '10px' : '20px'
                }}
            >
                <div style={{
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: isMobile ? '1.4rem' : '2.2rem',
                    justifyContent: 'center',
                    margin: 'auto',
                    width: '100%'
                }}>
                    <a href={DOMAIN} style={{ color: 'white', fontWeight: 'bolder', textDecorationLine: 'none' }}>
                        Misericordia Web
                        <span className={'text-white ms-2'} style={{ fontSize: isMobile ? '0.7rem' : '0.9rem', fontWeight: 'normal' }}>
                            v 6.5
                        </span>
                    </a>
                </div>

                <h5 className={'text-center text-white mt-2 mb-3'}>
                    <span style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
                        Comunicación: misericordiawebapp@gmail.com
                    </span>
                </h5>

                <div className={'text-center mt-2'}>

                    <Link to={'/privacidad'} className={`${isMobile ? '' : 'me-2'} text-white`}> Política de Privacidad </Link>

                    {isMobile && <br/>}
                    
                    <Link to={'/servicio'} className={`${isMobile ? '' : 'ms-2'} text-white`}> Términos de Uso </Link>

                    

                </div>
            </div>
        </>
    )
}
