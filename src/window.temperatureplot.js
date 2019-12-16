module.exports = new Chart($('#dataplot-temperature'), {
	type: 'scatter',
	data: {
		datasets:[
			{
				label: 'Inflow',
				fill: false,
				borderColor: '#FFFF00',  // Yellow
				backgroundColor: '#FFFF00',  // Yellow
				yAxisID: 'T',
				data: [
					{
						x: 0,
						y: 0
					}
				]
			},
			{
				label: 'Reactor',
				fill: false,
				borderColor: '#FF0000',
				backgroundColor: '#FF0000',  // Red
				yAxisID: 'T',
				data: [
					{
						x: 0,
						y: 120
					},
					{
						x: 0.251,
						y: 200
					},
					{
						x: 0.59,
						y: 210
					},
					{
						x: 0.79,
						y: 250
					},
					{
						x: 0.91,
						y: 290
					},
					{
						x: 1.23,
						y: 310
					},
					{
						x: 1.61,
						y: 313
					},
					{
						x: 1.99,
						y: 293
					}
				]
			}
		]
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		title: {
			display: true,
			text: 'Temperature'
		},
		scales: {
			xAxes: [{
				type: 'linear',
				position: 'bottom'
			}],
			yAxes: [{
				id: 'T',
				type: 'linear',
				position: 'right',
				text: 'Temperature [°C]'
			}]
		},
		legend: {
			position: 'left'
		},
		animation: {
			duration: 0
		}
	}
});