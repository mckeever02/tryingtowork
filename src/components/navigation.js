/* global tw */
import { Link } from "gatsby"
import React from "react"
import styled from '@emotion/styled'
import Icon from "./icon";
import Button from '../components/button';
import GitHubButton from 'react-github-btn'

const Navigation = styled('nav')`
  ul {
    ${tw`flex flex-wrap md:flex-nowrap flex-row text-center content-center list-reset justify-start m-0`}
  }
  li {
    ${tw`block w-1/3 md:w-auto my-auto`}
    :not(:first-of-type) {
      a {
        ${tw`md:px-7`}
      }
    }
    :first-of-type {
      ${tw`md:pr-5 w-full md:w-auto mb-4 md:my-auto`}
      a {
        ${tw`text-white`}
        &:hover {
          ${tw`text-water-leaf`}
          transform: scale(1.2);
        }
        &:after {
          ${tw`hidden`}
        }
      }
    }
    :nth-last-of-type(2) {
      ${tw`hidden md:block md:ml-auto px-7`}
    }
    :last-of-type {
      ${tw`w-full md:w-auto mt-8 md:mt-0`}
    }
  }
  a {
    ${tw`block text-sm no-underline text-comet-lighter relative`}
    transition: all .3s ease;
    line-height: 1;
    &::after {
      transition: all .3s ease;
      content: "";
      ${tw`absolute rounded-full bg-comet-lighter`}
      transform: scale(0);
      width: 4px;
      height: 4px;
      left: 50%;
      top: 1.25rem;
    }
    &.active, &:hover {
      ${tw`text-white`}
      &::after {
        ${tw`bg-white`}
        transform: scale(1);
      }
    }
  }
`

export default class Nav extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <>
        <Navigation>
        <ul>
            <li>
            <Link to="/">
                <Icon name="speed" size="xl" />
            </Link>

            </li>
            {
            this.props.menuLinks.map(link =>
                <li key={link.name}>
                <Link activeClassName="active" to={link.link}>{link.name}</Link>
                </li>)
            }
            <li>
              <GitHubButton href="https://github.com/mckeever02/tryingtowork" data-icon="octicon-star" data-show-count="true" aria-label="Star mckeever02/tryingtowork on GitHub">Star</GitHubButton>
            </li>
            <li>
            <Button classes="sm outline" onClick={this.props.openModal} title="Add a space" />
            </li>
        </ul>
        </Navigation>
      </>
    )
  }
}