import { gql } from '@apollo/client'


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

export const activar = gql`mutation activar($user_id: String!, $token: String!) {
    activar (input: {
        user_id: $user_id
    }) {
        email
        estado
        _id
    }
}`

export const desactivar = gql`mutation desactivar($user_id: String!, $token: String!) {
    desactivar (input: {
        user_id: $user_id
    }) {
        email
        estado
        _id
    }
}`

export const hacerAdmin = gql`mutation hacerAdmin($user_id: String!, $token: String!) {
    hacerAdmin (input: {
        user_id: $user_id
    }) {
        email
        role
        _id
    }
}`

export const deshacerAdmin = gql`mutation deshacerAdmin($user_id: String!, $token: String!) {
    deshacerAdmin (input: {
        user_id: $user_id
    }) {
        email
        role
        _id
    }
}`

export const changeState = gql`mutation changeState($inner_id:String!, $estado:String!, $token:String!) {
    cambiarEstado (input: {
        inner_id: $inner_id
        estado: $estado
        token: $token
    }) {
        inner_id
        estado
        fechaUlt
    }
}`

