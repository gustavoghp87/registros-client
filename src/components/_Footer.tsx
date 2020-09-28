import React from 'react';



function Footer() {
    
    interface IEstilo1 {
        fontSize: string,
        paddingTop: string,
        paddingBottom: string,
        backgroundColor: string,
        height: string
    };

    var estilo1:IEstilo1 = {
        fontSize: window.screen.width>767 ? '2rem' : '1rem',
        paddingTop: '20px',
        paddingBottom: '20px',
        backgroundColor: '#343a40',
        height: '200px'
    };
    
    
    return (
        <>
            <div className="main-footer" style={estilo1}>
                <div style={{display:'flex', height:'100%', margin:'auto', textAlign:'center', alignItems:'center', justifyContent:'center'}}>
                    <a href="https://misericordiaweb.com/" style={{color:'white', fontWeight:'bolder'}}>
                        misericordiaweb.com
                    </a>
                </div>
            </div>
        </>
    )
};


export default Footer;
