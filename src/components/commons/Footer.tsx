import { isMobile } from "../../services/functions"

export const Footer = () => {

    const footerStyle1 = {
        fontSize: isMobile ? '1rem' : '1.8rem',
        paddingTop: '20px',
        paddingBottom: '20px',
        backgroundColor: '#4a6da7',
        height: '100px',
        marginTop: '200px'
    }

    const footerStyle2 = {
        display: 'flex',
        height: '100%',
        width: '100%',
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center'
    }
    
    return (
        <>
            <div className="main-footer" style={footerStyle1}>
                <div style={footerStyle2}>
                    <a href="https://misericordiaweb.com/" style={{ color: 'white', fontWeight: 'bolder' }}>
                        misericordiaweb.com
                    </a>
                </div>
            </div>
        </>
    )
}
