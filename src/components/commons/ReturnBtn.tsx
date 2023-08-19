import { BsBackspace } from 'react-icons/bs'
import { Button } from 'react-bootstrap'
import { generalBlue, typeRootState } from '../../models'
import { Location, useLocation } from 'react-router'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const ReturnBtn = () => {
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const location: Location = useLocation()
    const navigate: NavigateFunction = useNavigate()
    const [show, setShow] = useState<boolean>(false)

    useEffect(() => {
        if (
            location.pathname === '/selector' ||
            location.pathname === 'admins' ||
            location.pathname === 'usuario' ||
            location.pathname.split('/')[1] === 'casa-en-casa' ||
            location.pathname.split('/')[1] === 'celulares' ||
            location.pathname.split('/')[1] === 'telefonica'
        ) setShow(true)
    }, [location.pathname])
    
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
