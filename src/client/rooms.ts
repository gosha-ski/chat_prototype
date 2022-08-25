let new_messages = document.getElementById("new_messages")
let global_socket  = new WebSocket("ws://localhost:5000/GLOBAL")
let createRoom = document.getElementById("createRoom")
let createButton = document.getElementById("createButton")
let joinButton = document.getElementById("joinButton")
let joinRoom = document.getElementById("joinRoom")


global_socket.onmessage = function(event){
	let data=JSON.parse(event.data)
	
	if(data.action=="UPDATE_MESSAGES_COUNT"){
		let MessageCount = document.getElementById(`new_messages_count_${data.roomId}`)
		let MessageContent = document.getElementById(`new_messages_content_${data.roomId}`)
		MessageCount.innerHTML = "0"
		MessageContent.innerHTML = ""
	}else{
		let MessageCount = document.getElementById(`new_messages_count_${data.fromRoomId}`)
		let MessageContent = document.getElementById(`new_messages_content_${data.fromRoomId}`)
		let newCount = Number(MessageCount.innerHTML)+1
		let newContent = data.content
		MessageCount.innerHTML = newCount
		MessageContent.innerHTML = newContent
	}
}

createButton.onclick = async function(){
	let room = createRoom.value
	let response = await fetch("http://localhost:5000/rooms?action=createRoom", {
		method: "POST",
		headers:{
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({name: room})
	})
	let result = await response;
	

}

joinButton.onclick = function(){
	let roomId = joinRoom.value
	window.location.replace(`http://localhost:5000/rooms/${roomId}`);
}
