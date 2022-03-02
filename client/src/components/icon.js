import React from "react";

export default function Icon({ href, ...props }) {
    return (
        <svg {...props}>
            <use xlinkHref={href} />
        </svg>
    )
}