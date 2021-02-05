import React from "react";
import PropTypes from "prop-types";

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


StatsTable.propTypes = {
    /**
     * Title for this stats table.
     *
     * for example: 'Individual Player Stats', 'One on One stats' etc.
     */
    title: PropTypes.string,
    /**
     * description to be displayed under the title, above the table.
     *
     * description can be either a string or an array of strings.
     *
     * description items will be displayed line after line.
     *
     * for example: 'Individual Player Stats', 'One on One stats' etc.
     */
    description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    /**
     * Is the table supposed to be hidden?
     * Use this if the title and description are enough for you.
     */
    hidden: PropTypes.bool,
    /**
     * Stats table contains 3 columns. supply their names here.
     *
     * Example:
     *
     * ["","Days with most games","Days with most points"]
     */
    cols: PropTypes.arrayOf(PropTypes.string),
    /**
     * Stats object.
     *
     * Example:
     *
     * {"#1":["29/01/2021 - 12", "29/01/2021 - 147"], "#2":["30/01/2021 - 11", "28/01/2021 - 140"], "#3":["01/02/2021 - 9", "28/01/2021 - 106"]}
     *
     */
    stats: PropTypes.object,
    /**
     * optional margin top setting,
     */
    marginTop: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ])

};

StatsTable.defaultProps = {
    title: undefined,
    description: undefined,
    hidden: false,
    cols: ["","",""],
    stats: {},
    marginTop: undefined,
};