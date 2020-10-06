import React from 'react'
import { Button } from 'react-bootstrap'
import { BsBackspace } from 'react-icons/bs'


export const ReturnBtn = (props:any) => {

    return (
        <>
            <div style={{position:'fixed', left:'0', marginLeft:'25px', marginTop:'5px', zIndex:9}}>
                <Button size="lg" onClick={()=>props.history.goBack()} style={{backgroundColor:'#4a6da7', border:'1px solid #4a6da7'}}>
                    <BsBackspace style={{paddingBottom:'3px'}} />  VOLVER &nbsp;
                </Button>
            </div>
        </>
    )
}
