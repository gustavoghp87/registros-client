import React from 'react'
import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { mobile } from '../_App'
// import { LINK2 } from '../css/css'


export const Col0a:any = (props:any) => {

    const { manzanas } = props

    let radiosManzana:any = []

    try {
        manzanas.forEach((manzana:string) => {
            radiosManzana.push({name: `Manzana ${manzana}`, value: manzana})
        })
    } catch {}


    return (

        <Col style={{textAlign:'center', marginBottom:'0', padding: '0', maxWidth:'100%'}}>

            {manzanas && !!manzanas.length &&
                <div style={{marginBottom:'10px'}}>
                    <ButtonGroup toggle vertical={mobile ? true : false}>
                        {radiosManzana.map((radio:any, idx:any) => (
                            <ToggleButton
                                key={idx} type="radio" variant="danger" name="radio" value={radio.value}
                                checked={props.manzana === radio.value} style={{padding:'0'}}
                            >
                                <a href={`/territorios/${props.territorio}/${radio.value}`}
                                    style={{color:'white'}}>
                                    <div style={{height:'40px', width:'120px'}}>
                                        <div style={{lineHeight:'40px'}}>
                                            {radio.name}
                                        </div>
                                    </div>
                                </a>
                            </ToggleButton>

                        ))}
                    </ButtonGroup>
                </div>
            }

        </Col>
    )
}
