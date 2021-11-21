import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { isMobile } from '../../services/functions'

export const Col0a = (props: any) => {

    const { manzanas } = props

    let radiosManzana: any[] = []
    manzanas.forEach((manzana: string) => {
        radiosManzana.push({ name: `Manzana ${manzana}`, value: manzana })
    })

    return (
        <Col style={{ textAlign: 'center', marginBottom: '0', padding: '0', maxWidth: '100%' }}>
            {manzanas && !!manzanas.length &&
                <div style={{ marginBottom: '10px' }}>
                    <ButtonGroup toggle vertical={isMobile ? true : false}>

                        {radiosManzana.map((radio: any, index: number) => (
                            <ToggleButton
                                key={index} type="radio" variant="danger" name="radio"
                                value={radio.value}
                                checked={props.manzana === radio?.value?.toString()}
                                style={{ padding: '0' }}
                            >
                                <a href={`/territorios/${props.territorio}/${radio.value}`}
                                    style={{ color: 'white' }}>
                                    <div style={{ height: '40px', width: '120px' }}>
                                        <div style={{ lineHeight: '40px' }}>
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
