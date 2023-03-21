import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

export default function BarChart({ width, height, data }){
    const margin = 30;
    const ref = useRef();
    const domain = [0, 7];
    const range = [0, 600]; 
    let scale = d3.scaleLinear().domain(domain).range(range);
    let axis = d3.axisBottom(scale);

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width + margin)
            .attr("height", height + margin)
            .style("border", "1px solid black")
    }, []);

    useEffect(() => {
        draw();
    }, [data]);

    const lastSevenDays = [...Array(7)].map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split("T")[0];
    });

    function formatDataValues(data) {
        let index = 0;
        // return data.map(obj => {
        //     if () {
                
        //     }
        //     Object.values(obj.rating);
        // });
        return;
    }

    

    const draw = () => {
        const dataValues = formatDataValues(data);
        console.log("dataValues: ", dataValues);
        const svg = d3.select(ref.current);
        var selection = svg.selectAll("rect").data(dataValues);
        var yScale = d3.scaleLinear()
                            .domain([0, d3.max(dataValues)])
                            .range([0, height-100]);
        
        selection
            .transition().duration(300)
                .attr("height", (d) => yScale(d))
                .attr("y", (d) => height - yScale(d))

        selection
            .enter()
            .append("rect")
            .attr("x", (d, i) => margin + (i * 45))
            .attr("y", (d) => height)
            .attr("width", 40)
            .attr("height", 0)
            .attr("fill", "blueviolet")
            .transition().duration(300)
                .attr("height", (d) => yScale(d))
                .attr("y", (d) => height - yScale(d))
        
        selection
            .exit()
            .transition().duration(300)
                .attr("y", (d) => height)
                .attr("height", 0)
            .remove()

        svg.append('g')
            .attr("class", "axis")
            .attr("transform", "translate(" + margin + "," + (height + 2) + ")")
            .call(axis);

        svg.append('g')
            .attr("class", "axis")
            .attr("transform", "translate(" + (margin - 2) + ", " + (height - 300) + ")")
            .call(d3.axisLeft(d3.scaleLinear().domain([0, 3]).range([300, 0])));
    }

    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}