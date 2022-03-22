import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { BsBackspace } from 'react-icons/bs'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { isMobile } from '../../services/functions'
import { generalBlue } from '../_App'

export const ReturnBtn = () => {

    const navigate: NavigateFunction = useNavigate()
    const [show, setShow] = useState<boolean>(false)

    useEffect(() => {
        if (window.location.pathname === '/index') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'territorios') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'estadisticas') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'usuario') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'admins') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'celulares-admins') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'celulares') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'logs') setShow(true)
    }, [])
    
    return (
        <div className={`mt-2 ${show ? '' : 'd-none'}`}
            style={{
                position: 'fixed',
                left: '0',
                marginLeft: isMobile ? '10px' : '10px',
                marginTop: isMobile ? '0' : '0px',
                zIndex: 3
            }}
        >
            <Button size={isMobile ? 'sm' : undefined}
                onClick={() => navigate(-1)}
                style={{
                    backgroundColor: generalBlue,
                    border: '1px solid ' + generalBlue,
                    borderRadius:' 5px',
                    //height: isMobile ? '35px' :'47px'
                }}
            >

                <BsBackspace style={{ paddingBottom: '3px' }} /> VOLVER &nbsp;

            </Button>
        </div>
    )
}