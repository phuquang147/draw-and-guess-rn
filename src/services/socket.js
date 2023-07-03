import {io} from 'socket.io-client';
const socket = io('http://localhost:3000');
socket.on('connect', () => {
  console.log("socket.connected");
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
export default socket;