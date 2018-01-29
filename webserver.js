

const http = require("http");
const fs = require("fs");

const respondWithFile = (response, fileName, headers) => {
	fs.readFile(fileName, (err, file) => {
		if (err) {
			console.error(`Error found.`);
			console.error(err.message);
			response.write("Error!", () => {
				response.end();
			});
		} else {
			response.writeHead(200, headers);
			response.write(file, () => { response.end(); });
		}
	});
};

const requestListener = (request, response) => {
	const url = request.url;
	console.log(`Handling request ${url}..`);
	if (url == "/") {
		respondWithFile(response, "index.html", {"Content-Type": "text/html"});
	} else if (url == "/work/bundle.css") {
		respondWithFile(response, "work/bundle.css", {"Content-Type": "text/css"});
	} else if (url == "/work/bundle.js") {
		respondWithFile(response, "work/bundle.js", {"Content-Type": "text/javascript"});
	} else {
		console.error(`Uh oh.. ${url} not found..`);
		response.writeHead(403 );
		response.end();
	}
};

const webserver = http.createServer(requestListener);

process.on("SIGINT", () => {
	webserver.close()
	console.log("Server terminated. See ya!");
	console.log("");
});

console.log("");
console.log("Compilation complete. Starting server..");
webserver.listen(3000);
