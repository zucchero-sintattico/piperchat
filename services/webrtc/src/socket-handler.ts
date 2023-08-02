import { Socket } from "socket.io";

export const handleSocket = (socket: Socket, username: String) => {
	console.log("Socket connected", socket.id, username);

	socket.on("join-room", (roomId, userId) => {
		console.log("Joining room", roomId, userId);

		socket.join(roomId);
		socket.to(roomId).emit("user-connected", userId);

		socket.on("disconnect", () => {
			socket.to(roomId).emit("user-disconnected", userId);
		});

		socket.on("offer", (offer, userId) => {
			socket.to(roomId).emit("offer", offer, userId);
		});

		socket.on("answer", (answer, userId) => {
			socket.to(roomId).emit("answer", answer, userId);
		});

		socket.on("ice-candidate", (candidate, userId) => {
			socket.to(roomId).emit("ice-candidate", candidate, userId);
		});
	});
};
