const main = document.querySelector("main");
const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
	const msg = { type, payload };
	return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
	console.log("✅ Socket in browser : connection to server ");
});
socket.addEventListener("close", () => {
	console.log("This connected for server ❌");
});
socket.addEventListener("message", (msg) => {
	const message = JSON.parse(msg.data);
	switch (message.type) {
		case "new_message":
			const li = document.createElement("li");
			li.innerText = message.payload;
			messageList.appendChild(li);
			break;
		case "nickname":
			nickForm.style.visibility = "hidden";
			const h1 = document.createElement("h1");
			h1.innerText = message.payload;
			main.prepend(h1);
			break;
	}
});

function handleNickSubmit(event) {
	event.preventDefault();
	const input = nickForm.querySelector("input");
	socket.send(makeMessage("nickname", input.value));
}
function handleMsgSubmit(event) {
	event.preventDefault();
	const input = messageForm.querySelector("input");
	socket.send(makeMessage("new_message", input.value));
	const li = document.createElement("li");
	li.innerText = `You : ${input.value}`;
	messageList.appendChild(li);
	input.value = "";
}

nickForm.addEventListener("submit", handleNickSubmit);
messageForm.addEventListener("submit", handleMsgSubmit);
