module.exports = new Chart($('#dataplot-massflow'), {
	type: 'scatter',
	data: {
		datasets: [
			{
				label: 'Argon',
				fill: false,
				borderColor: '#F98D8D',
				backgroundColor: '#F98D8D',  // Pink
				yAxisID: 'Q',
				data: [
					{
						x: 0,
						y: 0
					},
					{
						
						x: 1,
						y: 1
					},
					{
						x: 2,
						y: 1.8
					},
					{
						x: 3,
						y: 1.9
					},
					{
						x: 4,
						y: 2
					}
				]
			},
			{
				label: 'CO2',
				fill: false,
				borderColor: '#CD853F',
				backgroundColor: '#CD853F',  // Beige
				yAxisID: 'Q',
				data: [
					{
						x: 0,
						y: 0
					},
					{
						
						x: 0.80,
						y: 2
					},
					{
						x: 1.91,
						y: 2.12
					},
					{
						x: 2.88,
						y: 1.95
					},
					{
						x: 4.12,
						y: 2.01
					}
				]
			},
			{
				label: 'Water',
				fill: false,
				borderColor: '#6495ED',
				backgroundColor: '#6495ED',  // Blue
				yAxisID: 'Q',
				data: [
					{
						x: 0,
						y: 0
					},
					{
						
						x: 1.0,
						y: 2
					},
					{
						x: 2.3,
						y: 2
					},
					{
						x: 3.1,
						y: 2
					},
					{
						x: 4.2,
						y: 2
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
			text: 'Mass Flow Rates'
		},
		scales: {
			xAxes: [{
				type: 'linear',
				position: 'bottom'
			}],
			yAxes: [{
				id: 'Q',
				type: 'linear',
				position: 'right',
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