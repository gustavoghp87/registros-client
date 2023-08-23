import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react'
import { typeRootState } from '../../../models'
import { useSelector } from 'react-redux'
import { LoadScript, Autocomplete, StandaloneSearchBox } from '@react-google-maps/api'
import { googleMapsApiKey } from '../../../app-config'

const buenosAiresBounds = {
    east: -58.353243,
    north: -34.562694,
    south: -34.705957,
    west: -58.530468
}

type propsType = {
    setSelectedStreet: Dispatch<SetStateAction<string>>
}

export const HTHNewFaceOptionsStreet = ({ setSelectedStreet }: propsType) => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)
    const [selectedStreetPrev, setSelectedStreetPrev] = useState('')
    const inputRef: MutableRefObject<google.maps.places.Autocomplete|null> = useRef(null)

    return (
        <Container style={{ width: '300px', marginTop: '50px' }}>
            <h3 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                Nombre de la calle:
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
                                console.log(autocomplete);
                                autocomplete.setBounds(buenosAiresBounds)
                                autocomplete.addListener('place_changed', () =>
                                    console.log(autocomplete.getPlace())
                                )
                            }}
                            onPlaceChanged={() => {
                                console.log(inputRef.current);
                                setSelectedStreetPrev(
                                    // inputRef.current?.getPlace()?.address_components?.find(x => x.long_name.toLowerCase().includes(selectedStreetPrev.toLowerCase()))?.long_name ||
                                    inputRef.current?.getPlace().adr_address?.split('>')[1].split('<')[0] ||
                                    ''
                                )
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
