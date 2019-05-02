/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import { Link } from "gatsby"
import Img from 'gatsby-image'
import Icon from './icon'

const ArticleWrapper = styled('div')`
    ${tw`relative z-10 mb-12`}
    &:after, &:before {
        content: "";
        ${tw`border border-solid border-black rounded-sm bg-steel-gray h-full w-full absolute bg-steel-gray`};
    }
    &:before, &:after {
        ${tw`bg-steel-gray`}
    }
    &:before {
        top: .3em;
        right: -.4em;
        z-index: -1;
    }
    &:after {
        top: .6em;
        right: -.75em;
        z-index: -2;
    }
`
const Article = styled('article')`
  ${tw`flex relative overflow-hidden z-10 flex-col md:flex-row border border-solid border-black rounded-sm bg-steel-gray rounded-sm`}
  min-height: 450px;
  p {
    ${tw`text-base md:text-lg leading-normal text-comet-lighter mb-auto`}
  }
`
const ImgWrapper = styled(Link)`
    ${tw`w-full md:w-1/2 relative block border-solid bg-mirage overflow-hidden border-black border-t-0 border-l-0 border-r-default border-b-0`}
    .gatsby-image-wrapper {
      ${tw`h-full`}
    }
    img {
      filter: grayscale(100%);
    }
`

const ImgContainer = styled('div')`
  ${tw`h-full w-full`}
    transform: scale(1);
    transition: transform .2s ease;
    :hover {
      transform: scale(1.1);
    }
`


const ContentWrapper = styled('div')`
    ${tw`w-full md:w-1/2 p-5 md:p-10 flex flex-col`}
`

const ImgBlend = styled('div')`
    ${tw`absolute pin-t pin-l w-full h-full bg-mirage z-10 opacity-75`}
    mix-blend-mode: overlay;
`

const ImgOverlay = styled('div')`
    ${tw`absolute pin-t pin-l w-full h-full bg-mirage z-20 opacity-60`}
    transition: all .2s ease;
`

const ArticleTitle = styled('h2')`
    ${tw`font-serif text-5xl m-0`}
    a {
      ${tw`no-underline text-white`}
    }
`

const ArticleLink = styled(Link)`
    ${tw`text-white no-underline flex items-center mt-5`}
    .icon {
      transition: transform .2s ease;
      ${tw`relative`}
      transform: translateX(.5rem);
    }
    :hover, :focus {
      .icon {
        transform: translateX(.75rem);
      }
    }
`


export default class BlogItem extends React.Component {
    render() {
        const {node} = this.props;
        const title = node.frontmatter.title || node.fields.slug
        return (
          <ArticleWrapper key={node.fields.slug}>
            <Article>
              <ImgWrapper to={node.fields.slug}>
                <ImgContainer>
                  <ImgOverlay />
                  <ImgBlend />
                  {node.frontmatter.featuredImage &&
                  <Img alt={title} sizes={node.frontmatter.featuredImage.childImageSharp.sizes} />
                  }
                </ImgContainer>
              </ImgWrapper>
              <ContentWrapper>
                <ArticleTitle>
                  <Link to={node.fields.slug}>
                    {title}
                  </Link>
                </ArticleTitle>
                {/* <small>{node.frontmatter.date}</small> */}
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }} />
                <ArticleLink to={node.fields.slug}>Read the Post <Icon name="arrow-right" /></ArticleLink>
              </ContentWrapper>
            </Article>
          </ArticleWrapper>
        )
    }
}