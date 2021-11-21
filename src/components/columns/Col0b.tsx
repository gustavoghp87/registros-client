import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { LINK2 } from '../css/css'
import { isMobile } from '../../services/functions'
import { typeUser } from '../../models/typesUsuarios'
import { typeBlock } from '../../models/typesTerritorios'

export const Col0b = (props:any) => {

    const user: typeUser = props.user
    const isTodo: boolean = props.isTodo
    const isStatistics: boolean = props.isStatistics
    const territorio: string = props.territorio

    let radios: any[] = []
    let manzana: typeBlock
    if (props.manzana) manzana = props.manzana
    else manzana = '1'

    if (isMobile)
        radios = user && user.isAdmin ? 
            [
                { name: isTodo ? 'Ver no pred' : 'Viendo no pred', value: '1' },
                { name: isTodo ? 'Viendo todos' : 'Ver todos', value: '2' },
                { name: isStatistics ? 'Viendo estad' : 'Ver estad', value: '3' }
            ]
            :
            [
                { name: isTodo ? 'Viendo no pred' : 'Ver no pred', value: '1' },
                { name: isTodo ? 'Viendo todos' : 'Ver todos', value: '2' }
            ]
    else
        radios = user && user.isAdmin ?
            [
                { name: (isTodo || isStatistics) ? 'Ver no predicados' : 'Viendo no predicados', value: '1' },
                { name: isTodo ? 'Viendo todos' : 'Ver todos', value: '2' },
                { name: isStatistics ? 'Viendo estadísticas' : 'Ver estadísticas', value: '3' }
            ]
            :
            [
                { name: (isTodo || isStatistics) ? 'Ver no predicados' : 'Viendo no predicados', value: '1' },
                { name: isTodo ? 'Viendo todos' : 'Ver todos', value: '2' }
            ]



    return (

        <Col style={{ textAlign: 'center', marginBottom: '7px', padding: isMobile ? '0' : '5px' }}>

            <ButtonGroup toggle>

                <ToggleButton
                    key={'1'} type="radio" variant="danger"
                    name="radio" value={radios[0].value} style={{ padding: '0' }}
                    checked={isTodo ? false : (isStatistics ? false : true )}
                >

                    <a href={`/territorios/${territorio}/${manzana}`}
                        style={{ color: 'white' }}>
                        
                        <div style={{ lineHeight: '40px', padding: '0 15px' }}> {radios[0].name} </div>

                    </a>

                </ToggleButton>


                <ToggleButton
                    key={'2'} type="radio" variant="danger"
                    name="radio" value={radios[1].value} style={{ padding: '0' }}
                    checked={isTodo ? true : false}
                >

                    <LINK2 to={`/territorios/${territorio}/${manzana}/todo`}
                        style={{ color: 'white' }}>
                        
                        <div style={{ lineHeight: '40px', padding: '0 15px' }}> {radios[1].name} </div>

                    </LINK2>

                </ToggleButton>

                
                {radios && radios[2] &&
                    <ToggleButton
                        key={'3'} type="radio" variant="danger"
                        name="radio" value={radios[2].value} style={{ padding: '0' }}
                        checked={isStatistics ? true : false }
                    >

                        <LINK2 to={`/estadisticas/${territorio}`}
                            style={{ color: 'white' }}>
                            
                            <div style={{ lineHeight: '40px', padding: '0 15px' }}> {radios[2].name} </div>

                        </LINK2>

                    </ToggleButton>
                }

            </ButtonGroup>

        </Col>
    )
}
