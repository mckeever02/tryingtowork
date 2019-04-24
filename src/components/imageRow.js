/* global tw */
import React from 'react'
import styled from '@emotion/styled'

const ImageRow = styled('div')`
    ${tw`flex flex-col md:flex-row justify-between content-top mt-10 mx-auto`}
    p {
        ${tw`w-full sm:px-5`}
    }
    p, figure {
        ${tw`m-0 mb-4 md:mb-0`}
    }
    img {
        max-width: 100%;
        height: auto;
    }
`

export default class imageRow extends React.Component {
    render() {
        return (
            <ImageRow>
                {this.props.children}
            </ImageRow>
        )
    }
}