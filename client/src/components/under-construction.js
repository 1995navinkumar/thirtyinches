import React from "react";
import Icon from './icon';

export default function UnderConstruction() {
    return (
        <div className="full-height flex-column flex-align-center flex-justify-center">
            <Icon className="svg-filled" style={{ width: "240px", height: "240px" }} href="#under-construction" />
            {/* <p className="bold" style={{ fontSize: "24px" }} >Page Under Construction</p> */}
        </div>
    )
}