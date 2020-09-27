import React from 'react'
import { graphql } from 'gatsby'
import Layout from "../components/layout"
import SEO from "../components/seo"
import Spaces from '../components/spaces';
import PageTitle from '../components/pageTitle';


export default class Madrid extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			selectedValue: "Madrid",
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
			<SEO title={"Spaces to work in "+this.state.selectedValue} metaTitle={"Spaces to work online in "+this.state.selectedValue+" | Trying to work"} description={"Find spaces to work online in " +this.state.selectedValue+ ". For freelancers, remote workers and digital nomads."} />

			<PageTitle title="Trying to work" description={"Find spaces to work online in "+this.state.selectedValue+ " City Centre"}  />

			<Spaces data={this.props.data.allGoogleSheetSpacesRow} />
      </Layout>
    )
  }
}

export const query = graphql`
	query Madrid {
		allGoogleSheetSpacesRow(filter: { city: {eq: "Madrid" }}) {
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