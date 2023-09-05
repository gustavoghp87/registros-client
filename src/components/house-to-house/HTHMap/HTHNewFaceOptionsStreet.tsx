import { Autocomplete } from '@react-google-maps/api'
import { Container, Form } from 'react-bootstrap'
import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react'
import { placesBounds } from '../../../app-config'
import { typeRootState } from '../../../models'
import { useSelector } from 'react-redux'

type propsType = {
    setSelectedStreet: Dispatch<SetStateAction<string>>
}

export const HTHNewFaceOptionsStreet = ({ setSelectedStreet }: propsType) => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)
    const [selectedStreetPrev, setSelectedStreetPrev] = useState('')
    const inputRef: MutableRefObject<google.maps.places.Autocomplete|null> = useRef(null)

    return (
        <Container style={{ width: '300px', marginTop: '50px' }}>
            <h3 className={`text-center mb-3 ${isDarkMode ? 'text-white' : ''}`}>
                Buscar una dirección de donde obtener el nombre de la calle:
            </h3>
            {/* <FloatingLabel
                label={"Nombre de la calle"}
                className={'mb-3'}
            >
                <Form.Control type={'text'} placeholder={" "} onChange={(event: any) => setSelectedStreetPrev(event.target.value)} />
            </FloatingLabel> */}
            
            {/* <LoadScript googleMapsApiKey={googleMapsApiKey}> */}
                <Form>
                    {/* <FloatingLabel label="Dirección"> */}
                    {/* <StandaloneSearchBox
                        bounds={buenosAiresBounds}
                        onLoad={ref => inputRef.current = ref}
                        
                    > */}
                        <Autocomplete
                            onLoad={(autocomplete) => {
                                inputRef.current = autocomplete
                                // console.log(autocomplete);
                                autocomplete.setBounds(placesBounds)
                                // autocomplete.addListener('place_changed', () =>
                                //     console.log(autocomplete.getPlace())
                                // )
                            }}
                            onPlaceChanged={() => {
                                const adrAddress = inputRef.current?.getPlace().adr_address
                                const streetName = adrAddress?.split('class="street-address">')[1].split('<')[0]?.toString() || ""
                                setSelectedStreetPrev(streetName)
                            }}
                            // onPlaceChanged={() => setSelectedStreetPrev(autocomplete.getPlace())}
                        >
                            <Form.Control
                                type="text"
                                value={selectedStreetPrev}
                                onChange={e => setSelectedStreetPrev(e.target.value)}
                                placeholder="Calle"
                                autoFocus
                            />
                        </Autocomplete>
                    {/* </StandaloneSearchBox> */}
                    {/* </FloatingLabel> */}
                </Form>
            {/* </LoadScript> */}

            <button className={'btn btn-general-red btn-size12 w-100 mt-4'}
                onClick={() => setSelectedStreet(selectedStreetPrev)}
            >
                Aceptar
            </button>
        </Container>
    )
}
