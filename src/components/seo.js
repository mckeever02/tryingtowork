import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { StaticQuery, graphql } from "gatsby"

function SEO({ description, lang, meta, keywords, title, image }) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={data => {
        const image = `${data.site.siteMetadata.siteUrl}${image || data.site.siteMetadata.defaultImage}`;
        const metaDescription =
          description || data.site.siteMetadata.description
        return (
          <Helmet
            defer={false}
            htmlAttributes={{
              lang,
            }}
            defaultTitle="Trying to work | Find spaces to work online"
            title={title}
            titleTemplate={`%s | ${data.site.siteMetadata.title}`}
          > <meta name="twitter:text:title" content={title} />
            <meta property="description" content={metaDescription} />
            <meta property="image" content={image} />
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={data.site.siteMetadata.siteUrl} />
            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={data.site.siteMetadata.siteUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:site" content="@tryingtowork" />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={image} />
          </Helmet>
        )
      }}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
  image: null
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
}

export default SEO

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
        siteUrl
        defaultImage: image
      }
    }
  }
`
