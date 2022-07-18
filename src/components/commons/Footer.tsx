import { useSelector } from 'react-redux'
import { generalBlue } from '../../config'
import { typeRootState } from '../../store/store'

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
                    fontSize: isMobile ? '1.6rem' : '2.2rem',
                    justifyContent: 'center',
                    //height: '100%',
                    margin: 'auto',
                    width: '100%'
                }}>
                    <a href={'https://misericordiaweb.com/'} style={{ color: 'white', fontWeight: 'bolder', textDecorationLine: 'none' }}>
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
