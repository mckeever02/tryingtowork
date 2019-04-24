/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import classnames from "classnames"
import Icon from './icon'
import StarRatingComponent from 'react-star-rating-component';
import {colors} from './theme'


const SpaceBreakdownWrapper = styled('div')`
    ${tw`relative max-w-md lg:max-w-lg h-full z-10 mx-auto mb-12`}
    :before {
      content: "";
      ${tw`w-full h-full absolute border-default border-solid border-white`}
      top: .5rem;
      left: -.5rem;
    }
    @media (min-width:  577px) {
        margin-top: -5rem;
    }
`

const SpaceBreakdown = styled('div')`
    ${tw` text-xl bg-white text-black px-4 py-5 w-full flex flex-row justify-between relative z-20`}
    .dv-star-rating-star {
        padding-right: 1px;
        position: relative;
    }
`

const SpaceBreakdownItem = styled('div')`
    ${tw`w-1/3 text-center`}
    span {
        ${tw`block text-xl font-bold`}
    }
`

const SpaceBreakdownItemTitle = styled('h6')`
    ${tw`block uppercase font-mono font-bold m-0 mb-4 p-0 text-xs sm:text-sm tracking-wide`}
`

export default class spaceBreakdown extends React.Component {
    render() {
        const {speed, sockets, rating} = this.props;

        function speedColor() {
          if(speed >= 20) {
              return 'text-green-dark'
          } else if(speed >= 3.9 ) {
              return 'text-orange'
          } else {
              return 'text-red'
          }
        }

        function ratingColor() {
            return colors.yellow
        }

        function halfStar() {
            return <Icon class="text-yellow" name="star-half" />
        }

        function getSocketsIcon() {
            switch(sockets) {
                case "None":
                    return (
                        <>
                        <Icon title="No sockets available" name="socket" class="text-comet" />
                        </>
                    )
                case "Some":
                    return (
                        <>
                        <Icon title="Some sockets available" name="socket" />
                        <Icon title="Some sockets available" name="socket" />
                        </>
                    )
                case "Many":
                    return (
                        <>
                        <Icon title="Many sockets available" name="socket" />
                        <Icon title="Many sockets available" name="socket" />
                        <Icon title="Many sockets available" name="socket" />
                        </>
                    )
                default:
                    return null;
            }
        }

        return (

            <SpaceBreakdownWrapper>
                <SpaceBreakdown>
                    <SpaceBreakdownItem>
                        <SpaceBreakdownItemTitle>Speed</SpaceBreakdownItemTitle>
                        <span className={classnames(speedColor())}>
                            {
                            speed + "Mbps"
                            }
                        </span>
                    </SpaceBreakdownItem>
                    <SpaceBreakdownItem>
                        <SpaceBreakdownItemTitle>Sockets</SpaceBreakdownItemTitle>
                        <span>
                            {getSocketsIcon()}
                        </span>
                    </SpaceBreakdownItem>
                    <SpaceBreakdownItem>
                        <SpaceBreakdownItemTitle>Rating</SpaceBreakdownItemTitle>
                        <span>
                            <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            editing={false}
                            renderStarIcon={() => <Icon name="star" />}
                            renderStarIconHalf={() => halfStar()}
                            starColor={ratingColor()}
                            emptyStarColor={colors.comet}
                            value={rating}
                            />
                        </span>
                    </SpaceBreakdownItem>
                </SpaceBreakdown>
            </SpaceBreakdownWrapper>
        )
    }
}
