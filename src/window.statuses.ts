enum Status {
	UNKNOWN =		'Unknown',		// Only during startup
	SCANNING =		'Scanning',		// Looking for a serial connection
	ATTACHED = 		'Attached',		// Ready to connect to serial
	CONNECTED = 	'Connected',	// Connected to serial	
	DISCONNECTED = 	'Disconnected'	// Serial connection unexpectedly closed; attempting recovery
};
export const UNKNOWN = 		Status.UNKNOWN;
export const SCANNING = 	Status.SCANNING;
export const ATTACHED = 	Status.ATTACHED;
export const CONNECTED = 	Status.CONNECTED;
export const DISCONNECTED = Status.DISCONNECTED;

export function update(status: Status)
{
	document.getElementById('reactor-status').style.color =
		status === Status.CONNECTED 		? 'green' 	:
		status === Status.DISCONNECTED 		? 'red'   	:
		/*  Default  */						  'black'	;
	document.getElementById('reactor-status').innerHTML = status;
	
	const connect_toggle_button = document.getElementById('connect-toggle-button') as HTMLButtonElement;
	connect_toggle_button.disabled = (status === UNKNOWN || status === SCANNING);
	if (status !== ATTACHED && status !== DISCONNECTED)
		connect_toggle_button.innerHTML = "DISCONNECT"; 
	else
		connect_toggle_button.innerHTML = "CONNECT";
}