import io from "socket.io-client";
const ENDPOINT = "https://chess-server-10.herokuapp.com/";
export const socket = io(ENDPOINT,{
  path: '/socket.io',
  transports: ['websocket'],
  secure: true,
});





