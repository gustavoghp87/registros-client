import React from 'react';
import { H2 } from './css/css'
import { mobile } from './_App'


function HomePage() {
    
    return (
        <>
            <H2> BIENVENIDOS </H2>

            <div style={{textAlign:'center', marginTop: mobile ? '20px' : '40px'}}>
                
                <img src="/img/world.png" alt="world"
                    style={{margin:'15px auto 0 auto', maxWidth: '100%'}} />
            

                <div style={{
                    textAlign: 'center', 
                    backgroundColor: 'lightgray', 
                    padding: '50px 0', 
                    maxWidth: mobile ? '100%' : '1136px',
                    margin: 'auto'
                }}>

                    <a href="https://jw.org/es" target="_blank" rel="noopener noreferrer"
                        style={{textDecoration:'none'}}>
                        
                        <h2 style={{color:'#4a6da7', fontSize: mobile ? '1.5rem' : '2rem'}}>
                            VISITAR JW.ORG
                        </h2>
                    
                        <img src="/img/jw.png" alt="jw"
                            style={{margin:'15px auto', maxWidth: mobile ? '100%' : '100%'}} />
                    
                    </a>
                </div>

            </div>

        </>
    )
};


export default HomePage;
