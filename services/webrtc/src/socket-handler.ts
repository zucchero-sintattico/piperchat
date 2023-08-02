import { Socket } from "socket.io";

const sockets: { [key: string]: Socket } = {};
export const handleSocket = (socket: Socket, username: string) => {
	console.log("Socket connected", socket.id, username);
	sockets[username] = socket;

	socket.on("join-room", (roomId) => {
		console.log("Joining room", roomId);

		socket.to(roomId).emit("user-connected", username);
		socket.join(roomId);

		socket.on("disconnect", () => {
			socket.to(roomId).emit("user-disconnected", username);
		});

		socket.on("offer", (offer, to) => {
			sockets[to].emit("offer", offer, username);
		});

		socket.on("answer", (answer, to) => {
			sockets[to].emit("answer", answer, username);
		});

		socket.on("ice-candidate", (candidate, to) => {
			sockets[to].emit("ice-candidate", candidate, username);
		});
	});
};
