/* global tw */
import React from "react"
import styled from '@emotion/styled'
import Icon from "./icon";
import ScrollToTop from "react-scroll-up"

const FooterWrapper = styled('footer')`
    ${tw`flex flex-row content-center justify-center pt-14 pb-8`}
`

const FooterItem = styled('div')`
    ${tw`px-3 text-center text-xs my-auto`}
    a {
        ${tw`block text-comet-light no-underline`}
        &:hover {
            ${tw`text-white`}
        }
    }
`

const scrollStyles = {
    position: 'relative',
    bottom: '0',
    right: '0',
    opacity: 1,
    visibility: 'visible'
}

export default class Footer extends React.Component {

    constructor(props) {
    super(props);
    }

    render() {
        return(
            <>
            <FooterWrapper>
                <FooterItem>
                    <a target="_blank" rel="noopener noreferrer" href="//twitter.com/trying2work">Follow on Twitter</a>
                </FooterItem>
                <FooterItem>
                    <ScrollToTop showUnder={0}
                        style={scrollStyles}>
                        <Icon name="speed" size="lg" />
                    </ScrollToTop>
                </FooterItem>
                <FooterItem>
                    <a target="_blank" rel="noopener noreferrer" href="//twitter.com/trying2work">View on Github</a>
                </FooterItem>
            </FooterWrapper>
            </>
        )
    }
}