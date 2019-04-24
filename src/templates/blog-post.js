import React from 'react'
import { Link, graphql } from 'gatsby'
import { colors } from "../components/theme"
import Layout from "../components/layout"
import SEO from "../components/seo"
import styled from '@emotion/styled'
import Img from 'gatsby-image'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import { DiscussionEmbed } from "disqus-react";
import Helmet from "react-helmet"


const ArticleWrapper = styled('article')`
  ${tw`mx-auto max-w-3xl relative`}
  @media (min-width:  1921px) {
    ${tw`max-w-4xl`}
  }
`
const FeaturedImage = styled('div')`
  ${tw`relative overflow-hidden`}
  .gatsby-image-wrapper {
    max-height: 600px;
  }
  img {
    filter: grayscale(100%);
  }
  @media (min-width:  1921px) {
    .gatsby-image-wrapper {
      max-height: 750px;
    }
  }
`
const ImgBlend = styled('div')`
    ${tw`absolute pin-t pin-l w-full h-full bg-mirage z-10 opacity-75`}
    mix-blend-mode: overlay;
`
const ImgOverlay = styled('div')`
    ${tw`absolute pin-t pin-l w-full h-full z-20`}
    transition: all .2s ease;
    background-image: radial-gradient(ellipse closest-side, rgba(28, 30, 44, 0.6), ${colors.mirage});
`
const ArticleHeaderWrapper = styled('header')`
  ${tw`max-w-xl mx-auto relative z-20 md:px-5 lg:px-0 mb-16`}
  @media (min-width:  576px) {
    margin-top: -5rem;
  }
  @media (min-width:  1921px) {
    margin-top: -8rem;
  }
`
const ArticleHeaderContent = styled('div')`
  ${tw`bg-white rounded-sm p-8 pt-6 pb-5 text-black border-black border-default border-solid relative z-10`}
  &:before {
    content: "";
    ${tw`absolute rounded-sm w-full h-full bg-transparent border-white border-default border-solid`}
    z-index: -10;
    top: 10px;
    left: -10px;
  }
`
const ArticleHeaderGrid = styled('div')`
  ${tw`flex flex-col md:flex-row`}
`
const ArticleTitle = styled('h1')`
  ${tw`font-serif text-4xl md:pr-2 md:text-6xl m-0 w-full md:w-1/2 mb-4 md:mb-0`}
  line-height: 1.3;
`
const ArticleDescription = styled('div')`
  ${tw`text-base w-full md:w-1/2 md:pl-2`}
  p {
    ${tw`m-0 leading-normal md:text-lg font-normal mt-2`}
  }
`
const ArticleHeaderDetails = styled('ul')`
  ${tw`m-0 list-reset uppercase w-full font-bold text-comet-light flex flex-row relative z-10 mb-auto`};
  li {
    ${tw`flex items-center mr-2`};
    :not(:first-of-type):before {
        content: "·";
        ${tw`mr-2`}
      }
  }
  a {
    ${tw`text-comet-lighter no-underline`}
    transition: all .2s ease;
    :hover {
      ${tw`text-black`}
    }
  }
`
const ArticleHeaderLine = styled('hr')`
  ${tw`w-full bg-comet-lighter opacity-50 my-6 border-0`}
  height: 1px;
`

const ArticleContent = styled('section')`
  ${tw`mx-auto mt-10`}
  h2, h3, h4, h5 {
    ${tw`font-serif`}
  }
  h2 {
    ${tw`text-4xl md:text-5xl lg:text-6xl mt-12`}
  }
  h3 {
    ${tw`text-3xl mt-12`}
  }
  h4 {
    ${tw`text-2xl`}
  }
  ul, ol {
    list-style-position: outside;
    li {
      ${tw`mb-6`}
    }
  }
  p, ul, ol {
    ${tw`text-lg leading-loose`}
  }
  .gatsby-resp-image-figure, .gatsby-resp-image-wrapper {
    ${tw`w-full mx-auto max-w-xl xl:max-w-2xl`}
  }
  figcaption {
    ${tw`text-sm py-1`}
    &:before {
      content: "↪ "
    }
  }
  img {
    ${tw`mx-auto block`}
  }
`

const Disqus = styled('footer')`
  ${tw`mx-auto max-w-xl mt-10 sm:mt-20`}
`

class BlogPostTemplate extends React.Component {
  render() {
    const siteUrl = this.props.data.site.siteMetadata.siteUrl
    const post = this.props.data.mdx
    const { title, description, featuredImage, date, author, readingTime} = post.frontmatter;
    const { previous, next } = this.props.pageContext

    const disqusShortname = "trying-to-work";
    const disqusConfig = {
      identifier: post.id,
      title: title,
    };

    return (
      <Layout>
        <SEO title={title} description={description || post.excerpt} />

        <Helmet>
          <meta property="og:image" content={siteUrl + featuredImage.childImageSharp.resize.src} />
          <meta property="image" content={siteUrl + featuredImage.childImageSharp.resize.src} />
          <meta property="twitter:image" content={siteUrl + featuredImage.childImageSharp.resize.src} />
        </Helmet>

        <ArticleWrapper>

          <FeaturedImage>
            <ImgOverlay />
            <ImgBlend />
            {featuredImage &&
            <Img alt={title} sizes={featuredImage.childImageSharp.sizes} />
            }
          </FeaturedImage>

          <ArticleHeaderWrapper>
            <ArticleHeaderContent>
              <ArticleHeaderGrid>
                <ArticleTitle>
                  {title}
                </ArticleTitle>
                <ArticleDescription>
                  <p>{description || post.excerpt}</p>
                </ArticleDescription>
              </ArticleHeaderGrid>
              <ArticleHeaderLine />
              <ArticleHeaderDetails>
                <li>{date}</li>
                <li>{readingTime} Min Read</li>
                {/* <li><a href={"//twitter.com/"+author}>{"@" + author}</a></li> */}
              </ArticleHeaderDetails>
            </ArticleHeaderContent>
          </ArticleHeaderWrapper>

          <ArticleContent>
            <MDXRenderer>{this.props.data.mdx.code.body}</MDXRenderer>
          </ArticleContent>

          {/* <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  <Img alt={title} sizes={previous.frontmatter.featuredImage} />

                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul> */}

        <Disqus>
          <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        </Disqus>

        </ArticleWrapper>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        title
        author
        image
        siteUrl
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      frontmatter {
        title
        date(formatString: "MMMM YYYY")
        author
        description
        readingTime
        featuredImage {
          childImageSharp{
              sizes(maxWidth: 1280) {
                  ...GatsbyImageSharpSizes_withWebp
              }
              resize(width: 1200, quality: 90) {
                src
              }
          }
        }
      }
      code {
        body
      }
    }
  }
`
