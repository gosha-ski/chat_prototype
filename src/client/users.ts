let global_socket  = new WebSocket("ws://localhost:5000/GLOBAL")

global_socket.onmessage = function(event){
	console.log(event.data)
}