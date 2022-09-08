import { useSelector } from 'react-redux'
import { typeRootState } from '../../../models'

export const Weather = (props: any) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const chance: number = props.chance
    const feelsLike: number = props.feelsLike
    const icon: string = props.icon
    const location: string = props.location
    const rain: number = props.rain
    const temperature: number = props.temperature

    return (
        <div className={`animate__animated animate__bounceInDown ${isDarkMode ? 'text-white' : ''}`}>
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    gap: isMobile ? undefined : '0.5rem',
                    justifyContent: 'center',
                    marginTop: isMobile ? 0 : '20px'
                }}
            >
                <div className={'w-100 row d-flex justify-content-center'}>
                    <div className={'p-0'} style={{ order: isMobile ? 2 : 1, width: isMobile ? undefined : '22%' }}>
                        <div className={'d-flex align-items-center flex-column'}>
                            <h1 style={{ fontSize: isMobile ? '4rem' : '8rem', fontWeight: 100 }}>
                                {temperature}
                                <small>ºC</small>
                            </h1>
                            <p style={{ fontSize: isMobile ? '1.2rem' : '2rem', fontWeight: 500 }}>
                                {location}
                            </p>
                        </div>
                    </div>
                    <div className={'p-0'} style={{ order: isMobile ? 1 : 2, maxWidth: isMobile ? '100px' : '160px' }} tabIndex={isMobile ? 1 : 2}>
                        {icon}
                    </div>
                </div>
                {isMobile ?
                    <div className={'text-center'}>
                        <h6> Sensación térmica: {feelsLike}°C </h6>
                        <h6> Precipitaciones: {rain}mm </h6>
                        <h6> Chance de lluvia: {chance}% </h6>
                    </div>
                    :
                    <ul style={{ 
                        display: 'flex',
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        flexWrap: isMobile ? 'wrap' : undefined,
                        justifyContent: isMobile ? 'center' : '',
                        gap: isMobile ? '0.25rem 1rem' : ''
                    }}>
                        <li className={'mx-4'}> Sensación térmica: {feelsLike}ºC </li>
                        <li className={'mx-4'}> Precipitaciones: {rain}mm </li>
                        <li className={'mx-4'}> Chance de lluvia: {chance}% </li>
                    </ul>
                }
            </div>
        </div>
    )
}
