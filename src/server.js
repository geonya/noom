import WebSocket from "ws";
import http from "http";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () =>
	console.log("✅ Listening on http://localhost:3000 🚀");

const server = http.createServer(app); // access server
const wss = new WebSocket.Server({ server });

// http server + WebSocket server share the same port(3000)
let sockets = [];

wss.on("connection", (socket) => {
	sockets.push(socket);
	socket["nickname"] = "Nobody";
	console.log("✅ Socket in server : Brower which is connected");
	socket.on("close", () => console.log("Disconnected from the browser ❌"));
	socket.on("message", (msg) => {
		const message = JSON.parse(msg.toString("utf8"));
		switch (message.type) {
			case "new_message":
				sockets.forEach((aSocket) => {
					if (aSocket.nickname !== socket.nickname) {
						const stringMsg = JSON.stringify({
							type: "new_message",
							payload: `${socket.nickname} : ${message.payload}`,
						});
						aSocket.send(stringMsg);
					}
				});
				break;
			case "nickname":
				socket["nickname"] = message.payload;
				socket.send(
					JSON.stringify({
						type: "nickname",
						payload: message.payload,
					})
				);
				break;
		}
	});
});

server.listen(3000, handleListen);
