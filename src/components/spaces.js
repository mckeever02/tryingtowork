/*
 * NOTE: The Babel plugin will automatically process the `tw()` function, which
 * means we don’t actually need to import it. ESLint will complain about this,
 * however, so we need to add `tw` as a global variable.
 */

/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import Filters from './filters';
import Space from "./space"
import Cities from './cities';
import {colors} from './theme'
import { StaticQuery, graphql } from "gatsby"
import TravoltaGif from '../images/lost.gif'
import TravoltaWebp from '../images/lost.webp'



const SpacesWrapper = styled('section')`
	${tw`flex flex-wrap mt-6 sm:mt-12 mx-auto`}
	max-width: 1900px;
`

const SpaceWrapper = styled('div')`
	${tw`w-full lg:w-1/2 xl:w-1/3 mb-6`}
`

const EmptyState = styled('div')`
 ${tw`flex flex-col items-center relative justify-center text-center px-10 w-full mb-20`}
	span {
		${tw`text-center block`}
	}
	img {
		// filter: grayscale(100%);
		max-height: 300px;
	}
`

const ImgContainer = styled('div')`
	${tw`relative`}
`

const ImgBlend = styled('div')`
	${tw`absolute pin-t pin-l w-full h-full z-10`}
	background: linear-gradient(180deg, rgba(28, 30, 44, 0) 0%, ${colors.mirage} 100%);
`

const EmptyStateContent = styled('div')`
	${tw`text-center relative z-10`}
	h3 {
		${tw`text-4xl font-serif relative m-0`}
	}
	p {
		${tw`text-comet-light m-0 mt-3`}
	}
`

// const ImgOverlay = styled('div')`
//     ${tw`absolute pin-t pin-l w-full h-full z-20 bg-mirage opacity-50`}
//     transition: all .2s ease;
// `

export default class Spaces extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: "",
			fastWifi: false,
			filterSockets: false,
			filterRating: false,
			openToday: false,
			userLat : false,
			userLng: false,
			selectedValue: "Belfast",
			filterDistance: false,
			distanceError: false,
			distanceErrorMessage: ""
		};
		this.filterSpeed = this.filterSpeed.bind(this);
		this.filterSockets = this.filterSockets.bind(this);
		this.filterRating = this.filterRating.bind(this);
		this.filterCity = this.filterCity.bind(this);
		this.filterDistance = this.filterDistance.bind(this, 'filterDistance');
		this.updateSearch = this.updateSearch.bind(this);
	}

	updateSearch(event) {
		this.setState({search: event.target.value});
	}

	filterSpeed() {
		if (this.state.fastWifi){
			this.setState ({
				fastWifi: 0
			});
		} else {
			this.setState ({
					fastWifi: 20
			});
		}
	}

	filterSockets() {
		if (this.state.filterSockets){
			this.setState ({
				filterSockets: false
			});
		} else {
			this.setState ({
					filterSockets: true
			});
		}
	}

	filterRating() {
		if (this.state.filterRating){
			this.setState ({
				filterRating: false
			});
		} else {
			this.setState ({
					filterRating: true
			});
		}
	}

	filterDistance() {
		if (this.state.filterDistance){
			this.setState ({
				filterDistance: false
			});
		} else {
			this.setState ({
					filterDistance: true
			});
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						let lat = position.coords.latitude
						let lng = position.coords.longitude
						// console.log("getCurrentPosition Success " + lat + lng) // logs position correctly
						this.setState({
								userLat: lat,
								userLng: lng,
						})
					},
					(error) => {
						this.setState({
							filterDistance: false,
							distanceError: true
						})
						switch(error.code) {
							case error.PERMISSION_DENIED:
									this.setState({
										distanceErrorMessage: "Psst. You need to enable geolocation in your browser."
									})
							break;
							case error.POSITION_UNAVAILABLE:
									this.setState({
										distanceErrorMessage: "Location information is unavailable."
									})
							break;
							case error.TIMEOUT:
									this.setState({
										distanceErrorMessage: "The request to get user location timed out."
									})
							break;
							case error.UNKNOWN_ERROR:
									this.setState({
										distanceErrorMessage: "An unknown error occurred."
									})
							break;
							default:
								this.setState({
									distanceErrorMessage: "An unknown error occurred."
								})
							break;
						}
					},
					{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
				)
			} else {
					this.setState({
						distanceErrorMessage: "Your browser doesn't support geolocation.."
					})
			}
		}
	}
	filterCity(event) {
		this.setState({
			selectedValue: event.target.value,
		})
	}

	filteredCity() {
		return ({ node }) => (node.city === this.state.selectedValue);
	}

	filteredSpeed() {
		return ({ node }) => (node.speed >= this.state.fastWifi);
	}

	// filteredDistance() {
	// 	return ({ node }) => (node.onCalculateDistance === undefined );
	// }


	filteredRating() {
		const rating = this.state.filterRating;
		if (rating) {
			return ({ node }) => (node.rating >= 4.5);
		} else {
			return ({ node }) => (node.rating >= 0);
		}
	}

	filteredSockets() {
		const sockets = this.state.filterSockets;
		if (sockets) {
			return ({ node }) => (node.sockets === "Some" || node.sockets === "Many");
		} else {
			return ({ node }) => (node.sockets === "Some" || node.sockets === "Many" || node.sockets === "None");
		}
	}

	// onCalculateDistance = (dist) => {
	// 		// this.setState({
	// 		// 	distance: dist
	// 		// })
	// 		// console.log(dist)
	// 		return dist;
	// }


  render() {

		const activeCity = this.state.activeCity ? 'active' : null;

		let filteredResults = this.props.data.edges.filter(
			({node}) => (
				node.space.toLowerCase().includes(this.state.search.toLowerCase()) || node.location.toLowerCase().includes(this.state.search.toLowerCase()) || node.type.toLowerCase().includes(this.state.search.toLowerCase())
			)
		);

		return(
			<StaticQuery
					query={graphql`
						query Cities {
							site {
								siteMetadata {
									cities {
										name
										link
									}
								}
							}
						}
					`}
					render={data => (
						<div>
							<Cities cities={data.site.siteMetadata.cities} />

							<Filters distanceError={this.state.distanceError} distanceErrorMessage={this.state.distanceErrorMessage} filterDistance={this.state.filterDistance} search={this.state.search} updateSearch={this.updateSearch} filterSpeed={this.filterSpeed} filterSockets={this.filterSockets} filterRating={this.filterRating} filterDistance={this.filterDistance} />

							<SpacesWrapper>
								{filteredResults.length > 0 ?
									filteredResults.filter(this.filteredSpeed()).filter(this.filteredSockets()).filter(this.filteredRating()).reverse().map(({ node }) => {
										return (
											<SpaceWrapper key={node.id}>
												<Space node={node} filterDistance={this.state.filterDistance} userLat={this.state.userLat} userLng={this.state.userLng} />
											</SpaceWrapper>
										)
								}
								)
								:
								<EmptyState className="fadeIn">
									<ImgContainer>
									<ImgBlend />
									<picture>
										<source srcset={TravoltaWebp} type="image/webp" />
										<source srcset={TravoltaGif} type="image/gif" />
										<img src={TravoltaGif} alt="No results" />
									</picture>
									</ImgContainer>
									<EmptyStateContent>
										<h3>Sorry, no results.</h3>
										<p>Try altering your search query</p>
									</EmptyStateContent>
								</EmptyState>
								}
							</SpacesWrapper>
						</div>
					)}
			/>
		)
  }
}