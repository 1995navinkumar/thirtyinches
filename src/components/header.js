import React from 'react';

export function Header() {
    return (
        <React.Fragment>
            <div className="app-header-container">
                <div className="flex-row flex-justify-center app-header">
                    <span className="oval-1"></span>
                    <h1 className="app-header--title">30"</h1>
                </div>
                <div className="flex-row flex-justify-center">
                    <p className="app-header--subtitle">Gym Management App</p>
                </div>
            </div>
        </React.Fragment>
    )
}