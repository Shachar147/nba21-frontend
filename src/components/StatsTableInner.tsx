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

                        return (
                            <tr key={`stat-${idx}`}>
                                <td style={{fontWeight: "bold"}} dangerouslySetInnerHTML={{__html: stat}} />
                                {values.map((value = 'N/A') => (
                                    <td style={{fontWeight: "bold"}} dangerouslySetInnerHTML={{__html: value.toString() }} />
                                ))}
                            </tr>
                        )
                    }
                })}
        </tbody>
    </table>
    );
}