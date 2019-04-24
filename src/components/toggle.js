/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import { colors } from "../components/theme"
import Toggle from 'react-toggle'

const StyledToggle = styled('div')`
  ${tw``}
  label {
    ${tw`text-xs sm:text-sm flex flex-col md:flex-row justify-center items-center content-center`}
  }
  span {
    ${tw`leading-normal md:leading-none block md:inline-block relative text-center md:text-left mt-2 md:mt-0`}
  }
    .react-toggle {
    ${tw`md:mr-2`}
    touch-action: pan-x;

    display: inline-block;
    position: relative;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    padding: 0;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
  }

  .react-toggle-screenreader-only {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .react-toggle--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transition: opacity 0.25s;
  }

  .react-toggle-track {
    ${tw`bg-mirage-dark`}
    border: 1px solid ${colors.woodSmoke};
    width: 50px;
    height: 22px;
    padding: 0;
    border-radius: 30px;
    transition: all 0.2s ease;
  }

  .react-toggle--checked .react-toggle-track {
    ${tw`bg-water-leaf`}
  }

  .react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
    ${tw`bg-water-leaf`}
  }

  .react-toggle-thumb {
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    position: absolute;
    top: -3px;
    left: -3px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    box-sizing: border-box;
    transition: all 0.25s ease;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.4);
    border: 1px solid ${colors.woodSmoke};
    ${tw`bg-ebony-clay`}
  }

  .react-toggle--checked .react-toggle-thumb {
    left: 27px;
    ${tw`bg-white`}
  }

  .react-toggle--focus .react-toggle-thumb {
    box-shadow: 0px 0px 2px 3px #0099E0;
  }

  .react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
    box-shadow: 0px 0px 5px 5px #0099E0;
  }
`
const ToggleInput = (props) => (
    <StyledToggle>
        <label>
            <Toggle
                name={props.name}
                icons={false}
                onChange={props.onChange} />
            <span>{props.label}</span>
        </label>
    </StyledToggle>
)

export default ToggleInput;