import { FloatingLabel, Form } from 'react-bootstrap'
import { Hr } from '../commons'
import { HTMLAttributeReferrerPolicy } from 'react'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'
import { useState } from 'react'

const id: string = 'hCFC6OJkkt8'
const referrerPolicy: HTMLAttributeReferrerPolicy = 'unsafe-url'

export const LastMeetingPage = () => {
    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode,
        user: state.user
    }))
    const [showVideo, setShowVideo] = useState(false)
    const [pollValue, setPollValue] = useState<boolean>()

    return (
            <div className={'mt-4'}>
                <br/>
                <br/>
                {showVideo ?
                    <iframe
                        allow={`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;`}
                        frameBorder={'0'}
                        height={'700px'}
                        referrerPolicy={referrerPolicy}
                        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                        title={"Última Reunión"}
                        width={'100%'}
                    />
                    :
                    <div className={'container text-center'} style={{ maxWidth: '600px' }}>
                        <h2> Asistencia </h2>
                        <h4> Por favor, responder: </h4>
                        <br />
                        <div className="">
                            <select className={'custom-select bg-light py-3 px-4 h5'} size={2}
                                onClick={(e: any) => setPollValue(e.target.value)}
                                onTouchStart={(e: any) => setPollValue(e.target.value)}
                                style={{ height: isMobile ? '330px' : '230px', overflow: 'hidden', width: isMobile ? '100%' : '330px' }}
                            >
                                <option value={1}> 1 - Soy solo yo </option>
                                <option value={2}> 2 - Somos 2 </option>
                                <option value={3}> 3 - Somos 3 </option>
                                <option value={4}> 4 - Somos 4 </option>
                                <option value={5}> 5 - Somos 5 </option>
                                <option value={5}> 6 - Somos 6 </option>
                                <option value={0}> 0 - Ya informé mi asistencia </option>
                            </select>
                        </div>

                        <button className={'btn btn-general-blue btn-size12 d-block mx-auto w-50 mt-4'}
                            disabled={pollValue === undefined}
                            onClick={() => setShowVideo(true)}
                        >
                            Informar {pollValue}
                        </button>

                    </div>
                }

                {user.isAdmin &&
                    <>

                        <br />
                        <br />
                        <br />

                        
                        <div className={'container'} style={{ maxWidth: '800px', padding: isMobile ? '35px 30px 0' : '35px 0 0' }}>

                            <Hr />

                            <br />
                            <h2 className={'text-center'}> ADMINISTRADORES </h2>

                            <br />
                            <br />
                            
                            <FloatingLabel
                                className={'mb-3 text-dark'}
                                label={"URL de Youtube"}
                            >
                                <Form.Control
                                    autoComplete={'off'}
                                    className={'form-control'}
                                    disabled={false}
                                    id={"emailInput"}
                                    onChange={e => console.log(e.target.value)}
                                    placeholder={"URL de Youtube"}
                                    //style={{ backgroundColor: 'lightgray' }}
                                    type={'text'}
                                    //value={}
                                />
                            </FloatingLabel>
                            <button className={'btn btn-general-blue btn-size12 d-block mx-auto w-50 mt-4'}> Aceptar </button>
                        </div>

                        <div className={'container text-center mt-5'}>
                            <h4> Encuesta última reunión (14/09/2022): 8 </h4>
                        </div>
                    </>
                }

            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    )
}
