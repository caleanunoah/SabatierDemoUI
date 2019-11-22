const notebook = {};  // Exported module

notebook.severity = {
	ERROR: 		'#FF0000',
	WARNING: 	'#FFFF00',
	VERBOSE:	'#FFFFFF'
};

let linecount = 0;
notebook.append = function(str, severity) {
	console.log("Printed to Console: '" + str + "'");
	/*
	 * Function sets text color based on severity 
	 */
	let line_id = 'console-line-' + linecount++;
	let fmt_str = '<span '
				+ 'id="' + line_id + '" '
				+ 'style="color: ' + (severity || notebook.severity.VERBOSE) + '">'
				+ str
				+ '</span>\n';
	
	// Append the string
	document.getElementById("reactor-console-output").innerHTML += fmt_str;
	// Scroll to bottom
	document.getElementById(line_id).scrollIntoView();
}

notebook.clear = function () {
	console.log('Clearing Console');
	document.getElementById("reactor-console-output").innerHTML = '';
}


notebook.test = function() {
	notebook.append("Reactor Started!");
	notebook.append("Received data is simulated!", notebook.severity.WARNING)
	// notebook.append("---Reactor Console Test Start---");
	// notebook.append("This is a verbose output. It should be WHITE",
		// notebook.severity.VERBOSE);
	// notebook.append("This is a warning output. It should be YELLOW",
		// notebook.severity.WARNING);
	// notebook.append("This is an error output. It should be RED",
		// notebook.severity.ERROR);
	// notebook.append("---Reactor Console Test Finished---");
}
module.exports = notebook;