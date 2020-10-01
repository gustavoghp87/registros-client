//  import React from 'react';
import styled from 'styled-components';


export const H2 = window.screen.width>990 ?
    styled.h1`
        text-align: center;
        margin-top: 50px;
        font-size: 3rem;
    `
    :
    styled.h1`
        text-align: center;
        margin-top: 80px;
        font-size: 2rem;
    `
