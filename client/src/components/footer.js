import React from 'react';
import { useNavigate } from "react-router-dom";
import Icon from './icon';

export default function Footer({ selectedRoute = "dashboard" }) {
    var navigate = useNavigate();
    return (
        <footer className='app-footer flex-row flex-align-center'>
            <Icon href={selectedRoute == "dashboard" ? "#home-icon-filled" : "#home-icon"} className='icon' onClick={() => navigate("/dashboard")} />
            <Icon href={selectedRoute == "subscriptions" ? "#subscription-icon-filled" : "#subscription-icon"} className='icon' onClick={() => navigate("/subscriptions")} />
            <Icon href={selectedRoute == "attendance" ? "#attendance-icon-filled" : "#attendance-icon"} className='icon' onClick={() => navigate("/attendance")} />
            <Icon href={selectedRoute == "assets" ? "#asset-icon-filled" : "#asset-icon"} className='icon' onClick={() => navigate("/assets")} />
            <Icon href={selectedRoute == "expenses" ? "#expense-icon-filled" : "#expense-icon"} className='icon' onClick={() => navigate("/expenses")} />
        </footer>
    )
}