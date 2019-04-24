/* global tw */
import React from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import styled from '@emotion/styled';
import Moment from 'react-moment';
// import {StaticMap} from 'react-map-gl';
import classnames from "classnames"
import StarRatingComponent from 'react-star-rating-component';
import Icon from './icon'

import {colors} from './theme'


// const MAPBOX_TOKEN = process.env.GATSBY_MAPBOX_TOKEN
// const PLACES_API_KEY = process.env.PLACES_API_KEY

const SpaceWrapper = styled('div')`
    ${tw`w-full sm:px-8 mb-5 sm:mb-10 font-mono text-white`};
`

const SpaceItem = styled('div')`
    ${tw`border mx-auto border-solid border-black border-r-0 border-b-0 relative rounded-sm bg-steel-gray z-10`};
    :after, :before {
        content: "";
        ${tw`border border-solid border-black rounded-sm bg-steel-gray h-full w-full absolute bg-steel-gray`};
    }
    :before, :after {
        ${tw`bg-steel-gray`}
    }
    :before {
        top: .3em;
        right: -.4em;
        z-index: -1;
    }
    :after {
        top: .6em;
        right: -.75em;
        z-index: -2;
    }
    max-width: 570px;
`

const SpaceHeader = styled('header')`
    ${tw`px-4 pt-4 pb-3 bg-ebony-clay border border-t-0 border-l-0 border-solid border-black relative flex flex-col`};
    min-height: 130px;
`

const SpaceTitle = styled('h3')`
    ${tw`m-0 mb-1 font-serif text-3xl relative z-10 whitespace-no-wrap w-100 block overflow-hidden`};
    text-overflow:ellipsis;
`
const SpaceDetails = styled('ul')`
    ${tw`m-0 list-reset uppercase w-full overflow-x-auto overflow-y-hidden whitespace-no-wrap text-xs flex flex-row relative z-10 mb-auto`};
    -webkit-overflow-scrolling: touch;
    ::-webkit-scrollbar {
        width: 0 !important;
        overflow: -moz-scrollbars-none;
    }
`
const SpaceDetail = styled('li')`
	${tw`flex items-center mr-1 tracking-xl whitespace-no-wrap`};
	:not(:first-of-type):before {
        content: "·";
        ${tw`mr-1`}
    }
    .dv-star-rating {
        ${tw`block`}
        left: 0;
        top: 1px;
        min-width: 60px;
    }
    .dv-star-rating-star {
        position: relative;
        padding-right: 1px;
    }
    .icon {
        width: 11px;
        height: 11px;
    }
`

const SpaceBody = styled('div')`
    ${tw`bg-steel-gray border border-black border-solid border-t-0 border-l-0`}
`

const SpaceBodyItem = styled('div')`
	${tw`flex flex-row items-center pl-4 border border-t-0 border-l-0 border-r-0 border-solid border-black`};
	height: 54px;
	:last-of-type {
		border-bottom: 0;
    }
    .icon {
        ${tw`text-white mr-4 text-white`};
    }
`

const SpaceTime = styled('span')`
	${tw`text-xxs uppercase ml-auto text-comet mr-4 tracking-xl font-semibold`};
`

const SpaceLinks = styled('ul')`
	${tw`flex content-center w-full whitespace-no-wrap overflow-x-auto mt-auto m-0 p-0 relative z-10`};
`

const SpaceLink = styled('li')`
    ${tw`block mr-4 text-xxs text-grey`};
    .icon {
        ${tw`mr-1 relative`};
        top: 1px;
        width: .6875rem;
        height: .6875rem
    }
    a {
        ${tw`text-grey text-bold no-underline leading-none`};
        :hover {
            ${tw`text-white`};
        }
    }
    &.last {
        ${tw`mr-0 ml-auto`};
    }
`

const SpaceCopy = styled('button')`
	appearance: none;
	outline: none;
    ${tw`ml-auto px-10 font-bold py-4 bg-transparent text-white text-base font-mono cursor-pointer hover:bg-ebony-clay`}
    border: none;
    border-left: 1px solid ${colors.woodSmoke};
	:active {
		${tw`bg-steel-gray`}
	}
`

// const MapWrapper = styled('div')`
//     ${tw`absolute pin-t pin-l w-full h-full z-0 overflow-hidden`}
// `

// const MapWrapperOverlay = styled('div')`
//     ${tw`absolute pin-t pin-l w-full h-full z-10`}
//     background: linear-gradient(0deg, rgba(38, 43, 60, .8) 0%, rgba(38, 43, 60, 1) 100%);
// `

export default class Space extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '',
            copied: false,
            rating: 0,
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            saturday: "",
            sunday: "",
            distance: 0
        };
    }

    render() {

        const space = this.props.node.space,
        city = this.props.node.city,
        location = this.props.node.location,
        sockets = this.props.node.sockets,
        website = this.props.node.website,
        mapsurl = this.props.node.mapsurl,
        twitter = this.props.node.twitter,
        speed = this.props.node.speed,
        timestamp = this.props.node.timestamp,
        password= this.props.node.password,
        rating= this.props.node.rating,
        monday = this.props.node.monday,
        tuesday = this.props.node.tuesday,
        wednesday = this.props.node.wednesday,
        thursday = this.props.node.thursday,
        friday = this.props.node.friday,
        saturday = this.props.node.saturday,
        sunday = this.props.node.sunday,
        userLat = this.props.userLat,
        userLng = this.props.userLng,
        filterDistance = this.props.filterDistance;

        let lat = this.props.node.latitude,
            lng = this.props.node.longitude,
            type = this.props.node.type;


        try {
            lat = lat.replace(/"/g, "");
            lng = lng.replace(/"/g, "");
            type = type.replace("_", / /g);
        } catch(error) {

        }

        // Converts numeric degrees to radians
        function toRad(Value) {
            return Value * Math.PI / 180;
        }

        function getDistance(lat1, lon1, lat2, lon2) {

            var R = 6371; // km
            var dLat = toRad(lat2 - lat1);
            var dLon = toRad(lon2 - lon1);
            var lat1 = toRad(lat1);
            var lat2 = toRad(lat2);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        }


        // function returnDistance() {
        //     return getDistance(userLat,userLng,lat,lng).toFixed(1);
        // }

        const returnDistance = () => {
            const dist = getDistance(userLat, userLng, lat, lng).toFixed(1);
            // this.props.onCalculateDistance(dist);
            return dist;
        }

        // const setDistance = () => {
        //     this.props.getDistance = getDistance(userLat, userLng, lat, lng).toFixed(1);
        //     return this.props.getDistance;
        // }

        //Assign text color based on Wifi Speed
        function speedColor() {
          if(speed >= 20) {
              return 'text-green'
          } else if(speed >= 3.9 ) {
              return 'text-orange'
          } else {
              return 'text-red'
          }
        }

        function getOpeningTimes() {
            const day = new Date().toLocaleString('en-us', { weekday: 'long' })
            let dayReturn = ""
            switch (day) {
                case "Monday":
                    dayReturn =  monday.replace("Monday:", "Open today ");
                    break;
                case "Tuesday":
                    dayReturn = tuesday.replace("Tuesday:", "Open today ");
                    break;
                case "Wednesday":
                    dayReturn = wednesday.replace("Wednesday:", "Open today ");
                    break;
                case "Thursday":
                    dayReturn = thursday.replace("Thursday:", "Open today ");
                    break;
                case "Friday":
                    dayReturn = friday.replace("Friday:", "Open today ");
                    break;
                case "Saturday":
                    dayReturn = saturday.replace("Saturday:", "Open today ");
                    break;
                case "Sunday":
                    dayReturn = sunday.replace("Sunday:", "Open today ");
                    break;
                default:
                    dayReturn = "Not available";
                    break;
            }

            if (dayReturn.includes("Closed")) {
                return (
                    <strong className={"text-red"}>
                        {dayReturn.replace("Open today", "") + " Today"}
                    </strong>
                );
            } else {
                return (
                    <span>
                    { dayReturn}
                    </span>
                )
            }
        }

        function getSocketsIcon() {

            switch(sockets) {
                case "None":
                    return (
                        <>
                        <Icon name="socket" class="text-comet" />
                        </>
                    )
                case "Some":
                    return (
                        <>
                        <Icon name="socket" class="text-white" />
                        <Icon name="socket" class="text-white" />
                        </>
                    )
                case "Many":
                    return (
                        <>
                        <Icon name="socket" class="text-white" />
                        <Icon name="socket" class="text-white" />
                        <Icon name="socket" class="text-white" />
                        </>
                    )
                default:
                    return null;
            }
        }

        function ratingColor() {
            if (rating >= 4.5) {
                return colors.waterLeaf
            } else {
                return '#ffffff'
            }
        }

        function halfStar() {
            if (rating >= 4.5) {
                return <Icon class="text-water-leaf" name="star-half" />
            } else {
                return <Icon class="text-white" name="star-half" />
            }
        }

        return (
            <SpaceWrapper>
            <SpaceItem>
                <SpaceHeader>
                    <SpaceTitle title={space}>
                        {space}
                    </SpaceTitle>
                    <SpaceDetails>
                        {userLat && filterDistance ?
                        <SpaceDetail>
                            {returnDistance()}
                            <span>km</span>
                        </SpaceDetail>
                        : null }
                        {city && this.props.modal ?
                        <SpaceDetail>{city}</SpaceDetail>
                        : null}
                        {type ?
                        <SpaceDetail>{type}</SpaceDetail>
                        : null }
                        {location ?
                        <SpaceDetail>{location}</SpaceDetail>
                        : null }
                        {rating ?
                        <SpaceDetail title={rating + " stars"}>
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
                        </SpaceDetail>
                        : null }
                        {sockets ?
                        <SpaceDetail title={sockets+ " Sockets Available"}>{getSocketsIcon()}</SpaceDetail>
                        : null}
                    </SpaceDetails>
                    <SpaceLinks>
                        {website ?
                        <SpaceLink>
                            <a className="transition-base" rel="noopener noreferrer" target="_blank" href={website}>
                            <Icon name="link" />
                            Website</a>
                        </SpaceLink>
                        :
                        null
                        }
                        {mapsurl ?
                        <SpaceLink>
                            <a className="transition-base" rel="noopener noreferrer" target="_blank" href={mapsurl}>
                            <Icon name="compass" />
                            Directions</a>
                        </SpaceLink>
                        :
                        null
                        }
                        {twitter ?
                        <SpaceLink className="last">
                            Submitted by <a className="transition-base" rel="noopener noreferrer" target="_blank" href={"https://twitter.com/" + twitter}>@{twitter}</a>
                        </SpaceLink>
                        :
                        null
                        }
                    </SpaceLinks>
                    {/* { lat ?
                    <MapWrapper>
                        <MapWrapperOverlay></MapWrapperOverlay>
                        {<StaticMap
                        mapStyle="mapbox://styles/mckeever02/cjsvqwp650t2x1fqt8xx6sd54"
                        width={'100%'}
                        height={'125%'}
                        latitude={parseFloat(lat)}
                        longitude={parseFloat(lng)}
                        attributionControl={false}
                        zoom={16}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        reuseMaps={true}
                        preserveDrawingBuffer={true}
                        disableTokenWarning={true}
                        />
                    </MapWrapper>
                    : null } */}
                </SpaceHeader>
                <SpaceBody>
                    <SpaceBodyItem>
                        <Icon name="speed" />
                        <span className={classnames(speedColor())}>
                            {speed &&
                            speed + "Mbps"
                            }
                        </span>
                        { timestamp ?
                        <SpaceTime>
                        Updated: <Moment parse="DD/MM/YYYY HH:mm:ss" format="DD·MM·YY">{timestamp}</Moment>
                        </SpaceTime>
                        :
                        null }
                    </SpaceBodyItem>
                    <SpaceBodyItem>
                        {password !== "Signup Required" && password !== "No Password" ?
                            <Icon name="lock" />
                        :
                            <Icon name="unlock" />
                        }
                        {password}
                        {password !== "Signup Required" && password !== "No Password" ?
                        <CopyToClipboard text={password} onCopy={() => this.setState({ copied: true })}>
                            <SpaceCopy>{this.state.copied ? "Copied" : "Copy"}</SpaceCopy>
                        </CopyToClipboard>
                        : null }
                    </SpaceBodyItem>
                    <SpaceBodyItem>
                        <Icon name="clock" />
                            { getOpeningTimes() }
                    </SpaceBodyItem>
                </SpaceBody>
            </SpaceItem>
            </SpaceWrapper>
        )
    }
}