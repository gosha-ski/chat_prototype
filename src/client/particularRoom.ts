let leaveRoomButton = document.getElementById("leaveRoomButton")
let messages = document.getElementById("messages")
let textArea = document.getElementById("textArea")
let sendButton = document.getElementById("sendButton")
let rerurnButton = document.getElementById("returnButton")


let socket = new WebSocket(`ws://localhost:5000${location.pathname}`)
let global_socket  = new WebSocket("ws://localhost:5000/GLOBAL")

let roomId = location.pathname.split("/")[2]
console.log(roomId)


leaveRoomButton.onclick = function(){
	socket.close(1000)
	global_socket.close(1000)

	let response = fetch("http://localhost:5000/rooms?action=leaveRoom",{
		method: "POST",
		headers:{
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({roomId: roomId})
	})
	location.replace("http://localhost:5000/rooms")
}

global_socket.onmessage = function(event){
	console.log(event.data)
}

socket.onmessage = function(event){
	console.log(JSON.parse(event.data))
	let data = JSON.parse(event.data)
	messages.innerHTML = messages.innerHTML + 
	`
	<div class="message__container">
	    <div id=${data.message.id}>
  	       ${data.message.userName}: ${data.message.content}
	    </div>
	    <input type="button" class="btn" id=${data.message.id} value="delete">
	</div>
	`
}

sendButton.onclick = function(){
	let text = textArea.value
	socket.send(text)
}