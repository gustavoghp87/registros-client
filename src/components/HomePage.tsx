import React from 'react';
import { H2 } from './css/css'
import { mobile } from './_App'


function HomePage() {
    
    return (
        <>
            <H2> BIENVENIDOS </H2>

            <div style={{textAlign:'center', marginTop: mobile ? '' : '40px'}}>
                <img src="/img/world.png" alt="world"
                    style={{margin:'15px auto 0 auto', maxWidth: mobile ? '100%' : '100%'}} />
            </div>

            <div style={{textAlign:'center', backgroundColor:'lightgray', padding:'50px 0'}}>
                <a href="https://jw.org/es" target="_blank" style={{textDecoration:'none'}}>
                    <h2> VISITAR JW.ORG </h2>
                    <img src="/img/jw.png" alt="world"
                        style={{margin:'15px auto', maxWidth: mobile ? '100%' : '100%'}} />
                </a>
            </div>

        </>
    )
};


export default HomePage;
