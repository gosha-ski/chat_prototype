let new_messages = document.getElementById("new_messages")
let global_socket  = new WebSocket("ws://localhost:5000/GLOBAL")

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
