import { generalBlue, typeRootState } from '../../models'
import { H2, WeatherAndForecast } from '../commons'
import { NavigateFunction, useNavigate } from 'react-router'
import { goToTop } from '../../services'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export const HomePage = () => {
    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const navigate: NavigateFunction = useNavigate()

    useEffect(() => {
        goToTop()
    }, [])

    return (
        <>
            <WeatherAndForecast showWeather={true} showForecast0={false} />

            <H2 title={"BIENVENIDOS"} mt={'50px'} />

            <H2 title={"A"} mt={'0'} />

            <H2 title={"MISERICORDIA WEB"} mt={'0'} />

            <div className={'my-5'}>
                <h3 className={'pointer rounded-3'}
                    onClick={() => navigate(user && user.isAuth ? '/selector' : '/acceso')}
                    onMouseOver={e => (e.target as HTMLElement).style.backgroundColor = '#25457d'}
                    onMouseLeave={e => (e.target as HTMLElement).style.backgroundColor = generalBlue}
                    style={{
                        backgroundColor: generalBlue,
                        color: 'white',
                        fontSize: isMobile ? '2.2rem' : '2.7rem',
                        margin: '40px auto',
                        maxWidth: isMobile ? '95%' : '500px',
                        padding: isMobile ? '16px 0' : '32px 0',
                        textAlign: 'center'
                    }}
                >
                    ENTRAR
                </h3>
            </div>
        </>
    )
}
