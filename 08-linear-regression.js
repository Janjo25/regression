async function fit_predict_draw() {
    const { LinearRegression, joinArrays } = await import(
        'https://luisespino.github.io/mlearnjs/mlearn.mjs'
        );

    const LRFactory = await LinearRegression();
    const model     = new LRFactory();

    const X = [1, 2, 3, 4, 5, 6];
    const y = [489191, 432499, 401057, 370421, 342629, 312613];

    model.fit(X, y);
    const yPredict = model.predict(X).map(n => parseFloat(n.toFixed(0)));

    const arr = (await joinArrays())(
        'Grado', X,
        'Total', y,
        'Predicción', yPredict
    );

    const mse = model.mse(y, yPredict).toFixed(2);
    const r2  = model.r2(y, yPredict).toFixed(4);

    const log = document.getElementById('log');
    log.innerHTML = `
    <strong>Grados:</strong> [${X.join(', ')}]<br>
    <strong>Totales (y):</strong> [${y.join(', ')}]<br>
    <strong>Predicción (ŷ):</strong> [${yPredict.join(', ')}]<br>
    <strong>MSE:</strong> ${mse}<br>
    <strong>R²:</strong> ${r2}
  `;

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        const data = google.visualization.arrayToDataTable(arr);
        const options = {
            series: {
                0: { type: 'scatter' },
                1: { type: 'line' }
            },
            hAxis: {
                title: 'Grado',
                viewWindow: { min: 1, max: 6 },
                ticks: X
            },
            vAxis: {
                title: 'Total de Estudiantes'
            }
        };
        const chart = new google.visualization.ComboChart(
            document.getElementById('chart_div')
        );
        chart.draw(data, options);
    }
}

fit_predict_draw();
