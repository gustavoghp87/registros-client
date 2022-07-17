import { useState } from 'react'
import { Button, Container, FloatingLabel, Form } from 'react-bootstrap'
import { Credentials } from 'google-auth-library'
import { getGmailRequestService, getGmailUrlService, saveNewGmailAPITokenToDBService } from '../services/emailServices'

export const GmailTokensPage = () => {

    const [url, setUrl] = useState<string>('')
    const [code, setCode] = useState<string>('')
    const [credentials, setCredentials] = useState<Credentials>()
    const [success, setSuccess] = useState<boolean>()

    const step1Handler = async (): Promise<void> => {
        const url: string|null = await getGmailUrlService()
        if (url) setUrl(url)
    }

    const step2Handler = async (): Promise<void> => {
        if (!code) console.log("No Code")
        const credentials0: Credentials|null = await getGmailRequestService(code)
        if (credentials0) setCredentials(credentials0)
    }

    const step3Handler = async (): Promise<void> => {
        if (!credentials || !credentials.access_token || !credentials.refresh_token) return
        const success0: boolean = await saveNewGmailAPITokenToDBService(credentials.access_token, credentials.refresh_token)
        if (success0) setSuccess(true)
    }

    return (
        <Container style={{ maxWidth: '500px', marginTop: '150px'}}>

            <Button className={'d-block mx-auto mb-4'} onClick={() => step1Handler()}> Get Gmail URL </Button>

            <Form.Control className={'mb-4'} type={'text'} placeholder={"Gmail URL"} value={url} disabled />

            <br/><br/><br/>

            <Form>
                <FloatingLabel label={"Gmail Code"} className={'mb-3'}>
                    <Form.Control type={'text'} placeholder={"Gmail Code"} onChange={(e: any) => setCode(e.target.value)} />
                </FloatingLabel>

                <Button className={'d-block mx-auto mb-4'} onClick={() => step2Handler()}> Send </Button>
            </Form>

            {credentials &&
                <>
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
                </>
            }

            {credentials && success === undefined &&
                <Button  className={'d-block mx-auto mb-4'} onClick={() => step3Handler()}> Save </Button>
            }

            <br/><br/><br/>

            {success &&
                <h1 className={'btn-general-blue text-center pt-3 mt-3'} style={{ height: '60px' }}> Successful </h1>
            }

        </Container>
    )
}
