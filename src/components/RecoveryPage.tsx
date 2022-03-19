import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getEmailByEmailLink } from '../services/userServices'
import { isMobile } from '../services/functions'
import { changePswService } from '../services/tokenServices'

export const RecoveryPage = (props: any) => {

    const { id } = useParams<string>()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confPassword, setConfPassword] = useState<string>('')
    const isDarkMode: string = props.isDarkMode

    useEffect(() => {
        if (!id) return
        getEmailByEmailLink(id).then((email: string|null) => {
            if (email) setEmail(email)
            else alert("Algo falló")
        })
    }, [id])

    const sendFormHandler = async (): Promise<void> => {
        if (!id || !email || !password || !confPassword) return alert("Faltan datos")
        if (password.length < 8) return alert("La contraseña es demasiado corta (mín 8)")
        if (password !== confPassword) return alert("La contraseña no coincide con su confirmación")
        const response: any|null = await changePswService(null, password, id)
        if (response && response.success) {
            alert("Clave cambiada con éxito")
            window.location.href = "/"
        } else if (response && response.expired) {
            alert("Este link ya expiró; pedir otro")
            window.location.href = "/login"
        } else if (response && response.used) {
            alert("Este link de recuperación ya se usó antes")
            window.location.href = "/login"
        } else alert("Algo salió mal")
    }
    
    return (
        <div className={'container'}
            style={{ maxWidth: '95%', marginTop: '50px', padding: '0' }}>

            <div className={`container ${isDarkMode ? 'bg-dark text-white' : ''}`}
                style={{
                    paddingTop: '40px',
                    marginBottom: '40px',
                    border: 'gray 1px solid',
                    borderRadius: '12px',
                    maxWidth: '600px',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}
            >

                <h2
                    style={{
                        textAlign: 'center',
                        textShadow: '0 0 1px gray',
                        fontSize: isMobile ? '1.6rem' : '2rem',
                        marginInline: '10px'
                    }}
                >
                    CAMBIAR LA CLAVE PARA RECUPERAR LA CUENTA
                </h2>

                <div className={'container'} style={{ paddingTop: '35px', display: 'block', margin: 'auto', maxWidth: '500px' }}>

                    <input className={'form-control'}
                        type={'email'}
                        style={{ marginBottom: '12px' }}
                        placeholder={"Cargando..."}
                        value={email}
                        readOnly
                    />

                    <input className={'form-control'}
                        type={'password'}
                        style={{ marginBottom: '12px' }}
                        placeholder={"Nueva Contraseña"}
                        autoFocus
                        onChange={(e: any) => setPassword((e.target as HTMLInputElement).value)}
                    />

                    <input className={'form-control'}
                        type={'password'}
                        style={{ marginBottom: '26px' }}
                        placeholder={"Confirmar Contraseña Nueva"}
                        onChange={(e: any) => setConfPassword((e.target as HTMLInputElement).value)}
                    />

                    <button className={'btn btn-danger'}
                        style={{ width: '100%', height: '50px' }}
                        onClick={() => sendFormHandler()}
                    >
                        CAMBIAR CLAVE
                    </button>

                    <Link to={"/login"}>
                        <p style={{ fontSize: '1.1rem', margin: '15px 0 20px 0', textAlign: 'end' }}>
                            Cancelar
                        </p>
                    </Link>

                </div>
            </div>

        </div>
    )
}
