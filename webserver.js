
const express = require("express");
const fs = require("fs");

const respondWith403 = (response, url) => {
		console.error(`Uh oh.. ${url} not found..`);
		response.writeHead(403);
		response.end();
};

const respondWithFile = (response, fileName, opt_headers) => {
	fs.readFile(fileName, (err, file) => {
		if (err) {
			console.error(`Error found.`);
			console.error(err.message);
			response.write("Error!", () => {
				response.end();
			});
		} else {
			if (opt_headers) {
				response.writeHead(200, opt_headers);
			}
			response.write(file, () => { response.end(); });
		}
	});
};

const indexListener = (request, response) => {
	const url = request.url;
	console.log(`Handling request ${url}..`);
	if (url == "/") {
		respondWithFile(response, "index.html", {"Content-Type": "text/html"});
	} else {
		respondWith403(response, url);
	}
};

const bundleListener = (request, response) => {
	const url = request.url;
	console.log(`Handling request ${url}..`);
	if (url == "/work/bundle.css") {
		respondWithFile(response, "work/bundle.css", {"Content-Type": "text/css"});
	} else if (url == "/work/bundle.js") {
		respondWithFile(response, "work/bundle.js", {"Content-Type": "text/javascript"});
	} else {
		respondWith403(response, url);
	}
};

const imageListener = (request, response) => {
	const url = request.url;
	console.log(`Handling request ${url}..`);
	if (url.startsWith("/img/")) {
		const filename = "img" + url.substr(url.lastIndexOf('/'));
		respondWithFile(response, filename);
	} else {
		respondWith403(response, url);
	}
};

const app = express();
app.get("/", indexListener);
app.get("/work/*", bundleListener);
app.get("/img/*", imageListener);


console.log("");
console.log("Compilation complete. Starting server..");
const webserver = app.listen(3000);

process.on("SIGINT", () => {
	webserver.close()
	console.log("Server terminated. See ya!");
	console.log("");
});
