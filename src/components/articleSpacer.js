/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import Icon from './icon'

const ArticleSpacer = styled('div')`
    ${tw`flex flex-row justify-center text-comet pt-8`}
    .icon {
        ${tw`mx-1 text-water-leaf`}
    }
`

export default class articleSpacer extends React.Component {
    render() {
        return (
            <ArticleSpacer>
                <Icon size="lg" name="speed" />
                <Icon size="lg" name="speed" />
                <Icon size="lg" name="speed" />
            </ArticleSpacer>
        )
    }
}