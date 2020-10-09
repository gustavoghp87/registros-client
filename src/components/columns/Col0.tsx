import React, { useState } from 'react'
import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { mobile } from '../_App'


export const Col0:any = (props:any) => {

    const {count, radioMValue, setRadioMValue, setManzana, viviendas } = props
    
    const [radioValue, setRadioValue] = useState('1')

    const user = useSelector((state:any) => state.user)
    let radios = []
    
    if (mobile)
        radios = user && user.userData && user.userData.isAdmin ? 
            [
                { name: radioValue==='1' ? 'Viendo no pred' : 'Ver no pred', value: '1' },
                { name: radioValue==='2' ? 'Viendo todos' : 'Ver todos', value: '2' },
                { name: radioValue==='3' ? 'Viendo estad' : 'Ver estad', value: '3' }
            ]
            : [
                { name: radioValue==='1' ? 'Viendo no predicados' : 'Ver no predicados', value: '1' },
                { name: radioValue==='2' ? 'Viendo todos' : 'Ver todos', value: '2' }
            ]
    else
        radios = user && user.userData && user.userData.isAdmin ?
            [
                { name: radioValue==='1' ? 'Viendo no pred' : 'Ver no pred', value: '1' },
                { name: radioValue==='2' ? 'Viendo todos' : 'Ver todos', value: '2' },
                { name: radioValue==='3' ? 'Viendo estadísticas' : 'Ver estadísticas', value: '3' }
            ]
            : [
                { name: radioValue==='1' ? 'Viendo no predicados' : 'Ver no predicados', value: '1' },
                { name: radioValue==='2' ? 'Viendo todos' : 'Ver todos', value: '2' }
            ]



    let radiosM = [
        { name: mobile ? 'Manz 1' : 'Manzana 1', value: '1' }
    ]

    try {
        for(let i=2; i<=count.countBlocks.cantidad; i++) {
            radiosM.push( {name: mobile ? `Manz ${i}` : `Manzana ${i}`, value: i.toString() })
        }
    } catch {}


    return (

        <Col style={{textAlign:'center', marginBottom:'30px', padding: mobile ? '0' : '5px'}}>

            {count && count.countBlocks && !!count.countBlocks.cantidad &&
                <div style={{marginBottom:'10px'}}>
                    <ButtonGroup toggle>
                        {radiosM.map((radio, idx) => (
                            <ToggleButton
                                key={idx} type="radio" variant="danger" name="radio" value={radio.value}
                                checked={radioMValue === radio.value}
                                onChange={(e) => setRadioMValue(e.currentTarget.value)}
                            >
                                {radio.name}
                            </ToggleButton>
                            
                        ))}
                    </ButtonGroup>
                </div>
            }

            {viviendas && viviendas.unterritorio && !!viviendas.unterritorio.length &&

                <ButtonGroup toggle>
                    {radios.map((radio, idx) => (

                        <ToggleButton
                            key={idx} type="radio" variant="danger"
                            name="radio" value={radio.value} checked={radioValue === radio.value}
                            onChange={(e) => {
                                setRadioValue(e.currentTarget.value); setManzana(e.currentTarget.value)
                            }}
                        >

                            {radio.name}

                        </ToggleButton>

                    ))}
                </ButtonGroup>

            }
        </Col>
    )
}
