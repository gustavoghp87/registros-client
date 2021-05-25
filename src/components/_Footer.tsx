
function Footer() {
    
    interface IEstilo1 {
        fontSize: string,
        paddingTop: string,
        paddingBottom: string,
        backgroundColor: string,
        height: string
        marginTop: string
    };

    var estilo1:IEstilo1 = {
        fontSize: window.screen.width>767 ? '1.8rem' : '1rem',
        paddingTop: '20px',
        paddingBottom: '20px',
        backgroundColor: '#4a6da7',
        height: '100px',
        marginTop: '200px'
    };
    
    
    return (
        <>
            <div className="main-footer" style={estilo1}>
                <div style={{display:'flex', height:'100%', width:'100%', margin:'auto', textAlign:'center',
                 alignItems:'center', justifyContent:'center'}}>
                    <a href="https://misericordiaweb.com/" style={{color:'white', fontWeight:'bolder'}}>
                        misericordiaweb.com
                    </a>
                </div>
            </div>
        </>
    )
};


export default Footer;
