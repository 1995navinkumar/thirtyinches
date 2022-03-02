import React from 'react';

export default function NoData({ title = "It's empty in here.", description = "" }) {
    return (
        <div className='flex-column full-height flex-align-center flex-justify-center'>
            <svg className='svg-filled'>
                <use xlinkHref="#no-data" />
            </svg>
            <p style={{ padding: "16px" }}>{title}</p>
            <p style={{ width: "240px", padding: "16px", textAlign: "center" }}>{description}</p>
        </div>
    )
}