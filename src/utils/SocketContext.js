import React, { createContext } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://socket-chat-delta.vercel.app'),
    SocketContext = createContext(socket);

socket.on('connect', () => console.log('connected to socket'));

const SocketProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};
export { socket, SocketContext, SocketProvider };
