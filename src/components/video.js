/* global tw */
import React from 'react'
import styled from '@emotion/styled'

const VideoContainer = styled('div')`
    ${tw`mx-auto w-full`}
    max-width: 900px;
`

const Video = styled('video')`
`

export default class video extends React.Component {
    render() {
        return (
            <VideoContainer>
                <Video width="100%" controls playsinline autoplay muted loop>
                    <source src={"/videos/" + this.props.video + ".mp4"} type="video/mp4" />
                </Video>
            </VideoContainer>
        )
    }
}