import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NavigateFunction, useNavigate } from 'react-router'
import { H2, Hr, WeatherAndForecast } from '../commons'
import { generalBlue, typeRootState } from '../../models'

export const HomePage = () => {

    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const navigate: NavigateFunction = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <WeatherAndForecast showWeather={true} />

            <Hr />
            
            <H2 title={"BIENVENIDOS"} mt={'50px'} />

            <H2 title={"A"} mt={'0'} />

            <H2 title={"MISERICORDIA WEB"} mt={'0'} />

            <div className={'pointer my-5'}
                onClick={() => navigate(user && user.isAuth ? '/selector' : '/acceso')}
                style={{ textDecoration: 'none' }}
            >
                <h3 style={{
                    backgroundColor: 'lightgray',
                    color: generalBlue,
                    fontSize: isMobile ? '2.4rem' : '2.7rem',
                    margin: '40px auto',
                    maxWidth: isMobile ? '100%' : '1136px',
                    padding: '32px 0',
                    textAlign: 'center'
                }}>
                    ENTRAR
                </h3>
            </div>

        </>
    )
}
