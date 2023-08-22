import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { FC } from 'react'
import { generalRed } from '../../constants'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    isShowingAll: boolean
    isShowingStatistics: boolean
    setIsShowingAllStatesHandler: (value: boolean) => void
    setIsShowingStatisticsHandler: () => void
}

export const Col0b: FC<propsType> = ({ isShowingAll, isShowingStatistics, setIsShowingAllStatesHandler, setIsShowingStatisticsHandler }) => {
    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    let radios: any[] = []

    if (isMobile)
        radios = user.isAdmin ? 
            [
                { name: isShowingAll ? 'Ver no pred' : 'Viendo no pred', value: '1' },
                { name: isShowingAll ? 'Viendo todos' : 'Ver todos', value: '2' },
                { name: isShowingStatistics ? 'Viendo estad' : 'Ver estad', value: '3' }
            ]
            :
            [
                { name: isShowingAll ? 'Viendo no pred' : 'Ver no pred', value: '1' },
                { name: isShowingAll ? 'Viendo todos' : 'Ver todos', value: '2' }
            ]
    else
        radios = user.isAdmin ?
            [
                { name: (isShowingAll || isShowingStatistics) ? 'Ver no predicados' : 'Viendo no predicados', value: '1' },
                { name: isShowingAll ? 'Viendo todos' : 'Ver todos', value: '2' },
                { name: isShowingStatistics ? 'Viendo estadísticas' : 'Ver estadísticas', value: '3' }
            ]
            :
            [
                { name: (isShowingAll || isShowingStatistics) ? 'Ver no predicados' : 'Viendo no predicados', value: '1' },
                { name: isShowingAll ? 'Viendo todos' : 'Ver todos', value: '2' }
            ]
    ;

    return (
        <Col className={`text-center mb-2 ${isMobile ? '' : 'p-2'}`}>

            <ButtonGroup>

                <ToggleButton
                    key={'1'}
                    name={"radio"}
                    style={{
                        backgroundColor: `${isShowingAll || isShowingStatistics ? '' : generalRed}`,
                        padding: '0'
                    }}
                    type={'radio'}
                    value={radios[0]?.value}
                    variant={isShowingAll ? 'dark' : (isShowingStatistics ? 'dark' : 'danger')}
                >
                    <div
                        onClick={() => setIsShowingAllStatesHandler(false)}
                        style={{ color: 'white', lineHeight: '40px', padding: '0 15px', textDecoration: 'none' }}
                    >
                        {radios[0]?.name}
                    </div>
                </ToggleButton>


                <ToggleButton
                    checked={!!isShowingAll}
                    className={'p-0'}
                    key={'2'}
                    name={"radio"}
                    type={'radio'}
                    value={radios[1]?.value}
                    variant={isShowingAll ? 'danger' : 'dark'}
                >
                    <div
                        onClick={() => setIsShowingAllStatesHandler(true)}
                        style={{ color: 'white', lineHeight: '40px', padding: '0 15px' }}
                    >
                        {radios[1]?.name}
                    </div>
                </ToggleButton>


                {radios && radios[2] &&
                    <ToggleButton
                        checked={!!isShowingStatistics}
                        key={'3'}
                        name={"radio"}
                        style={{ padding: '0' }}
                        type={'radio'}
                        value={radios[2]?.value}
                        variant={isShowingStatistics ? 'danger' : 'dark'}
                    >
                        <div
                            onClick={() => setIsShowingStatisticsHandler()}
                            style={{ color: 'white', lineHeight: '40px', padding: '0 15px', textDecoration: 'none' }}
                        >
                            {radios[2]?.name}
                        </div>
                    </ToggleButton>
                }

            </ButtonGroup>

        </Col>
    )
}
