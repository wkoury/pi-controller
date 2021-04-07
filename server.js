const express = require("express");
const app = express();
const { exec } = require("child_process");

const PORT = 8888;
const SERVER_ABSOLUTE_PATH = "~/code/pi-controller"

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("view options", { layout: false } );

app.use(express.static(__dirname + '/public'));

function getCPUTemperature(){
	return new Promise((resolve) => {
		exec("cat /sys/class/thermal/thermal_zone0/temp", (error, stdout, stderr) => {
			
			if(error){
				resolve({
					"celsius": "NaN",
					"fahrenheit": "NaN"
				});
			}

			const celsius = stdout / 1000;
			const fahrenheit = celsius * (9/5) + 32;
			
			resolve({
				"celsius": celsius,
				"fahrenheit": fahrenheit
			});
		});
	});
}

app.get("/", (req, res) => {
	getCPUTemperature().then(temps => {
		const { fahrenheit } = temps;
		res.render("index", {
			fahrenheit: fahrenheit
		});
	});
});

app.post("/rs", (req, res) => {
	console.log("Restarting...");
	res.status(200).send({status: "OK"});
	exec("pm2 save");
	setTimeout(() => {
		exec("sudo shutdown -r now");
	}, 2000);
});

app.post("/sd", (req, res) => {
	console.log("Restarting...");
	res.status(200).send({status: "OK"});
	exec("pm2 save");
	setTimeout(() => {
		exec("sudo shutdown -h now");
	}, 2000);
});

app.post("/rl", (req, res) => {
	console.log("Reloading server...");
	exec(`cd ${SERVER_ABSOLUTE_PATH} && git pull origin main && pm2 reload all`);
});	

app.listen(PORT, () => {
	console.log(`Now listening at port ${PORT}...`);
});
