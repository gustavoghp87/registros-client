import React from 'react';
import { Button } from 'react-bootstrap';


export const ReturnBtn = (props:any) => {

    return (
        <>
            <div style={{position:'fixed', left:'0', marginLeft:'25px', marginTop:'5px', zIndex:1}}>
                <Button size="lg" variant="danger" onClick={()=>props.history.goBack()}> VOLVER </Button>
            </div>
        </>
    );
};
