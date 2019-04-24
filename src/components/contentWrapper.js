/* global tw */
import React from 'react'
import styled from '@emotion/styled'

const ContentWrapper = styled('div')`
    ${tw`mx-auto`}
    max-width: 700px;
`

export default class imageRow extends React.Component {
    render() {
        return (
            <ContentWrapper>
                {this.props.children}
            </ContentWrapper>
        )
    }
}