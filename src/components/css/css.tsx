import styled from 'styled-components'


let mobile = window.screen.width<990 ? true : false

export const H2 = styled.h1`
    text-align: center;
    margin-top: ${mobile ? '85px' : '80px'};
    font-size: ${mobile ? '2.4rem' : '3.5rem'};
    font-weight: bolder;
`
