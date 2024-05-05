import React from "react";

interface StatsTableInnerProps {
    cols: string[];
    stats: Record<string, (number|string)[]>;
    switchMaxNumber?: number;
    showMoreOpened?: boolean;
    showMoreSwitch?: boolean;
}

export default function StatsTableInner({ cols, stats, switchMaxNumber = 10, showMoreOpened = false, showMoreSwitch = true }: StatsTableInnerProps) {
    return (
        <table className="ui celled table">
            <thead>
                <tr>
                    {
                        cols.map((iter, idx) => {
                            return (
                                <th key={`col-${idx}`}>{iter}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {Object.keys(stats).map((stat,idx) => {

                    if (idx < switchMaxNumber || showMoreOpened || !showMoreSwitch) {
                        const values = stats[stat];
                        const value1 = (values.length > 0) ? values[0] : "N/A";
                        const value2 = (values.length > 1) ? values[1] : "N/A";

                        const value3 = (values.length > 2) ? values[2] : undefined;

                        if (!(value1 === 0 && value2 === 0) && !(value1 === "N/A" && value2 === "N/A"))
                            return (<tr key={`stat-${idx}`}>
                                <td style={{fontWeight: "bold"}} dangerouslySetInnerHTML={{__html: stat}} />
                                <td dangerouslySetInnerHTML={{ __html: value1.toString() }} />
                                { (cols.length > 2) ? <td dangerouslySetInnerHTML={{__html: value2.toString() }} /> : undefined }
                                { (value3) ? (<td dangerouslySetInnerHTML={{__html: value3.toString() }} />) : "" }
                            </tr>)
                    }
                })}
        </tbody>
    </table>
    );
}