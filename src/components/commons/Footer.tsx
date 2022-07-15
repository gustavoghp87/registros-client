import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'
import { generalBlue } from '../_App'

export const Footer = () => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    
    return (
        <>
            <div className={'main-footer'}
                style={{
                    backgroundColor: generalBlue,
                    height: isMobile ? '120px' : '120px',
                    marginTop: '200px',
                    paddingTop: isMobile ? '10px' : '20px',
                    paddingBottom: '20px'
                }}
            >
                <div style={{
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: isMobile ? '1.6rem' : '2.2rem',
                    justifyContent: 'center',
                    //height: '100%',
                    margin: 'auto',
                    width: '100%'
                }}>
                    <a href={'https://misericordiaweb.com/'} style={{ color: 'white', textDecorationLine: 'none', fontWeight: 'bolder' }}>
                        misericordiaweb.com
                    </a>
                </div>

                <div className='text-center mt-2'>
                    <a className={`${isMobile ? '' : 'mr-2'} text-white`} href={'/privacidad'}> Política de Privacidad </a>
                    {isMobile && <br/>}
                    <a className={`${isMobile ? '' : 'ml-2'} text-white`} href={'/servicio'}> Términos de Uso </a>
                </div>

            </div>
        </>
    )
}
