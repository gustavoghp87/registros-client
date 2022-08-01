import { useEffect, useState } from 'react'
import { Location, useLocation } from 'react-router'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { BsBackspace } from 'react-icons/bs'
import { generalBlue, typeRootState } from '../../models'

export const ReturnBtn = () => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const navigate: NavigateFunction = useNavigate()
    const location: Location = useLocation()
    const [show, setShow] = useState<boolean>(false)

    useEffect(() => {
        console.log(location)
        
        if (window.location.pathname === '/index') setShow(true)  // useLocation
        else if (window.location.pathname.split('/')[1] === 'territorios') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'estadisticas') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'usuario') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'admins') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'celulares-admins') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'celulares') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'logs') setShow(true)
        else if (window.location.pathname.split('/')[1] === 'casa-en-casa') setShow(true)
    }, [])
    
    return (<>
        {show &&
            <div className={'mt-2'}
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
                        borderRadius:' 5px'
                    }}
                >

                    <BsBackspace style={{ paddingBottom: '3px' }} /> VOLVER &nbsp;

                </Button>
            </div>
        }
    </>)
}
