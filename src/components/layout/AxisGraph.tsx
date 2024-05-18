import React, { useRef, useEffect } from 'react';

// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export interface AxisGraphDataPoint {
    x: Date,
    y: number
}

interface AxisGraphProps {
    title?: string;
    subTitle?: string;
    axisY?: string;
    dataPoints: AxisGraphDataPoint[][];
    legends?: string[]
}

const AxisGraph = (props: AxisGraphProps) => {
    const { title, subTitle = "Click Legend to Hide or Unhide Data Series", axisY, dataPoints, legends } = props;
    const chartRef = useRef(null);

    // const toggleDataSeries = (e) => {
    //     chartRef.current.options.data.forEach(series => {
    //         if (series.name === e.dataSeries.name) {
    //             series.visible = true;
    //         } else {
    //             series.visible = false;
    //         }
    //     });
    //     e.dataSeries.visible = true;
    //     // if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
    //     //     e.dataSeries.visible = false;
    //     // } else {
    //     //     e.dataSeries.visible = true;
    //     // }
    //     chartRef.current.render();
    // };

    const toggleDataSeries = (e: any) => {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }

        // @ts-ignore
        chartRef.current.render();
    };

    const options = {
        theme: "light2",
        animationEnabled: true,
        title: title ? {
            text: title
        } : undefined,
        subtitles: subTitle ? [{
            text: subTitle
        }] : undefined,
        axisX: {
            // title: "Date and Time",
            // valueFormatString: "DD/MM/YYYY HH:mm:ss" // Display date and time
            // interval: 5,
            intervalType: "hour", // Adjust intervalType as needed (minute, second, etc.)
        },
        axisY: {
            title: axisY,
            titleFontColor: "#6D78AD",
            lineColor: "#6D78AD",
            labelFontColor: "#6D78AD",
            tickColor: "#6D78AD"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: dataPoints.map((_dataPoints, idx) => ({
            type: "line",
            name: legends?.[idx] ?? axisY,
            showInLegend: true,
            xValueFormatString: "DD/MM/YYYY HH:mm",
            yValueFormatString: "#,##0 Wins",
            dataPoints: _dataPoints // Use jittered data points
        }))
    };

    useEffect(() => {
        if (chartRef.current) {
            // @ts-ignore
            chartRef.current.render();
        }
    }, [options]);

    return (
        <div className="ui link cards centered" style={{ margin: "auto", width: "80%", maxWidth: "1000px" }}>
            <CanvasJSChart options={options} onRef={(ref: any) => chartRef.current = ref} />
        </div>
    );
}

export default AxisGraph;