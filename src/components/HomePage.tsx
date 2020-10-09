import React from 'react';
import { H2 } from './css/css'
import { mobile } from './_App'


function HomePage() {
    
    return (
        <>
            <H2> BIENVENIDOS </H2>

            <div style={{textAlign:'center'}}>
                <img src="/img/world.png" alt="world"
                    style={{margin:'15px auto 50px auto', maxWidth: mobile ? '100%' : '100%'}} />
            </div>

        </>
    )
};


export default HomePage;
