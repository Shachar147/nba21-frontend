import React from "react";


export default class StatsTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        const { title, description, hidden, cols, stats, marginTop } = this.props;
        const description_bullets = (typeof(description) === "object") ? description : [description];

        return (
            <div style={{ width:"100%", textAlign: "center" }}>
                <div className="ui header" style={{ width:"100%", textAlign: "center", marginBottom: "0px", marginTop: marginTop }}>{title}</div>
                <div style={{ display: "block", width: "100%", textAlign: "center" }}>
                    <ul style={{ padding: "0px", }}>
                        {description_bullets.map((bullet,idx) => { return (
                            <li key={`bullet_${idx}`} style={{ listStyle: "none" }}>{bullet}</li>
                        )})}
                        {(hidden) ? "" :
                            (<table className="ui celled table">
                                <thead>
                                <tr>
                                    <th>{ cols[0] }</th>
                                    <th>{ cols[1] }</th>
                                    <th>{ cols[2] }</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.keys(stats).map((stat,idx) => {
                                    const values = stats[stat];
                                    const value1 = (values.length > 0) ? values[0] : "N/A";
                                    const value2 = (values.length > 1) ? values[1] : "N/A";
                                    if (!(value1 === 0 && value2 === 0) && !(value1 === "N/A" && value2 === "N/A"))
                                        return (<tr key={`stat-${idx}`}>
                                            <td style={{ fontWeight: "bold" }}>{stat}</td>
                                            <td>{value1}</td>
                                            <td>{value2}</td>
                                        </tr>)
                                })}
                                </tbody>
                            </table>)}

                    </ul>
                </div>
            </div>
        )

    }
}