/* global tw */
import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Header from "./header"
import styled from '@emotion/styled'
import "./layout.scss"
import Footer from './footer'


const SiteWrapper = styled('div')`
  ${tw`bg-mirage flex flex-col min-h-screen text-white font-mono px-5 lg:px-0`};
`

const Main = styled('main')`
  min-height: 90vh;
`

export default ({ children}) => {
  return(
    <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
            menuLinks {
              name
              link
            }
          }
        }
      }
    `}
      render={data => (
        <SiteWrapper>
          <Header menuLinks={data.site.siteMetadata.menuLinks} siteTitle={data.site.siteMetadata.title} siteDescription={data.site.siteMetadata.description} />
            <Main>{children}</Main>
            <Footer />
        </SiteWrapper>
      )}
    />
    )
  }
