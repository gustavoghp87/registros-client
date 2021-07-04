import React from 'react'
import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { mobile } from '../_App'
import { LINK2 } from '../css/css'


export const Col0b:any = (props:any) => {

    let manzana
    if (props.manzana) manzana = props.manzana
    else manzana = '1'
    const user = useSelector((state:any) => state.user)
    let radios = []

    if (mobile)
        radios = user && user.userData && user.userData.isAdmin ? 
            [
                { name: props.isTodo ? 'Ver no pred' : 'Viendo no pred', value: '1' },
                { name: props.isTodo ? 'Viendo todos' : 'Ver todos', value: '2' },
                { name: props.isStatistics ? 'Viendo estad' : 'Ver estad', value: '3' }
            ]
            :
            [
                { name: props.isTodo ? 'Viendo no pred' : 'Ver no pred', value: '1' },
                { name: props.isTodo ? 'Viendo todos' : 'Ver todos', value: '2' }
            ]
    else
        radios = user && user.userData && user.userData.isAdmin ?
            [
                { name: props.isTodo ? 'Ver no predicados' : 'Viendo no predicados', value: '1' },
                { name: props.isTodo ? 'Viendo todos' : 'Ver todos', value: '2' },
                { name: props.isStatistics ? 'Viendo estadísticas' : 'Ver estadísticas', value: '3' }
            ]
            :
            [
                { name: props.isTodo ? 'Ver no predicados' : 'Viendo no predicados', value: '1' },
                { name: props.isTodo ? 'Viendo todos' : 'Ver todos', value: '2' }
            ]



    return (

        <Col style={{textAlign:'center', marginBottom:'7px', padding: mobile ? '0' : '5px'}}>

            <ButtonGroup toggle>

                <ToggleButton
                    key={'1'} type="radio" variant="danger"
                    name="radio" value={radios[0].value} style={{padding:'0'}}
                    checked={props.isTodo ? false : (props.isStatistics ? false : true )}
                >

                    <a href={`/territorios/${props.territorio}/${manzana}`}
                        style={{color:'white'}}>
                        
                        <div style={{lineHeight:'40px', padding:'0 15px'}}> {radios[0].name} </div>

                    </a>

                </ToggleButton>


                <ToggleButton
                    key={'2'} type="radio" variant="danger"
                    name="radio" value={radios[1].value} style={{padding:'0'}}
                    checked={props.isTodo ? true : false}
                >

                    <LINK2 to={`/territorios/${props.territorio}/${manzana}/todo`}
                        style={{color:'white'}}>
                        
                        <div style={{lineHeight:'40px', padding:'0 15px'}}> {radios[1].name} </div>

                    </LINK2>

                </ToggleButton>

                
                {radios && radios[2] &&
                    <ToggleButton
                        key={'3'} type="radio" variant="danger"
                        name="radio" value={radios[2].value} style={{padding:'0'}}
                        checked={props.isStatistics ? true : false }
                    >

                        <LINK2 to={`/estadisticas/${props.territorio}`}
                            style={{color:'white'}}>
                            
                            <div style={{lineHeight:'40px', padding:'0 15px'}}> {radios[2].name} </div>

                        </LINK2>

                    </ToggleButton>
                }

            </ButtonGroup>

        </Col>
    )
}
