import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { generalBlue } from '../../config'
import { typeRootState } from '../../models'

export const Footer = () => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    
    return (
        <>
            <div className={'main-footer'}
                style={{
                    backgroundColor: generalBlue,
                    height: '120px',
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
                        misericordiaweb.com
                    </a>
                </div>

                <div className={'text-center mt-2'}>

                    <Link to={'/privacidad'} className={`${isMobile ? '' : 'mr-2'} text-white`}> Política de Privacidad </Link>

                    {isMobile && <br/>}
                    
                    <Link to={'/servicio'} className={`${isMobile ? '' : 'ml-2'} text-white`}> Términos de Uso </Link>
                </div>

            </div>
        </>
    )
}
