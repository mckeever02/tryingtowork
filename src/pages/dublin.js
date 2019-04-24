/*
 * NOTE: The Babel plugin will automatically process the `tw()` function, which
 * means we don’t actually need to import it. ESLint will complain about this,
 * however, so we need to add `tw` as a global variable.
 */

import React from 'react'
import { graphql } from 'gatsby'
import Layout from "../components/layout"
import SEO from "../components/seo"
import Spaces from '../components/spaces';
import PageTitle from '../components/pageTitle';

export default class Dublin extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			selectedValue: "Dublin",
		};
	}

	// onCalculateDistance = (dist) => {
	// 		// this.setState({
	// 		// 	distance: dist
	// 		// })
	// 		// console.log(dist)
	// 		return dist;
	// }


  render() {

    return (
      <Layout>
			<SEO title={"Spaces to work in "+this.state.selectedValue} keywords={[`${this.state.selectedValue}`, `digital nomad`, `co-working`, `online freelance`]} />

			<PageTitle title="Trying to work" description={"Find spaces to work online in "+this.state.selectedValue+ " City Centre"}  />

			<Spaces data={this.props.data.allGoogleSheetSpacesRow} />
      </Layout>
    )
  }
}

export const query = graphql`
	query Dublin {
		allGoogleSheetSpacesRow(filter: { city: {eq: "Dublin" }}) {
			edges {
				node {
					id
					space
					city
					location
					type
					speed
					password
					sockets
					timestamp
					latitude
					longitude
					website
					mapsurl
					twitter
					rating
					monday
					tuesday
					wednesday
					thursday
					friday
					saturday
					sunday
				}
			}
		}
	}
`