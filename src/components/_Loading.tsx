import { Spinner } from 'react-bootstrap'

export const Loading = () => {

    return (
        <div style={{textAlign:'center'}}>
            <Spinner animation="grow" role="status" /> &nbsp; &nbsp;
            <Spinner animation="grow" role="status" /> &nbsp; &nbsp;
            <Spinner animation="grow" role="status" /> &nbsp; &nbsp;
            <Spinner animation="grow" role="status" /> &nbsp; &nbsp;
            <Spinner animation="grow" role="status" />
            <br/><br/>
            <span style={{fontWeight:'bolder'}}> Cargando... </span>
        </div>
    )
}
