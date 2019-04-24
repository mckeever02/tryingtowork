/*
 * NOTE: The Babel plugin will automatically process the `tw()` function, which
 * means we don’t actually need to import it. ESLint will complain about this,
 * however, so we need to add `tw` as a global variable.
 */

/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import Layout from "../components/layout"
import SEO from "../components/seo"
import PageTitle from '../components/pageTitle';

const ContentWrapper = styled('article')`
    ${tw`mt-6 mx-auto`}
    max-width: 600px;
    h2 {
        ${tw`font-serif text-3xl`}
        :not(:first-of-type) {
          ${tw`mt-10`}
        }
    }
    p {
        ${tw`leading-loose text-sm sm:text-base text-comet-lighter`}
        a {
          ${tw`text-comet-lighter hover:text-white`}
        }
    }
`

export default class About extends React.Component {

  render() {

    return (
        <Layout>
        <SEO title="About" description="Trying to work is a collection of spaces to work online as a digital nomad or online worker in Belfast, Dublin and London. Find fast wifi speeds and quiet places to work." />

        <PageTitle title="About this site" />


        <ContentWrapper>
            <h2>Wtf is this?</h2>
            <p>Trying to work is a collection of spaces to work online as a digital nomad or online worker in Belfast, Dublin and London (with more cities coming).</p>

            <p>It's a side-project born from a freelancer's frustrations of trying to find decent places to work online when out and about in local city centres.</p>

            <p>Often I would get to a coffee shop, order, sit down to work and then discover that the WiFi speed sucks, or worse, doesn't work at all! So I decided to start cataloging local spaces and their wifi speeds to share with fellow remote workers and digital nomads. And so, Trying To Work was born.</p>

            <h2>Where's my city?</h2>

            <p>Want your city added? Awesome, submit 3 or more of the best spaces for people to work online in your city and it will be added to the site.</p>

            <h2>Have a question?</h2>

            <p>Came across any bugs? Have any suggestions on how I can improve this site? Or just want to talk to me? You can send me a <a href="//twitter.com/mmckvr">DM on Twitter</a>, <a href="mailto:michael@mckvr.com">email me</a> or <a href="#">open an issue on Github</a>.</p>

            <h2>Colophon</h2>

            <p>This site is built with Gatsby, powered by React and hosted on Netlify. Body text is set in Fira Mono by Mozilla. Header text is set in Tiempos Headline by Klim Type.</p>

            <p>Design and development by <a href="//twitter.com/mmckvr">Michael McKeever</a></p>

        </ContentWrapper>

      </Layout>
    )
  }
}