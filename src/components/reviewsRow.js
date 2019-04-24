/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import Icon from './icon'

const ReviewsRow = styled('div')`
    ${tw`flex flex-col sm:flex-row justify-between content-top mx-auto max-w-lg py-10`}
`

const ReviewWrapper = styled('div')`
    ${tw`w-full sm:w-1/3 sm:mx-4 md:mx-8 lg:mx-10 relative z-10 mb-5 sm:mb-0`}
    :before {
        content: "";
        ${tw`border border-solid border-black rounded-sm  h-full w-full absolute bg-steel-gray`}
        top: 6px;
        left: -6px;
        z-index: -1;
    }
    @media (min-width:  577px) {
        :nth-of-type(2) {
            top: 1.5rem;
        }
    }
`

const Review = styled('div')`
    ${tw`text-center p-5 flex flex-col justify-center items-center bg-steel-gray border-black border-solid border-default rounded-sm`}
    h5 {
        ${tw`text-3xl m-0 font-mono font-bold mt-5`}
        span {
            ${tw`text-comet block text-xl mt-1`}
        }
    }
    .icon {
        height: 1.5rem;
        width: 1.5rem;
    }
`

export default class reviewsRow extends React.Component {
    render() {
        return (
            <ReviewsRow>
                <ReviewWrapper>
                    <Review>
                        <Icon name="google" />
                        <h5>{this.props.google} <span>/5</span></h5>
                    </Review>
                </ReviewWrapper>
                <ReviewWrapper>
                    <Review>
                        <Icon name="tripadvisor" />
                        <h5>{this.props.tripadvisor} <span>/5</span></h5>
                    </Review>
                </ReviewWrapper>
                <ReviewWrapper>
                    <Review>
                        <Icon name="foursquare" />
                        <h5>{this.props.foursquare} <span>/10</span></h5>
                    </Review>
                </ReviewWrapper>
            </ReviewsRow>
        )
    }
}