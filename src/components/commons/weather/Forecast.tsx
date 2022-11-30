import { useSelector } from 'react-redux'
import { typeForecast, typeRootState } from '../../../models'

export const Forecast = (props: any) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const forecasts: typeForecast[] = props.forecasts
    // chance={(forecast.pop || 0) * 100}

    const divStyles = {
        display: isMobile ? undefined : 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginTop: isMobile ? undefined : '2.1rem',
        marginBottom: '2.5rem',
        padding: isMobile ? '.2rem' : undefined,
        width: isMobile ? '100%' : undefined
    }

    console.log([...forecasts]?.filter(x => x.date.dateDay === new Date().getDate() && x.date.hour > 6))

    return (
        <div className={`text-center p-0 animate__animated animate__bounceInDown ${isMobile ? 'mt-0' : 'mt-5'}`}>

            {!![...forecasts]?.filter(x => x.date.dateDay === new Date().getDate() && x.date.hour > 6)?.length &&
                <>
                    <h1 className={isDarkMode ? 'text-white' : ''}> Hoy </h1>
                    <div style={{ ...divStyles }}>
                        {[...forecasts]?.filter(x => x.date.dateDay === new Date().getDate() && x.date.hour > 6).map((forecast: typeForecast) => (
                            <ForecastCard key={`${forecast.date?.day}-${forecast.date?.hour}`} forecast={forecast} />
                        ))}
                    </div>
                </>
            }

            <h1 className={isDarkMode ? 'text-white' : ''}> Mañana </h1>

            <div style={{ ...divStyles }}>
                {[...forecasts]?.filter(x => x.date.dateDay === new Date().getDate() + 1 && x.date.hour > 6).map((forecast: typeForecast) => (
                    <ForecastCard key={`${forecast.date?.day}-${forecast.date?.hour}`} forecast={forecast} />
                ))}
            </div>

            <h1 className={isDarkMode ? 'text-white' : ''}>
                {forecasts.find(x => x.date.dateDay === new Date().getDate() + 2 && x.date.hour > 6)?.date.weekday}
            </h1>

            <div style={{ ...divStyles }}>
                {[...forecasts]?.filter(x => x.date.dateDay === new Date().getDate() + 2 && x.date.hour > 6).map((forecast: typeForecast) => (
                    <ForecastCard key={`${forecast.date?.day}-${forecast.date?.hour}`} forecast={forecast} />
                ))}
            </div>

        </div>
    )
}

const ForecastCard = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile
    }))
    const forecast: typeForecast = props.forecast

    return (
        <div
            className={forecast.temperatures > 29 ? 'animate__animated animate__pulse animate__infinite	infinite' : ''}
            style={{
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: '0.25rem',
                boxShadow: 'rgba(0, 0, 0, 0.05) 0 6px 24px 0, rgba(0, 0, 0, 0.08) 0 0 0 1px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                gap: '0.5rem',
                justifyContent: 'center',
                padding: isMobile ? '.5rem .75rem' : '1rem 0.75rem',
                transition: 'all 0.2s ease',
                width: isMobile ? '100%' : '200px'
            }}
        >
            {/* <h6 className={isMobile ? 'my-auto' : undefined} style={{ order: isMobile ? 2 : undefined }}>
                {forecast.date?.weekday}
            </h6> */}
            
            <h6 className={isMobile ? 'my-auto' : ''} style={{ order: isMobile ? 3 : undefined }}>
                {forecast.date?.hour < 12 ? '0' : ''}{forecast.date?.hour}:00 hs{isMobile ? ':' : ''}
            </h6>

            {isMobile ?
                <div style={{ order: 1, width: isMobile ? '40px' : undefined }}>
                    {forecast.icon}
                </div>
                :
                <> {forecast.icon} </>
            }

            <h6 className={'mt-2 d-block align-items-end'} style={{ order: isMobile ? 4 : undefined }}>
                {forecast.temperatures}ºC
            </h6>

            <p className={`${forecast.pop ? '' : 'text-white'} ${isMobile ? 'my-auto' : ''}`}
                style={{ order: isMobile ? 5 : undefined }}
            >
                {forecast.pop ? `(Lluvia: ${Math.round(forecast.pop * 100)}%)` : ''}
            </p>
        </div>
    )
}
