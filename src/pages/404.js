/*
 * NOTE: The Babel plugin will automatically process the `tw()` function, which
 * means we don’t actually need to import it. ESLint will complain about this,
 * however, so we need to add `tw` as a global variable.
 */

import React from 'react'
import Layout from "../components/layout"
import SEO from "../components/seo"
import PageTitle from '../components/pageTitle';

export default class fourohfour extends React.Component {

  render() {

    return (
      <Layout headerTitle="Four oh Four" headerDescription="Sorry, this page cannot be found">
		    <SEO title="404" />
        <PageTitle title="404" description={"Sorry, this page cannot be found"}  />
      </Layout>
    )
  }
}