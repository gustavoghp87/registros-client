import { Button } from 'react-bootstrap'
import { BsBackspace } from 'react-icons/bs'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { isMobile } from '../../services/functions'

export const ReturnBtn = () => {

    const navigate: NavigateFunction = useNavigate()
    
    return (
        <>
            <div style={{
                position: 'fixed',
                left: '0',
                marginLeft: isMobile ? '10px' : '20px',
                marginTop: isMobile ? '0' : '5px',
                zIndex: 3
            }}>
                <Button size={isMobile ? 'sm' : 'lg'}
                    onClick={() => navigate(-1)}
                    style={{
                        backgroundColor: '#4a6da7',
                        border: '1px solid #4a6da7',
                        borderRadius:' 5px',
                        height: isMobile ? '35px' :'47px'
                    }}
                >

                    <BsBackspace style={{ paddingBottom: '3px' }} /> VOLVER &nbsp;

                </Button>
            </div>
        </>
    )
}
