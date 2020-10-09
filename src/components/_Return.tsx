import React from 'react'
import { Button } from 'react-bootstrap'
import { BsBackspace } from 'react-icons/bs'
import { mobile } from './_App'


export const ReturnBtn = (props:any) => {

    return (
        <>
            <div style={{position:'fixed', left:'0', marginLeft: mobile ? '10px' : '20px', marginTop:'5px', zIndex:3}}>
                <Button size={mobile ? 'sm' : 'lg'} onClick={()=>props.history.goBack()} style={{backgroundColor:'#4a6da7', border:'1px solid #4a6da7', borderRadius:'5px', height: mobile ? '35px' :'47px'}}>
                    <BsBackspace style={{paddingBottom:'3px'}} />  VOLVER &nbsp;
                </Button>
            </div>
        </>
    )
}
