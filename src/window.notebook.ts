enum Severity {
	ERROR = 	'#FF0000',
	WARNING = 	'#FFFF00',
	VERBOSE =	'#FFFFFF'
};
export const ERROR = Severity.ERROR;
export const WARNING = Severity.WARNING;
export const VERBOSE = Severity.VERBOSE;

let bottom_line_id = 0;
export function append(str: string, severity?: Severity)
{
	console.log("Printed to Console: '" + str + "'");
	/*
	 * Function sets text color based on severity 
	 */
	let line_id = 'console-line-' + ++bottom_line_id;
	let fmt_str = '<span '
				+ 'id="' + line_id + '" '
				+ 'style="color: ' + (severity || Severity.VERBOSE) + '">'
				+ str
				+ '</span>\n';
	
	// Append the string
	document.getElementById("reactor-console-output").innerHTML += fmt_str;
	scroll_to_bottom();
}

export function scroll_to_bottom()
{
	document.getElementById('console-line-' + bottom_line_id).scrollIntoView();
}

export function clear() {
	console.log('Clearing Console');
	document.getElementById("reactor-console-output").innerHTML = '';
}


export function test() {
	append("Reactor Started!");
	append("Received data is simulated!", Severity.WARNING)
	// notebook.append("---Reactor Console Test Start---");
	// notebook.append("This is a verbose output. It should be WHITE",
		// notebook.severity.VERBOSE);
	// notebook.append("This is a warning output. It should be YELLOW",
		// notebook.severity.WARNING);
	// notebook.append("This is an error output. It should be RED",
		// notebook.severity.ERROR);
	// notebook.append("---Reactor Console Test Finished---");
}
