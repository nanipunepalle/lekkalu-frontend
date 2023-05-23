import React from "react";
import "./stats-card.module.css"

const StatsCard = ({label, value, bg}) => {
    return (
        <div className="container">
            <div className="card" style={{background: bg}}>
                <div className="shine"></div>
                <p
                    className="label"
                    style={{...(bg && {color: "white"})}}
                >
                    {label}
                </p>
                <p className="value">{value}</p>
            </div>
            <div className="shadow"></div>
        </div>
    );
};

export default StatsCard;
