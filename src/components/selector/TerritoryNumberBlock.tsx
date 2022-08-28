import { NavigateFunction, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { Row } from 'react-bootstrap'
import { WeatherAndForecast } from '../commons'
import { typeRootState } from '../../models'

export const TerritoryNumberBlock = (props: any) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const navigate: NavigateFunction = useNavigate()
    const classes: string = props.classes
    const showForecast: boolean = props.showForecast || false
    const territories: number[] = props.territories
    const url: string = props.url

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
                    {showForecast && <WeatherAndForecast showForecast={true} />}
                </Row>
            </div>
        </div>
    )
}