// Render Prop
/* global google */
/* global tw */
import React from 'react';
import Geosuggest from 'react-geosuggest';
import styled from '@emotion/styled';
import { colors } from "../components/theme.js";
import MapGL, {FlyToInterpolator, Marker} from 'react-map-gl';
import Space from "../components/space";
import Icon from './icon';
import TextInput from './textInput';
import Button from './button';
import successGif from '../images/success.gif';
import successWebp from '../images/success.webp';
import errorGif from '../images/error.gif';
import errorWebp from '../images/error.webp';


const MAPBOX_TOKEN = process.env.GATSBY_MAPBOX_API_KEY

const ModalForm = styled('div')`
  ${tw`w-full md:w-1/2 overflow-auto`}
  transition: .3s width linear;
`

const ModalFormWrapper = styled('div')`
  ${tw`p-4 sm:p-8`}
`

const FormWrapper = styled('div')`
  ${tw`sm:px-4`}
`
const ModalMap = styled('div')`
  ${tw`md:w-1/2 md:h-full invisible h-0 w-0 md:visible bg-mirage relative overflow-hidden`}
  // pointer-events: none;
  transition: .3s width linear;
`

const MapOverlay = styled('div')`
  ${tw`absolute w-full h-full pin-t pin-l`}
  background-color: rgba(33, 36, 52, .6);
  z-index: 1;
`

const Pin = styled('div')`
  ${tw`bg-water-leaf absolute`}
  z-index: 3;
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -20px 0 0 -20px;
  :after {
    ${tw`bg-ebony-clay absolute`}
    content: '';
    width: 14px;
    height: 14px;
    margin: 8px 0 0 8px;
    border-radius: 50%;
  }
`

const Pulse = styled('div')`
  background: rgba(0,0,0,0.4);
  border-radius: 50%;
  height: 14px;
  width: 14px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: 11px 0px 0px -12px;
  transform: rotateX(55deg);
  z-index: 2;
  :after {
    content: "";
    border-radius: 50%;
    height: 40px;
    width: 40px;
    position: absolute;
    margin: -13px 0 0 -13px;
    animation: pulsate 2s ease-out;
    animation-iteration-count: infinite;
    opacity: 0;
    box-shadow: 0 0 1px 2px ${colors.waterLeaf};
    animation-delay: 2s;
  }
`

const SpaceSuggest = styled(Geosuggest)`
  ${tw`relative font-mono`}
  input {
    ${tw`transition focus:outline-0 border-0 focus:bg-white text-white focus:text-black text-base md:text-lg rounded bg-mirage-dark py-4 md:py-5 px-3 pl-14 md:pl-16 w-full appearance-none leading-normal ds-input font-mono focus:outline-none`}
    border: 1px solid ${colors.woodSmoke};
    transition: all .1s ease-in;
    ::placeholder {
      ${tw`text-comet`}
    }
  }
  .geosuggest__suggests {
    ${tw`list-reset relative shadow-lg m-0 mt-3 absolute pin-l pin-r bg-black-rock text-white overflow-x-hidden overflow-y-auto rounded`}
    top: 100%;
    max-height: 25em;
    z-index: 5;
    transition: max-height 0.2s, border 0.2s;
  }
  .geosuggest__suggests--hidden {
    ${tw`p-0 overflow-hidden border-0`}
    max-height: 0;
  }
  .geosuggest__item {
    ${tw`mx-3 p-3 rounded text-base cursor-pointer hover:bg-grey-lighter`}
    :first-of-type {
      ${tw`mt-3`}
    }
    :last-of-type {
      ${tw`mb-3`}
    }
    :hover, :focus {
      ${tw`bg-water-leaf text-ebony-clay`}
    }
  }
  .geosuggest__item--active {
    ${tw`bg-water-leaf`}
    :hover, :focus {
      ${tw`bg-water-leaf`}
    }
  }
  .geosuggest__item__matched-text {
    font-weight: bold;
  }
`

const SearchIconWrapper = styled('div')`
  ${tw`absolute pin-t pin-l z-10 p-3 flex items-center justify-center text-comet`}
  width: 58px;
  height: 58px;
  .icon {
    ${tw`w-6 h-6`}
  }
  @media (min-width:  576px) {
    width: 67px;
    height: 67px;
  }
`

const Label = styled('label')`
  ${tw`font-mono uppercase tracked text-white text-xs mb-2 block`}
  a {
    ${tw`ml-2`}
  }
`

const Formgroup = styled('div')`
  ${tw`mb-8 text-white relative h-full`}
`

const Radiogroup = styled('div')`
  ${tw`flex flex-wrap flex-row justify-content-between mt-3`}
`

const CityItem = styled('div')`
  ${tw`pl-3 pb-3 w-1/2 sm:w-1/4`}
  :nth-of-type(2n+1) {
    padding-left: 0;
  }
  @media (min-width: 576px) {
    :nth-of-type(2n+1) {
      ${tw`pl-3`}
    }
  }
  :first-of-type {
    padding-left:0;
  }
`

const TypeItem = styled('div')`
  ${tw`pl-3 pb-3 w-1/2 sm:w-1/3`}
  :nth-of-type(2n+1) {
    padding-left: 0;
  }
  @media (min-width: 576px) {
    :nth-of-type(2n+1) {
      ${tw`pl-3`}
    }
    :nth-of-type(3n+1) {
      padding-left:0;
    }
  }
`

const MapContainer = styled('div')`
  ${tw`w-full`}
  overflow: hidden;
  height: 140%;
`

const Radio = styled('div')`
${tw`h-full`}
  label {
    ${tw`flex h-full items-center justify-center font-mono px-3 py-3 relative cursor-pointer capitalize text-center`}
    span {
      position: relative;
      z-index: 1;
    }
    :hover {
      div {
        transform: scaleY(1.10) scaleX(1.025);
      }
    }
  }
  input {
    position: absolute;
    z-index: -1;
    opacity: 0;
    :checked {
      ~label {
        ${tw`text-ebony-clay font-bold`};
        div {
          transform: scaleY(1.15) scaleX(1.05);
          ${tw`bg-white`};
        }
      }
    }
  }
`

const RadioBg = styled('div')`
  ${tw`block rounded bg-black-rock absolute pin-t pin-l w-full h-full`}
  z-index: 0;
  transform: scaleY(1) scaleX(1);
  transition: transform .15s ease-in-out;
`

const WifiWrapper = styled('div')`
  ${tw`flex flex-col md:flex-row`}
`

const SpeedContainer = styled('div')`
  ${tw`flex-1`}
  transition: all .2s ease;
`

const PasswordContainer = styled('div')`
  ${tw`md:pl-6 flex-1`}
  transition: all .2s ease;
`

const SpaceContainer = styled('div')`
  ${tw`w-full absolute pin-t pin-l z-10 p-10`}
`

const FormSubmitted = styled('div')`
  ${tw`absolute flex sm:items-center justify-center pin-t pin-l w-full h-full z-20 py-10 px-5 text-white bg-mirage`}
  .icon {
    ${tw`w-14 h-14 m-auto`}
  }
  h2 {
    ${tw`font-serif m-0 mb-4`}
    font-size: 10vw;
  }
  p {
    ${tw`leading-normal text-white m-0`}
  }
  @media (min-width: 500px ) {
    h2 {
      font-size: 6vw;
    }
  }
  @media (min-width: 1000px ) {
    h2 {
      font-size: 4vw;
    }
  }
`

const FormSubmittedWrapper = styled('div')`
  ${tw`font-mono max-w-lg flex flex-col content-center text-center`}
  a {
    ${tw`text-white`}
  }
  &.success {
    .icon {
      ${tw`text-green`}
    }
  }
  &.error {
    .icon {
      ${tw`text-red`}
    }
  }
`

const FormSubmittedText = styled('div')`
  ${tw`ml-5 relative z-30`}
`

const IconWrapper = styled('div')`
  ${tw`mx-5 my-auto`}
`

const ImgBlend = styled('div')`
    ${tw`absolute pin-t pin-l w-full h-full bg-mirage z-10 opacity-50`}
    mix-blend-mode: overlay;
`

const ImgOverlay = styled('div')`
    ${tw`absolute pin-t pin-l w-full h-full z-20`}
    transition: all .2s ease;
    background-image: radial-gradient(ellipse closest-side, rgba(28, 30, 44, 0.6), rgba(28, 30, 44, .95));
    @media (min-width: 1921px ) {
      background-image: radial-gradient(ellipse closest-side, rgba(28, 30, 44, 0.6), rgba(28, 30, 44, 1));
    }
`

const BgImg = styled('div')`
  ${tw`pin-t pin-l w-full h-full absolute overflow-hidden object-cover flex justify-center items-center`}
  img {
    ${tw`w-full object-cover`}
    filter: grayscale(100%);
  }
`
const Picture = styled('picture')`
  width: 100%!important;
  height: 100%!important;
`

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            space: "Enter a space",
            location: "",
            type: "",
            lat: 0,
            lng: 0,
            placeid: "",
            website: "",
            mapsurl: "",
            speed: "",
            password: "",
            twitter: "",
            showMarker: false,
            showSpace: false,
            passwordRequired: true,
            noPassword: false,
            signupRequired: false,
            otherCity: false,
            otherSpace: false,
            formDisabled: true,
            formFilled: false,
            formValid: false,
            formSubmitted: false,
            formSuccess: false,
            rating: 0,
            modalIsOpen: true,
            // formErrors: {speed: '', password: '',},
            speedValid: false,
            passwordValid: false,
            monday: "Not available",
            tuesday: "Not available",
            wednesday: "Not available",
            thursday: "Not available",
            friday: "Not available",
            saturday: "Not available",
            sunday: "Not available",
            viewport: {
              width: "100%",
              height: "100%",
              latitude: 53.34313789999999,
              longitude: -6.250659600000063,
              zoom: 12
            }
        };

        // const viewportLat = {...this.state.viewport.latitude};
        // const viewportLng = {...this.state.viewport.longitude};

        this.handleChange = this.handleChange.bind(this);
        this._noPassword = this._noPassword.bind(this);
        this._signupRequired = this._signupRequired.bind(this);
        this._noPassword = this._noPassword.bind(this);
        this._otherCity = this._otherCity.bind(this);
        this._otherSpace = this._otherSpace.bind(this);
        this._defaultCity = this._defaultCity.bind(this);
        this._defaultSpace = this._defaultSpace.bind(this);
        this._passwordRequired = this._passwordRequired.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this._onTransitionEnd = this._onTransitionEnd.bind(this);
        this._onTransitionStart = this._onTransitionStart.bind(this);
        this.selectSuggestion = this.selectSuggestion.bind(this);

    }

    _onViewportChange = viewport => this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });

    _onTransitionEnd() {
      this.setState({
        showMarker: true,
        showSpace: true
      });
     };

     _onTransitionStart() {
      this.setState({
        showMarker: false,
        showSpace: false
      });
     };

    validateField(fieldName, value) {
      let fieldValidationErrors = this.state.formErrors;
      let speedValid = this.state.speedValid;
      let passwordValid = this.state.passwordValid;
      let passwordRequired = this.state.passwordRequired;
      // let cityValid = this.state.cityValid;
      // let typeValid = this.state.typeValid;

      switch (fieldName) {
        case 'speed':
          speedValid = value > -1;
          break;
        case 'password':
          passwordValid = value.length >= 1;
          break;
        // case 'type':
        //   typeValid = value.length >= 1;
        //   break;
        // case 'city':
        //   cityValid = value.length >= 1;
        //   break;
        default:
          break;
      }
      this.setState({
        formErrors: fieldValidationErrors,
        speedValid: speedValid,
        passwordValid: passwordValid
      }, this.validateForm);
    }

    validateForm() {
      this.setState({ formValid: this.state.speedValid && this.state.passwordValid});
    }

    handleChange(event) {
      const target = event.target;
      const name = target.name;
      const value = target.value;
      this.setState({[name]: value},
      () => { this.validateField(name, value) });
    }

    handleSubmit(event) {
      event.preventDefault();

      const data = new FormData(event.target);

      const _onFormSubmit = () => {
        setTimeout(() => {
          this.setState({
            formSubmitted: true
          })
        }, 0);
      }

      const _onFormSuccess = () => {
        this.setState({
          formSuccess: true
        })
      }

      const _onFormError = (err) => {
        this.setState({
          formSuccess: true
        })
      }

      fetch('https://docs.google.com/forms/d/e/1FAIpQLSexIBjK3ArH9sfu1YPGNQ0nUr8noJ4Ec8P27ltxdE0efzsGiw/formResponse', {
        method: 'POST',
        body: data,
        mode: 'no-cors'
      })
      .then(function(response) {
        _onFormSubmit();
      })
      .catch(function(err) {
        console.log("Error", err);
        _onFormError();
      })
      .then(function(success) {
        console.log("Success", success);
        _onFormSuccess();
      });
    }

    selectSuggestion(suggestion) {
      console.log(JSON.stringify(suggestion));
      try {
        const viewport = {
          ...this.state.viewport,
          latitude: suggestion.location.lat,
          longitude: suggestion.location.lng,
          zoom: 17,
          transitionDuration: 2000,
          transitionInterpolator: new FlyToInterpolator()
        };
        let label = suggestion.label;
        label = label.substring(label.indexOf(",") + 1);
        let location = label.substring(0, label.indexOf(','));
        let city = label.substring(label.indexOf(",") + 1).trim();
        city = city.substring(0, city.indexOf(','));


        this.setState({
          location: location,
          space: suggestion.gmaps.name,
          city: city,
          type: suggestion.gmaps.types[0],
          placeid: suggestion.gmaps.place_id,
          lat: suggestion.location.lat,
          lng: suggestion.location.lng,
          mapsurl: suggestion.gmaps.url,
          formDisabled: false,
          website: suggestion.gmaps.website,
          rating: suggestion.gmaps.rating,
          viewport
        });
        if (suggestion.gmaps.opening_hours !== undefined) {
          this.setState({
            monday: suggestion.gmaps.opening_hours.weekday_text[0],
            tuesday: suggestion.gmaps.opening_hours.weekday_text[1],
            wednesday: suggestion.gmaps.opening_hours.weekday_text[2],
            thursday: suggestion.gmaps.opening_hours.weekday_text[3],
            friday: suggestion.gmaps.opening_hours.weekday_text[4],
            saturday: suggestion.gmaps.opening_hours.weekday_text[5],
            sunday: suggestion.gmaps.opening_hours.weekday_text[6],
          });
        }
      } catch (e) {
        this.setState({
          location: "",
          city: "",
          placeid: "",
          lat: 0,
          lng: 0,
          website: "",
          mapsurl: "",
          type: "",
          space: "",
          formDisabled: false,
          rating: 0,
          monday: "Not available",
          tuesday: "Not available",
          wednesday: "Not available",
          thursday: "Not available",
          friday: "Not available",
          saturday: "Not available",
          sunday: "Not available",
          ...this.state.viewport,
          latitude: 51.509865,
          longitude: -0.118092,
        });
      }

    }
    _passwordRequired() {
      this.setState({
        passwordRequired: true,
      })
    }
    _signupRequired() {
      this.setState({
        passwordRequired: false,
        signupRequired: true,
        password: "Signup Required",
        passwordValid: true
      })
    }
    _noPassword() {
      this.setState({
        passwordRequired: false,
        noPassword: true,
        password: "No Password",
        passwordValid: true

      })
    }
    _otherCity() {
      this.setState({
        otherCity: true
      })
    }
    _otherSpace() {
      this.setState({
        otherSpace: true

      })
    }
    _defaultCity() {
      this.setState({
        otherCity: false
      })
    }
    _defaultSpace() {
      this.setState({
        otherSpace: false
      })
    }

    render() {
      const {viewport, settings, monday, tuesday, wednesday, thursday, friday, saturday, sunday, formSubmitted, formSuccess} = this.state;
      // let openingtimes = this.state.openingtimes;
      const cities = [["Belfast"], ["Dublin"], ["London"]];
      const spaceTypes = [["coffee shop"], ["cafe"], ["library"], ["bar"], ["restaurant"]];
      const sockets = [["None"], ["Some"], ["Many"]];

      let type = this.state.type;
      type = type.replace("_", " ");

        return (
          <>
            {formSubmitted &&
              <FormSubmitted className="scaleIn">
                  <FormSubmittedWrapper className={formSuccess ? "success" : "error" }>
                    { formSuccess ?
                    <>
                      <BgImg>
                      <ImgOverlay />
                        <ImgBlend />
                        {formSuccess ?
                          <Picture>
                            {/* <source srcset={successWebp} type="image/webp" /> */}
                            <source srcset={successGif} type="image/gif" />
                            <img src={successGif} alt="Form submission success" />
                          </Picture>
                        :
                          <Picture>
                            <source srcset={errorWebp} type="image/webp" />
                            <source srcset={errorGif} type="image/gif" />
                            <img src={errorGif} alt="Form submission error" />
                          </Picture>
                        }
                      </BgImg>
                      <FormSubmittedText>
                      {formSuccess ?
                          <>
                          <h2>Thanks for submitting!</h2>
                          <p>Please give 5&mdash;10 minutes for the new space to appear as the site rebuilds. New cities will be added once we receive at least 3 submissions for that city. <br /> Have a great day!</p>
                          </>
                        :
                          <>
                          <h2>Something went wrong!</h2>
                          <p>Sorry! It looks like something went wrong with your submission. Could you please try again, or if the issue persists, <a href="mailto:michael@mckvr.com">get in touch</a>.</p>
                          </>
                        }
                      </FormSubmittedText>

                    </>
                    :
                    <>
                      <IconWrapper>
                        <Icon name="thumbs-down" />
                      </IconWrapper>
                      <FormSubmittedText>
                      <h2>Oops, something went wrong!</h2>
                      <p>Looks like something went wrong and your space didn't submit. Could you try again or <a href="mailto:michael@mckvr.com">email me</a>.</p>
                      </FormSubmittedText>
                    </>
                    }
                  </FormSubmittedWrapper>
              </FormSubmitted>
            }
            <ModalForm>
              <ModalFormWrapper>
                <Formgroup>
                    <SearchIconWrapper>
                      <Icon name="search" />
                    </SearchIconWrapper>
                    <SpaceSuggest placeholder="Find the space.."
                      ref={ el => this._geoSuggest = el }
                    onSuggestSelect={this.selectSuggestion} value={this.state.name} types={["establishment"]}>
                    </SpaceSuggest>
                </Formgroup>

                <FormWrapper style={ this.state.formDisabled === true ? {opacity: .3, pointerEvents: 'none'} : null }>

                  <Formgroup>
                    <Label htmlFor="city">Select a City</Label>
                    <Radiogroup>
                        {
                        cities.map(([value], i) => (
                          <CityItem key={"city" + i}>
                            <Radio>
                              <input type="radio" id={"city" + i} name="city" value={value} onChange={this.handleChange} checked={this.state.city === value} onClick={this._defaultCity} required />
                              <label htmlFor={"city" + i}>
                                <span>{ value }</span>
                                <RadioBg />
                              </label>
                            </Radio>
                          </CityItem>
                          ))
                        }
                        <CityItem>
                          <Radio>
                            <input type="radio" id="otherCity" name="city" onClick={this._otherCity} required value="" />
                            <label htmlFor="otherCity">
                              <span>Other</span>
                              <RadioBg />
                            </label>
                          </Radio>
                        </CityItem>
                    </Radiogroup>
                    {this.state.otherCity ?
                        <TextInput
                          placeholder="Enter the name of the city"
                          helper="We'll add a new city when we receive 3 or more submissions"
                          type="text"
                          name="city"
                          onChange={this.handleChange}
                        />
                    :
                    null
                    }
                  </Formgroup>
                  <Formgroup>
                    <Label htmlFor="1539191871">Select the type of space</Label>
                    <Radiogroup>
                      {
                        spaceTypes.map(([value], i) => (
                          <TypeItem key={"type" + i} >
                            <Radio>
                              <input type="radio" id={"type" + i} name="type" value={value} onChange={this.handleChange} checked={type === value} onClick={this._defaultSpace} required />
                              <label htmlFor={"type" + i}>
                                <span>{ value }</span>
                                <RadioBg />
                              </label>
                            </Radio>
                          </TypeItem>
                        ))
                      }
                      <TypeItem>
                        <Radio>
                          <input type="radio" id="otherSpace" name="type" onClick={this._otherSpace} required onChange={this.handleChange} value="" />
                          <label htmlFor="otherSpace">
                            <span>Other</span>
                            <RadioBg />
                          </label>
                        </Radio>
                      </TypeItem>
                    </Radiogroup>

                    {this.state.otherSpace ?
                    <TextInput
                      type="text"
                      name="type"
                      value={type}
                      placeholder="Enter the type of space"
                      onChange={this.handleChange}
                    />
                    : null }
                  </Formgroup>

                  <Formgroup>
                    <Label>Is there a WIFI password?</Label>
                    <Radiogroup>
                      <TypeItem>
                        <Radio>
                          <input type="radio" id="passwordRequired" name="passwordType" value="Password" onClick={this._passwordRequired} defaultChecked required />
                          <label htmlFor="passwordRequired">
                            <span>Password</span>
                            <RadioBg />
                          </label>
                        </Radio>
                      </TypeItem>
                      <TypeItem>
                        <Radio>
                          <input type="radio" id="noPassword" name="passwordType" value="" onClick={this._noPassword} onChange={this.handleChange} required />
                          <label htmlFor="noPassword">
                            <span>No Password</span>
                            <RadioBg />
                          </label>
                        </Radio>
                      </TypeItem>
                      <TypeItem>
                        <Radio>
                          <input type="radio" id="signupRequired" name="passwordType" value="Signup Required" onClick={this._signupRequired} onChange={this.handleChange}  required />
                          <label htmlFor="signupRequired">
                            <span>Signup Required</span>
                            <RadioBg />
                          </label>
                        </Radio>
                      </TypeItem>
                    </Radiogroup>
                  </Formgroup>

                  <WifiWrapper>
                    <SpeedContainer>
                        <Label htmlFor="speed">Enter the wifi speed <a target="_blank" rel="noopener noreferrer" href="//fast.com">(Test Speed)</a> </Label>
                      <TextInput
                        type="number"
                        min="0"
                        name="speed"
                        append="Mbps"
                        icon="speed"
                        onChange={this.handleChange}
                      />
                    </SpeedContainer>

                    {
                      this.state.passwordRequired ?
                      <PasswordContainer>
                        <Label htmlFor="password">Enter the wifi password</Label>
                        <TextInput
                          type="text"
                          name="password"
                          icon="lock"
                          value={this.state.password}
                          onChange={this.handleChange}
                        />
                      </PasswordContainer>
                      : null
                    }

                  </WifiWrapper>

                  <Formgroup>
                      <Label htmlFor="1515648897">Are there plug sockets available?</Label>
                      <Radiogroup>
                      {
                      sockets.map(([value], i) => (
                          <TypeItem key={i}>
                            <Radio>
                            <input type="radio" id={"socket" + i} name="sockets" value={value} onChange={this.handleChange} required />
                              <label htmlFor={"socket" + i}>
                                <span>{ value }</span>
                                <RadioBg />
                              </label>
                            </Radio>
                          </TypeItem>
                        ))
                      }
                      </Radiogroup>
                  </Formgroup>

                  <Formgroup>
                    <Label htmlFor="twitter">Whats your twitter username? (Optional)</Label>
                    <TextInput
                      type="text"
                      name="twitter"
                      icon="twitter"
                      onChange={this.handleChange}
                      value={this.state.twitter}
                    />
                  </Formgroup>

                  </FormWrapper>

                  <form onSubmit={this.handleSubmit} action="https://docs.google.com/forms/d/e/1FAIpQLSexIBjK3ArH9sfu1YPGNQ0nUr8noJ4Ec8P27ltxdE0efzsGiw/formResponse" method="post">

                      {/* Space Name */}
                      <input id="21680865" type="hidden" name="entry.21680865" required value={this.state.space || ""} readOnly />

                      {/* City */}
                      <input id="879554458" type="hidden" name="entry.879554458" required value={this.state.city || ""} readOnly />

                      {/* location Name */}
                      <input id="1160561109" type="hidden" name="entry.1160561109" required defaultValue={this.state.location} />

                      {/* Type */}
                      <input id="1539191871" type="hidden" name="entry.1539191871" required defaultValue={type} />

                      {/* Speed */}
                      <input id="2082019454" type="hidden" name="entry.2082019454" required value={this.state.speed} onChange={this.handleChange} />

                      {/* Password*/}
                      <input value={this.state.password || ''} id="333107659" type="hidden" name="entry.333107659" onChange={this.handleChange} />

                      {/* Sockets*/}
                      <input value={this.state.sockets || ''} id="1114374015" type="hidden" name="entry.1114374015" readOnly/>

                      {/* Twitter*/}
                      <input value={this.state.twitter || ''} id="439523054" type="hidden" name="entry.439523054" readOnly/>

                      {/* Latitude */}
                      <input value={'"'+ this.state.lat +'"'} id="1690305993" type="hidden" name="entry.1690305993" readOnly/>

                      {/* Longitude */}
                      <input value={'"' + this.state.lng + '"'} id="408979620" type="hidden" name="entry.408979620" readOnly/>

                      {/* Website */}
                      <input value={this.state.website || ""} id="34021927" type="hidden" name="entry.34021927" readOnly/>

                      {/* Places ID */}
                      <input value={this.state.placeid || ""} id="1162248920" type="hidden" name="entry.1162248920" readOnly/>

                      {/* Maps url */}
                      <input value={this.state.mapsurl || ""} id="1668370446" type="hidden" name="entry.1668370446" readOnly/>

                      {/* Rating */}
                      <input id="631959802" type="hidden" value={this.state.rating || ""} name="entry.631959802" readOnly/>

                      {/* Monday */}
                      <input id="1072291941" type="hidden" value={monday || ""}  name="entry.1072291941" readOnly/>

                      {/* Tuesday */}
                      <input id="154391393" type="hidden" value={tuesday || ""}  name="entry.154391393" readOnly/>

                      {/* Wednesday */}
                      <input id="818751999" type="hidden" value={wednesday || ""}  name="entry.818751999" readOnly/>

                      {/* Thursday */}
                      <input id="2054838004" type="hidden" value={thursday || ""}  name="entry.2054838004" readOnly/>

                      {/* Friday */}
                      <input id="699443558" type="hidden" value={friday || ""}  name="entry.699443558" readOnly/>

                      {/* Saturday */}
                      <input id="1678443197" type="hidden" value={saturday || ""}  name="entry.1678443197" readOnly/>

                      {/* Sunday */}
                      <input id="36653478" type="hidden" value={sunday || ""}  name="entry.36653478" readOnly/>


                      <input type="hidden" name="fvv" value="1" />
                      <input type="hidden" name="fbzx" value="-5840156538410987632" />

                      <Button disabled={!this.state.formValid || this.state.formSuccess} type="submit" title="Submit your Space" classes="w-full lg primary" />

                    </form>
              </ModalFormWrapper>
            </ModalForm>
                <ModalMap>
                <SpaceContainer className={this.state.showSpace ? "scaleIn" : 'hide'}>
                  <Space node={this.state} modal={this.state.modalIsOpen} />
                </SpaceContainer>

                <MapContainer>
                  <MapGL
                    {...viewport}
                    {...settings}
                    width="100%"
                    height="100%"
                    padding-top="20%"
                    mapStyle="mapbox://styles/mckeever02/cjsvqwp650t2x1fqt8xx6sd54"
                    onViewportChange={this._onViewportChange}
                    onTransitionEnd={this._onTransitionEnd}
                    onTransitionStart={this._onTransitionStart}
                    dragToRotate={false}
                    scrollZoom={false}
                    dragPan={false}
                    doubleClickZoom={false}
                    attributionControl={false}
                    mapboxApiAccessToken={MAPBOX_TOKEN}>
                    <MapOverlay />
                    <Marker className={this.state.showMarker ? "show" : 'hide'} latitude={this.state.lat} longitude={this.state.lng}>
                      <Pin className={this.state.showMarker ? "bounceDown" : ''} />
                      <Pulse />
                    </Marker>
                  </MapGL>
                </MapContainer>
            </ModalMap>
          </>
        )
    }
}