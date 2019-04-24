/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import {colors} from './theme'

const IntroParagraph = styled('div')`
    p:first-of-type {
        ${tw`relative z-10`}
        ::first-letter {
            ${tw`font-serif border-default border-comet-light block border-solid relative bg-mirage`}
            font-size: 3rem;
            float: left;
            line-height: 1;
            padding: 1rem;
            margin: 0 1rem 0 0;
            z-index: 20;
            box-shadow: -5px 5px 0 1px ${colors.mirage}, -6px 6px 0 1px ${colors.cometLight};
            @media (min-width:  577px) {
                font-size: 5rem;

            }
        }
        // @media (min-width:  577px) {
        //     ::before {
        //         content: "";
        //         ${tw`border border-solid border-comet-light absolute bg-mirage`}
        //         width: 117px;
        //         height: 115px;
        //         top: 5px;
        //         left: -6px;
        //         z-index: -1;
        //     }
        // }
    }
`

export default class introParagraph extends React.Component {
    render() {
        return (
            <IntroParagraph>
                {this.props.children}
            </IntroParagraph>
        )
    }
}