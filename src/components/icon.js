import React from 'react'
import { withPrefix } from 'gatsby';
import classnames from "classnames";
import icons from "./icons.svg";


const Icon = (props) => (
    <svg className={classnames(`icon icon-${props.name} icon-${props.size} ${props.class}`)}>
        <use xlinkHref={withPrefix(`${icons}#icon-${props.name}`)}></use>
    </svg>
)

export default Icon