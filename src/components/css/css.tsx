import styled from 'styled-components'
//import { Link } from 'react-router-dom'
import { isMobile } from '../../services/functions'

export const H2 = styled.h1`
    text-align: center;
    margin-top: ${isMobile ? '75px' : '80px'};
    font-size: ${isMobile ? '2.4rem' : '3.5rem'};
    font-weight: bolder;
`

// export const LINK2 = styled(Link)`
//     text-decoration: none;

//     &:focus, &:hover, &:visited, &:link, &:active {
//         text-decoration: none;
//     }
// `
