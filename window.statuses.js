const reactor_status = {};  // Exported module

reactor_status.status = {
	UNKNOWN:		'Unknown',
	CONNECTED: 		'Connected',
	DISCONNECTED: 	'Disconnected'
};

reactor_status.set = (status) =>
{
	document.getElementById('reactor-status').style.color =
		status == reactor_status.status.CONNECTED 		? 'green' 	:
		status == reactor_status.status.DISCONNECTED 	? 'red'   	:
		/*  Default  */									  'black'	;
	document.getElementById('reactor-status').innerHTML = status;
}

module.exports = reactor_status;