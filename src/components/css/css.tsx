import styled from 'styled-components'
import { Link } from 'react-router-dom'


let mobile = window.screen.width<990 ? true : false

export const H2 = styled.h1`
    text-align: center;
    margin-top: ${mobile ? '75px' : '80px'};
    font-size: ${mobile ? '2.4rem' : '3.5rem'};
    font-weight: bolder;
`

export const LINK2 = styled(Link)`
    text-decoration: none;

    &:focus, &:hover, &:visited, &:link, &:active {
    text-decoration: none;
    }
`
