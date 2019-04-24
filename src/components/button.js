/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import classnames from "classnames"
import { colors } from "../components/theme"


const StyledButton = styled('button')`
    ${tw`relative text-mirage bg-transparent uppercase tracking-wide py-5 px-6 text-base font-mono cursor-pointer appearance-none outline-none border-none`}
    transition: all .2s ease;
    &:before, span {
        transition: all .2s ease;
    }
    &:before, &:after {
        content: "";
        ${tw`absolute w-full h-full pin-t pin-l pin-r pin-b rounded-sm border border-white border-solid bg-ebony-clay`}
    }
    &:before {
        ${tw`z-10 bg-white`}
    }
    &:after {
        z-index: 1;
    }
    span {
        ${tw`relative inline-block z-20`}
    }
    &:before, & span {
        transform: translate(5px, -5px);
    }
    &:hover {
        &:before, & span {
            transform: translate(3px, -3px);
        }
    }
    &:active {
        &:before, & span {
            transform: translate(0, 0);
        }
    }
    &:disabled {
      ${tw`cursor-not-allowed opacity-20`}
    }


    &.primary {
        &:before, & span, &:after {
            ${tw`border-water-leaf text-mirage`}
        }
        &:before {
            ${tw`bg-water-leaf text-mirage`}
        }
    }


    &.w-full {
        ${tw`w-full block`}
    }


    &.sm {
        ${tw`text-xs uppercase tracking-wide py-3 px-4`}
        &:active {
            &:before, & span {
                transform: translate(2px, -2px);
            }
        }
    }


    &.outline {
        ${tw`text-white`}
        &:before, &:after {
            ${tw`border border-comet-light border-solid bg-mirage`}
        }
    }

    &.base {
        ${tw`text-sm py-5`}
    }


    &.lg {
        ${tw`py-6`}
        &:before, &:after {
            ${tw``}
        }
        &:before, & span {
            transform: translate(8px, -8px);
        }
        &:hover {
            &:before, & span {
                transform: translate(6px, -6px);
            }
        }
        &:active {
            &:before, & span {
                transform: translate(0, 0);
            }
        }
    }
`
const Button = (props) => (
    <StyledButton disabled={props.disabled} type={props.type} className={classnames(props.classes)} onClick={props.onClick}>
        <span>
            {props.title}
        </span>
    </StyledButton>
)

export default Button;