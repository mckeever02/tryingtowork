/* global tw */
import React from "react"
import { graphql } from "gatsby"
import styled from '@emotion/styled'
import Layout from "../components/layout"
import SEO from "../components/seo"
import BlogItem from "../components/blogItem.js"
import PageTitle from '../components/pageTitle';

const BlogWrapper = styled('div')`
  ${tw`max-w-2xl mx-auto`}
`


class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMdx.edges

    return (
      <Layout>
        <SEO
          title="The Blog"
          description="The Trying to work blog brings you the best places to work remotely in Belfast, Dublin and London."
        />

        <PageTitle title="The Blog" />

        <BlogWrapper>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <BlogItem node={node} key={node.fields.slug} />
            )
          })}
        </BlogWrapper>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD YYYY")
            title
            description
            featuredImage {
              childImageSharp{
                sizes(maxWidth: 630) {
                    ...GatsbyImageSharpSizes_withWebp
                }
              }
            }
          }
        }
      }
    }
  }
`
