import { Button, Container, FloatingLabel, Form } from 'react-bootstrap'
import { Credentials } from 'google-auth-library'
import { getGmailRequestService, getGmailUrlService, saveNewGmailAPITokenToDBService, goToTop } from '../../services'
import { H2 } from '../commons'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../models'

export const GmailTokensPage = () => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)
    const [code, setCode] = useState("")
    const [credentials, setCredentials] = useState<Credentials>()
    const [success, setSuccess] = useState<boolean>()
    const [url, setUrl] = useState("")

    const step1Handler = async (): Promise<void> => {
        const url: string|null = await getGmailUrlService()
        if (url) setUrl(url)
    }

    const step2Handler = async (): Promise<void> => {
        if (!code) return
        const credentials0: Credentials|null = await getGmailRequestService(code)
        if (credentials0) setCredentials(credentials0)
    }

    const step3Handler = async (): Promise<void> => {
        if (!credentials || !credentials.access_token || !credentials.refresh_token) return
        const success0: boolean = await saveNewGmailAPITokenToDBService(credentials.access_token, credentials.refresh_token)
        if (success0) setSuccess(true)
    }

    useEffect(() => {
        goToTop()
    }, [])

    return (<>

        <H2 title='RENOVAR CREDENCIALES DE LA API DE GMAIL' />
        
        <Container style={{ maxWidth: '500px', marginTop: '150px'}}>

            {!url &&
                <Button className={'d-block mx-auto mb-4'} onClick={() => step1Handler()}>
                    Obtener URL de Gmail
                </Button>
            }

            {!!url &&
                <span className={isDarkMode ? 'text-white' : ''}>
                    Copiar esta URL y abrirla en otra pestaña de Chrome. Seleccionar la cuenta Gmail de la app.
                </span>
            }

            <br/><br/>

            <Form.Control className={'mb-4'} type={'text'} placeholder={"Gmail URL"} value={url} readOnly />

            <br/><br/>
            
            {!!url && <>
                <span className={isDarkMode ? 'text-white' : ''}>
                    De la URL resultante, copiar el código que está después de "code=" y antes de "&scope=" y pegarlo abajo:
                </span>
                
                <br/><br/><br/>

                <Form>
                    <FloatingLabel label={"Gmail Code"} className={'mb-3'}>
                        <Form.Control type={'text'} placeholder={""} onChange={e => setCode(e.target.value)} />
                    </FloatingLabel>

                    <Button className={'d-block mx-auto mb-4'} onClick={() => step2Handler()} disabled={!code}>
                        Mandar
                    </Button>
                </Form>
            </>}


            {credentials &&
                <>
                    <h2 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                        La siguiente información se guardará en la base de datos para su uso por la aplicación si se acepta abajo:
                    </h2>
                    <br/>
                    <div className={'bg-secondary p-2 text-white'}>
                        <br/>
                        <p className={'mb-0'}>
                            <span style={{ fontWeight: 'bolder' }}>access_token:</span>
                        </p>
                        <p style={{ overflowWrap: 'break-word' }}>
                            {credentials.access_token}
                        </p>
                        <p className={'mb-0'}>
                            <span style={{ fontWeight: 'bolder' }}>refresh_token:</span>
                        </p>
                        <p style={{ overflowWrap: 'break-word' }}>
                            {credentials.refresh_token}
                        </p>
                        <p>
                            <span style={{ fontWeight: 'bolder' }}>scope:</span> {credentials.scope}
                        </p>
                        <p>
                            <span style={{ fontWeight: 'bolder' }}>token_type:</span> {credentials.token_type}
                        </p>
                        <p>
                            <span style={{ fontWeight: 'bolder' }}>expiry_date:</span> {credentials.expiry_date}
                        </p>
                    </div>
                </>
            }

            {credentials && success === undefined && <>
                <span>Al guardar, estas credenciales se van a guardar en la base de datos y van a permitir el uso de la API</span>
                <Button  className={'d-block mx-auto mb-4'} onClick={() => step3Handler()}> Guardar </Button>
            </>}

            <br/><br/><br/>

            {success &&
                <div style={{ height: '60px' }}>
                    <h1 className={'btn-general-blue text-center py-3 my-3'}> GUARDADO EXITOSO </h1>
                </div>
            }

        </Container>
    </>)
}
