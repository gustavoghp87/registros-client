import { FC } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { Row } from 'react-bootstrap'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'
import { WeatherAndForecast } from '../commons'

type propsType = {
    classes: string
    showForecast: boolean
    territories: number[]
    url: string
}

export const TerritoryNumberBlock: FC<propsType> = ({ classes, showForecast, territories, url }) => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const navigate: NavigateFunction = useNavigate()

    return (
        <div className={`card card-body mt-4 ${isDarkMode ? 'bg-dark' : ''}`}>
            <div className={'container pt-0 mb-0'}>
                <Row
                    style={{
                        justifyContent: 'space-evenly',
                        padding: isMobile ? '20px 10px' : '40px'
                    }}
                >
                    {!!territories?.length && territories.map((territory: number) =>
                        <button key={territory}
                            className={`btn ${classes}`}
                            onClick={() => navigate(`${url}/${territory.toString()}`)}
                            style={{
                                borderRadius: '15px',
                                height: isMobile ? '60px' : '100px',
                                margin: '0 1% 40px 1%',
                                width: isMobile ? '90px' : '120px'
                            }}
                        >
                            <h2 className={'h-100 mt-1 mx-auto'}
                                style={{
                                    fontFamily: '"Arial Black", Gadget, sans-serif',
                                    fontSize: isMobile ? '1.8rem' : '2.3rem',
                                    padding: isMobile ? '5%' : '20%'
                                }}
                            >
                                {territory}
                            </h2>
                        </button>
                    )}
                    {showForecast &&
                        <WeatherAndForecast showWeather={false} showForecast0={true} />
                    }
                </Row>
            </div>
        </div>
    )
}
