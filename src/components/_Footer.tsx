import React from 'react';



function Footer() {
    
    interface IEstilo1 {
        fontSize: string,
        paddingTop: string,
        paddingBottom: string,
        backgroundColor: string,
        height: string
    }

    var estilo1:IEstilo1 = {
        fontSize: window.screen.width>767 ? '3rem' : '1rem',
        paddingTop: '20px',
        paddingBottom: '20px',
        backgroundColor: '#343a40',
        height: '200px'
    };
    
    
    return (

        <>
        
        <div className="main-footer" style={estilo1}>
        

            <div style={{display:'flex', margin:'auto', textAlign:'center', alignItems:'center', justifyContent:'center'}}>

                <span style={{display:'inline-block'}}>
                    <a href="https://glamstudio.com.ar" style={{color:'white', fontWeight:'bolder'}}>
                    &nbsp; TEXTO </a>
                </span>
                <span style={{display:'inline-block'}}>
                    
                </span>
            </div>
        </div>
        </>
    )
}


export default Footer
