const express = require("express");
const app = express();
const { exec } = require("child_process");

const PORT = 8888;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", { layout: false } );

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/rs", (req, res) => {
	console.log("Restarting...");
	res.status(200).send({status: "OK"});
	setTimeout(() => {
		exec("sudo shutdown -r now");
	}, 2000);
});

app.post("/sd", (req, res) => {
	console.log("Restarting...");
	res.status(200).send({status: "OK"});
	setTimeout(() => {
		exec("sudo shutdown -h now");
	}, 2000);
});

app.listen(PORT, () => {
	console.log(`Now listening at port ${PORT}...`);
});
