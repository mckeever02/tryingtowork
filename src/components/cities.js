/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import { colors } from "../components/theme"
import {Link} from 'gatsby'



const ButtongroupWrapper = styled('div')`
	${tw`sm:px-4 mx-auto lg:max-w-lg mb-6 mt-3 py-4`}
	overflow: auto;
	-webkit-overflow-scrolling: auto;
`

const Button = styled(Link)`
	${tw`relative rounded-sm bg-steel-gray block flex-auto text-center cursor-pointer no-underline`}
	transition: all .2s ease;
	border: 1px solid ${colors.woodSmoke};
	min-width: 130px;
	span {
		${tw`relative z-20 rounded-sm bg-steel-gray text-sm sm:text-base text-comet-light block py-4 sm:py-5 flex-auto text-center`}
		border: 1px solid transparent;
		transition: all .2s ease;
	}
	:hover {
		${tw`bg-ebony-clay`}
		span {
			${tw`bg-ebony-clay text-white`}
		}
	}
	&.active {
		${tw`font-bold bg-white`}
		span {
			${tw`bg-white rounded-sm block text-black relative`}
			border: 1px solid ${colors.woodSmoke};
			transform: translate(5px, -5px);
		}
		:hover {
			${tw`bg-water-leaf-dark`}
		}
	}
	:first-of-type {
		${tw`rounded-r-none z-50`}
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	:nth-of-type(2) {
		${tw`z-50`}
		left: -2px!important;
	}
	:nth-of-type(3) {
		${tw`z-40`}
		left: -3px!important;
	}
	:nth-of-type(4) {
		${tw`z-30`}
		left: -4px!important;
	}
	:nth-of-type(5) {
		${tw`z-20`}
		left: -5px!important;
	}
	:nth-of-type(6) {
		${tw`z-10`}
		left: -6px!important;
	}
	:last-of-type {
		${tw`rounded-l-none`}
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
	:not(:first-of-type) {
		left: -1px;
	}
`

const Buttongroup = styled('div')`
	${tw`flex flex-row space-around`}
`

export default class Cities extends React.Component {
    render() {
        return (
            <ButtongroupWrapper>
                <Buttongroup>
					{
					this.props.cities.map(city =>
						<Button key={city.name} activeClassName="active" to={city.link}><span>{city.name}</span></Button>)
					}
                    {/* <StyledRadio id="Belfast" onChange={this.props.filterCity} value="Belfast" />
                    <label htmlFor="Belfast">
                        <span>Belfast</span>
                    </label>
                    <StyledRadio id="Dublin" onChange={this.props.filterCity} value="Dublin" />
                    <label htmlFor="Dublin">
                        <span>Dublin</span>
                    </label>
					<StyledRadio id="London" onChange={this.props.filterCity} value="London" />
					<label htmlFor="London">
						<span>London</span>
					</label> */}
                </Buttongroup>
            </ButtongroupWrapper>
        )
    }
}