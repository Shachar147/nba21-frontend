import React from "react";

interface StatsTableInnerProps {
    cols: string[];
    stats: Record<string, (number|string)[]>;
    switchMaxNumber?: number;
    showMoreOpened?: boolean;
    showMoreSwitch?: boolean;
    isBold?: boolean;
}

export default function StatsTableInner({ cols, stats, switchMaxNumber = 10, showMoreOpened = false, showMoreSwitch = true, isBold=true }: StatsTableInnerProps) {
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
                                <td style={{fontWeight: isBold ? "bold" : "normal"}} dangerouslySetInnerHTML={{__html: stat}} />
                                {values.map((value = 'N/A') => (
                                    <td style={{fontWeight: isBold ? "bold" : "normal"}} dangerouslySetInnerHTML={{__html: value.toString() }} />
                                ))}
                            </tr>
                        )
                    }
                })}
        </tbody>
    </table>
    );
}