/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import Search from '../components/search';
import Toggle from '../components/toggle';

const SearchInputWrapper = styled('div')`
	${tw`max-w-lg mx-auto relative`}
`

const FilterWrapper = styled('div')`
	${tw`flex relative flex-row align-center justify-center sm:px-5`}
`

const ToggleWrapper = styled('div')`
	${tw`px-4 flex-auto`}
	:first-of-type {
		${tw`pl-0`}
	}
	:last-of-type {
		${tw`pr-0`}
	}
`

const ErrorMessage = styled('div')`
	${tw`text-red block text-center text-xs py-4 w-full`}
	bottom: -1rem;
	height: 45px;
`

export default class FilterSpaces extends React.Component {
	render(getCurrentPosition) {
        return (
			<SearchInputWrapper>
				<Search value={this.props.search} onChange={this.props.updateSearch} />

				<FilterWrapper>
					<ToggleWrapper>
						<Toggle
							name="fastWifi"
							label="Fast Wifi"
							onChange={this.props.filterSpeed}
						/>
					</ToggleWrapper>

					<ToggleWrapper>
						<Toggle
							name="socketsAvailable"
							label="Sockets"
							onChange={this.props.filterSockets}
						/>
					</ToggleWrapper>

					<ToggleWrapper>
						<Toggle
							name="highRating"
							label="High rating"
							onChange={this.props.filterRating}
						/>
					</ToggleWrapper>

					<ToggleWrapper>
						<Toggle
							name="showDistance"
							label="Show Distance"
							onClick={getCurrentPosition}
							onChange={this.props.filterDistance}
						/>
					</ToggleWrapper>

				</FilterWrapper>


				<ErrorMessage>
					{this.props.distanceError ?
					<div className="slideFadeOut">
						<span className="slideFadeIn">{this.props.distanceErrorMessage}</span>
					</div>
					: null
					}
				</ErrorMessage>

			</SearchInputWrapper>
        )
    }
}