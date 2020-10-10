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

export const GETTERRITORY = gql`query busqueda($token:String!, $terr:String!, $manzana:String!) {
    getApartmentsByTerritory (
        terr: $terr, token: $token, manzana: $manzana
    ) {
        inner_id
        territorio
        manzana
        direccion
        telefono
        estado
        noAbonado
        fechaUlt
    }
}`

export const GETUSERS = gql`query usuarios($token: String!) {
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


////////    MUTATIONS    ////////

export const CONTROLARUSUARIO = gql`mutation controlarU($token:String!, $user_id:String!, $estado:Boolean!, $role:Int!, $group:Int!) {
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
        }
    }
`

export const CHANGESTATE = gql`mutation
    changeState($inner_id:String!, $estado:String!, $noAbonado:Boolean!, $token:String!) {
        cambiarEstado (input: {
            inner_id: $inner_id
            estado: $estado
            noAbonado: $noAbonado
            token: $token
        }) {
            inner_id
            estado
            noAbonado
            fechaUlt
        }
    }
`

