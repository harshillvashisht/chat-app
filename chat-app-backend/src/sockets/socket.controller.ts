import { Socket } from "socket.io"
import { joinUserRooms } from "./JoinRooms";
import { AuthenticatedSocket } from "./socketTypes";

export const handleConnection = async (socket: Socket) => {

    

    const authsocket = socket as AuthenticatedSocket;

    await joinUserRooms(authsocket);

}