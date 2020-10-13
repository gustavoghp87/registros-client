import React from 'react'
import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { mobile } from '../_App'
import { LINK2 } from '../css/css'


export const Col0a:any = (props:any) => {

    const {count, radioMValue, setRadioMValue, setManzana } = props

    let radiosM = [
        { name: mobile ? 'Manz 1' : 'Manzana 1', value: '1' }
    ]

    try {
        for (let i=2; i<=count.countBlocks.cantidad; i++) {
            radiosM.push( {name: mobile ? `Manz ${i}` : `Manzana ${i}`, value: i.toString() })
        }
    } catch {}


    return (

        <Col style={{textAlign:'center', marginBottom:'0', padding: mobile ? '0' : '0'}}>

            {count && count.countBlocks && !!count.countBlocks.cantidad &&
                <div style={{marginBottom:'10px'}}>
                    <ButtonGroup toggle>
                        {radiosM.map((radio, idx) => (
                            <ToggleButton
                                key={idx} type="radio" variant="danger" name="radio" value={radio.value}
                                checked={props.manzana === radio.value}
                            >
                                <LINK2 to={`/territorios/${props.territorio}/${radio.value}`}
                                    style={{color:'white'}}>

                                    {radio.name}

                                </LINK2>
                            </ToggleButton>

                        ))}
                    </ButtonGroup>
                </div>
            }

        </Col>
    )
}
