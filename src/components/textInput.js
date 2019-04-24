/* global tw */
import React from 'react'
import styled from '@emotion/styled'
import Icon from './icon'
import { colors } from "../components/theme"
import classnames from "classnames"

const Formgroup = styled('div')`
  ${tw`mb-6 text-white relative`}
`

const Input = styled('input')`
  ${tw`transition focus:outline-0 text-base text-white focus:bg-white focus:text-black rounded bg-mirage-dark py-3 px-3 w-full appearance-none leading-normal font-mono focus:outline-none`}
  transition: all .1s ease-in;
  border: 1px solid ${colors.woodSmoke};
  ::placeholder {
    ${tw`text-comet`}
  }
  &.with-icon {
      ${tw`pl-11`}
  }
  &.lg {
    ${tw`sm:pl-11 sm:py-4 sm:text-lg`}
  }
  &.lg.with-icon {
      ${tw`sm:pl-14`}
  }
  &.rounded-full {
    ${tw`rounded-full`}
  }
`

const IconWrapper = styled('div')`
  ${tw`absolute pin-t pin-l z-10 p-3 flex items-center justify-center text-comet`}
  width: 50px;
  height: 50px;
  &.icon-wrapper-lg {
    @media (min-width:  577px) {
      width: 61px;
      height: 61px;
      .icon {
          ${tw`w-6 h-6`}
      }
    }
  }
  .icon {
    width: 1.1rem;
    height: 1.1rem;
  }
`

const InputAppend = styled('div')`
  ${tw`font-mono absolute flex items-center justify-center pin-t p-2 pin-r h-full`}
  span {
    ${tw`text-white flex items-center justify-center px-2 font-bold h-full w-full text-sm rounded`}
    background: #2B2F41;
  }
  // top: .85rem;
  // right: .4rem;
`

const Helper = styled('small')`
  ${tw`font-mono mt-2 text-xs block text-comet-light`}
`

const TextInput = (props) => (
    <Formgroup>
        {props.icon &&
        <IconWrapper className={classnames(props.size === 'lg' && 'icon-wrapper-lg')}>
          <Icon name={props.icon} />
        </IconWrapper>
        }
        <Input className={classnames(props.size, props.rounded, props.icon && 'with-icon' )} type={props.type} value={props.value} min={props.min} placeholder={props.placeholder} name={props.name} onChange={props.onChange} required />
        {props.helper &&
        <Helper>{props.helper}</Helper>
        }
        {props.append &&
        <InputAppend>
          <span>{props.append}</span>
        </InputAppend>
        }
    </Formgroup>
)

export default TextInput;