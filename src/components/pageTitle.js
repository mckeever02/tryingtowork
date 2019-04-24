/* global tw */
import PropTypes from "prop-types"
import React from "react"
import styled from '@emotion/styled'
import { colors } from "./theme.js"


const PageTitleWrapper = styled('div')`
    ${tw`pb-12`}
`
const Title = styled('h1')`
  ${tw`text-center mt-4 mb-3 sm:mb-6 font-serif text-mirage`};
  font-size: 16vw;
  line-height: 1.1;
  -webkit-text-stroke: 1px ${colors.waterLeaf};
  transition: all .2s ease;
  ::-moz-selection {
    background: none;
    ${tw`text-water-leaf`}
    -webkit-text-stroke: 0px;
  }
  ::selection {
    background: none;
    ${tw`text-water-leaf`}
    -webkit-text-stroke: 0px;
  }
  @media (min-width:  500px) {
    font-size: 13vw;
  }
  @media (min-width:  960px) {
    font-size: 7vw;
    -webkit-text-stroke: 2px ${colors.waterLeaf};
  }
  @media (min-width:  1921px) {
    font-size: 6vw;
  }
`
const Description = styled('h2')`
  ${tw`text-center leading-normal font-normal text-base xxl:text-xl max-w-sm mx-auto`}
`

export default class PageTitle extends React.Component {
    render() {

        PageTitle.propTypes = {
            title: PropTypes.string,
            description: PropTypes.string
        }
        PageTitle.defaultProps = {
            title: "Trying to work"
        }
        const { title, description } = this.props;
        return (
            <PageTitleWrapper>
                <Title>
                  {title}
                </Title>
                <Description>
                  {description}
                </Description>
            </PageTitleWrapper>
        )
    }
}
