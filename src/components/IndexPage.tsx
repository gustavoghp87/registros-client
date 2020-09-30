import React, { useState, useEffect } from 'react';
import { SERVER } from "../config.json";
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { ITerritorio, IState, IUser } from '../types/types';
import { Loading } from './_Loading';
import { ReturnBtn } from './_Return';


function IndexPage(props:any) {

    const user:IUser = useSelector((state:IState) => state.user.userData);

    const [Territorios, setTerritorios] = useState<ITerritorio[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const datos = await Axios.post(`${SERVER}/api/buildings/territorios`, {
                    token:document.cookie
                });
                let asignados = datos.data.territorios;
                asignados.sort((a:number, b:number) => a - b);
                console.log("Territorios asignados:", asignados);
                setTerritorios(asignados)
            } catch(error) {console.log("No se pudieron recuperar los territorios asignados", error)};
        })();
    }, [])


    const territorios = () => {
        try {
            if (user.isAuth) 
                return (
                    Territorios.map((territorio, index) => (
                        <a type="button" className="btn btn-danger" style={btnTerri}
                        href={`/territorios/${territorio}`} key={index}>
                            <h2 className="h-100 align-middle"
                            style={{padding:'22%', fontFamily:'"Arial Black", Gadget, sans-serif'}}>
                                {territorio}
                            </h2>
                        </a>
                    ))
                );
            else return (<Loading />);
        } catch {
            return (<Loading />)
        };
    };

    const btnTerri = {
        width: '120px',
        height: '100px',
        borderRadius: '15px',
        marginBottom: '40px',
    };

    return (
        <>
        {ReturnBtn(props)}
        <div className="container" style={{paddingTop:'60px', marginBottom:'50px'}}>

            <div className="row" style={{marginBottom:'20px'}}>
                <h1 style={{display:'block', margin:'auto', textAlign:'center'}}>
                    SELECCIONE UN TERRITORIO
                </h1>
            </div>

            <div className="row" style={{padding:'60px', paddingTop:'40px',
             justifyContent:'space-evenly'}}>
            
                {territorios()}
            
            </div>

        </div>
        </>
    )
};


export default IndexPage;
