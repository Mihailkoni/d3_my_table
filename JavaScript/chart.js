// chart.js
function prepareChartData(data, config) {
    const grouped = d3.group(data, d => d[config.xAxis]);
    const chartData = [];

    grouped.forEach((values, key) => {
        const numbers = values.map(v => v[config.yMetric]);
        let value;
        
        switch(config.calculation) {
            case "avg": 
                value = d3.mean(numbers);
                break;
            case "max":
                value = d3.max(numbers);
                break;
            case "min":
                value = d3.min(numbers);
                break;
            default:
                value = d3.mean(numbers);
        }
        
        chartData.push({
            category: key,
            value: value,
            count: values.length
        });
    });

    if (["price", "capitalization", "pe", "ps"].includes(config.xAxis)) {
        chartData.sort((a, b) => a.category - b.category);
    } else {
        chartData.sort((a, b) => a.category.localeCompare(b.category));
    }

    return chartData;
}

function formatValue(value, metric) {
    if (metric === "price" || metric === "capitalization") {
        return Math.round(value);
    }
    return value.toFixed(2);
}

function getAxisLabel(axis) {
    switch(axis) {
        case "sector": return "Сектор";
        case "index": return "Индекс";
        case "price": return "Цена (руб)";
        case "capitalization": return "Капитализация (млрд руб)";
        case "pe": return "P/E";
        case "ps": return "P/S";
        default: return axis;
    }
}

function getMetricLabel(metric) {
    switch(metric) {
        case "price": return "Цена (руб)";
        case "capitalization": return "Капитализация (млрд руб)";
        case "pe": return "P/E";
        case "ps": return "P/S";
        case "change": return "Изменение (%)";
        default: return metric;
    }
}

function drawChart(data, config) {
    const margin = { top: 40, right: 30, bottom: 100, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    
    let svg = d3.select("#chart");
    
    svg.selectAll('*').remove();
    svg.style("width", 800)
        .style("height", 500);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, width])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.15])
        .range([height, 0]);

    //ось ox
    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .style("font-size", "9px")
        .style("fill", "#262626")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    //ось oy
    chart.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-size", "9px")
        .style("fill", "#262626");

    //подпись оси ox
    chart.append("text")
        .attr("transform", `translate(${width / 2},${height + margin.top + 50})`)
        .style("text-anchor", "middle")
        .text(getAxisLabel(config.xAxis))
        .style("font-size", "9px")
        .style("font-weight","bold")
        .style("fill", "#262626");

    //подпись оси oy
    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "9px")
        .style("font-weight","bold")
        .style("fill", "#262626")
        .text(getMetricLabel(config.yMetric));

    //отрисовка графика
    if (config.chartType === "bar") {
        chart.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.category))
            .attr("y", d => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.value))
            .attr("fill", "green");
    } 
    else if (config.chartType === "scatter") {
        chart.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.category) + xScale.bandwidth() / 2)
            .attr("cy", d => yScale(d.value))
            .attr("r", 8)
            .attr("fill", "blue");
    }

    //подписи значений
    chart.selectAll(".value-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "value-label")
        .attr("x", d => xScale(d.category) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.value) - 10)
        .attr("text-anchor", "middle")
        .text(d => formatValue(d.value, config.yMetric))
        .style("font-size", "7px")
        .style("font-weight","bold")
        .style("fill", "red");
}

//инициализация
function initChart() {
    const config = {
        xAxis: "sector",
        yMetric: "price",
        calculation: "avg",
        chartType: "bar"
    };

    //доступные метрики для оси oy
    function updateYMetrics() {
        const xAxis = document.getElementById('x-axis').value;
        const yMetricSelect = document.getElementById('y-axis');
        const metrics = ["price", "capitalization", "pe", "ps", "change"];
        
        //очищаем и заполняем select
        yMetricSelect.innerHTML = '';
        metrics.filter(metric => metric !== xAxis).forEach(metric => {
            const option = document.createElement('option');
            option.value = metric;
            option.textContent = 
                metric === "price" ? "Цена" : 
                metric === "capitalization" ? "Капитализация" :
                metric === "pe" ? "P/E" :
                metric === "ps" ? "P/S" : "Изменение (%)";
            yMetricSelect.appendChild(option);
        });
    }

    //обработчики событий
    document.getElementById('x-axis').addEventListener('change', function() {
        config.xAxis = this.value;
        updateYMetrics();
    });

    document.getElementById('y-axis').addEventListener('change', function() {
        config.yMetric = this.value;
    });

    document.getElementById('calculation-type').addEventListener('change', function() {
        config.calculation = this.value;
    });

    document.getElementById('chart-type').addEventListener('change', function() {
        config.chartType = this.value;
    });

    document.getElementById('build-chart').addEventListener('click', function() {
        const chartData = prepareChartData(currentDisplayedData, config);
        drawChart(chartData, config);
    });

    document.getElementById('clear-chart').addEventListener('click', function() {
        let svg = d3.select("#chart");
        svg.selectAll('*').remove();
        svg.style("width", 0)
            .style("height", 0);
    });

    //инициализация
    updateYMetrics();
}