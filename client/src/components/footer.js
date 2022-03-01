import React from 'react';
import { useNavigate } from "react-router-dom";


export default function Footer() {
    var navigate = useNavigate();
    return (
        <footer className='app-footer flex-row flex-align-center'>
            <img className='icon' onClick={() => navigate("/dashboard")} src="/images/home-icon.svg" />
            <img className='icon' onClick={() => navigate("/subscriptions")} src="/images/subscription-outline.svg" />
            <img className='icon' onClick={() => navigate("/attendance")} src="/images/assets-icon.svg" />
            <img className='icon' onClick={() => navigate("/assets")} src="/images/attendance-icon.svg" />
            <img className='icon' onClick={() => navigate("/expenses")} src="/images/subscription-outline.svg" />
        </footer>
    )
}