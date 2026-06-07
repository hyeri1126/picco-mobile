import { io, Socket } from 'socket.io-client';

import { env } from '@shared/config';
import { tokenStorage } from '@shared/auth';

// 싱글톤 소켓 인스턴스 (앱 전체에서 1개)
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(env.wsUrl, {
      autoConnect: false,
      auth: (cb) => {
        // 매 연결 시도마다 최신 토큰을 읽어 주입
        cb({ token: tokenStorage.getAccessToken() });
      },
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
