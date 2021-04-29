import { gql } from '@apollo/client'


////////    SUBSCRIPTIONS    ////////

export const ESCUCHARCAMBIODEESTADO = gql`subscription escucharCambioDeEstado {
    escucharCambioDeEstado {
        estado
        inner_id
        territorio
        manzana
        direccion
        telefono
        noAbonado
        fechaUlt
        asignado
    }
}`

export const ESCUCHARCAMBIODEUSUARIO = gql`subscription escucharCambioDeUsuario {
    escucharCambioDeUsuario {
        _id
        role
        estado
        email
        group
        asign
    }
}`


////////    QUERIES    ////////

export const COUNTBLOCKS = gql`query countBlocks($terr:String!) {
    countBlocks (
        terr: $terr
    ) {
        cantidad
    }
}`

export const GETTERRITORY = gql`query busqueda(
        $token:String!, $terr:String!, $manzana:String!, $todo:Boolean!, $traidos:Int!, $traerTodos:Boolean!
    ) {
        getApartmentsByTerritory (
            terr:$terr, token:$token, manzana:$manzana, todo:$todo, traidos:$traidos, traerTodos:$traerTodos
        ) {
            inner_id
            territorio
            manzana
            direccion
            telefono
            estado
            noAbonado
            fechaUlt
            asignado
        }
    }
`

export const GETUSERS = gql`query usuarios($token:String!) {
    getUsers (
        token: $token
    ) {
        _id
        role
        estado
        email
        group
        asign
    }
}`

export const GETSTATISTICS = gql`query statistics($token:String!) {
    getGlobalStatistics (token:$token) {
        count
        countContesto
        countNoContesto
        countDejarCarta
        countNoLlamar
        countNoAbonado
    }
}
`

export const GETLOCALSTATISTICS = gql`query statistics($token:String!, $territorio:String!) {
    getLocalStatistics (token:$token, territorio:$territorio) {
        count
        countContesto
        countNoContesto
        countDejarCarta
        countNoLlamar
        countNoAbonado
        libres
    }
}
`


////////    MUTATIONS    ////////

export const CONTROLARUSUARIO = gql`mutation
    controlarU($token:String!, $user_id:String!, $estado:Boolean!, $role:Int!, $group:Int!) {

        controlarUsuario (input: {
            token: $token
            user_id: $user_id
            estado: $estado
            role: $role
            group: $group
        }) {
            _id
            role
            estado
            email
            group
            asign
        }
    }
`

export const ASIGNAR = gql`mutation
    asignarT($token:String!, $user_id:String!, $asignar:Int, $desasignar:Int, $all:Boolean) {

        asignar (input: {
            token: $token
            user_id: $user_id
            asignar: $asignar
            desasignar: $desasignar
            all: $all
        }) {
            _id
            role
            estado
            email
            group
            asign
        }
    }
`

export const CHANGESTATE = gql`mutation
    changeState($inner_id:String!, $estado:String!, $noAbonado:Boolean!, $asignado:Boolean!, $token:String!) {

        cambiarEstado (input: {
            inner_id: $inner_id
            estado: $estado
            noAbonado: $noAbonado
            asignado: $asignado
            token: $token
        }) {
            inner_id
            estado
            noAbonado
            fechaUlt
            asignado
        }
    }
`

