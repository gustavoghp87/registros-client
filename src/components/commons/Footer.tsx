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
                    height: isMobile ? '170px' : '160px',
                    marginTop: '200px',
                    paddingBottom: '20px',
                    paddingTop: isMobile ? '10px' : '20px'
                }}
            >
                <div style={{
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: isMobile ? '1.2rem' : '2.2rem',
                    justifyContent: 'center',
                    margin: 'auto',
                    width: '100%'
                }}>
                    <a href={'https://misericordiaweb.com/'} style={{ color: 'white', fontWeight: 'bolder', textDecorationLine: 'none' }}>
                        Misericordia Web
                    </a>
                </div>

                <h5 className={'text-center text-white mt-2 mb-3'}> Comunicación: misericordiawebapp@gmail.com </h5>

                <div className={'text-center mt-2'}>

                    <Link to={'/privacidad'} className={`${isMobile ? '' : 'me-2'} text-white`}> Política de Privacidad </Link>

                    {isMobile && <br/>}
                    
                    <Link to={'/servicio'} className={`${isMobile ? '' : 'ms-2'} text-white`}> Términos de Uso </Link>

                    <span className={'text-white'} style={{ fontSize: '1rem' }}>&nbsp;&nbsp;Versión 5.2</span>

                </div>
            </div>
        </>
    )
}
