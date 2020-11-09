import React from 'react'
import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { mobile } from '../_App'
import { LINK2 } from '../css/css'


export const Col0a:any = (props:any) => {

    const {count } = props

    let radiosManzana = [
        { name: mobile ? 'Manz 1' : 'Manzana 1', value: '1' }
    ]

    try {
        for (let i=2; i<=count.countBlocks.cantidad; i++) {
            radiosManzana.push( {name: mobile ? `Manz ${i}` : `Manzana ${i}`, value: i.toString()})
        }
    } catch {}


    return (

        <Col style={{textAlign:'center', marginBottom:'0', padding: mobile ? '0' : '0', maxWidth:'100%'}}>

            {count && count.countBlocks && !!count.countBlocks.cantidad &&
                <div style={{marginBottom:'10px'}}>
                    <ButtonGroup toggle vertical={mobile ? true : false}>
                        {radiosManzana.map((radio, idx) => (
                            <ToggleButton
                                key={idx} type="radio" variant="danger" name="radio" value={radio.value}
                                checked={props.manzana === radio.value} style={{padding:'0'}}
                            >
                                <LINK2 to={`/territorios/${props.territorio}/${radio.value}`}
                                    style={{color:'white'}}>
                                    <div style={{height:'40px', width:'120px'}}>
                                        <div style={{lineHeight:'40px'}}>
                                            {radio.name}
                                        </div>
                                    </div>
                                </LINK2>
                            </ToggleButton>

                        ))}
                    </ButtonGroup>
                </div>
            }

        </Col>
    )
}
