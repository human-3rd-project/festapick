import Common from "../utils/Common";
import AxiosInstance from "./AxiosInstance";

const CHAT_SOCKET_PATH = "/ws/chat";
const DEFAULT_MESSAGE_TYPE = "CHAT";

const getWebSocketBaseUrl = () => {
  if (Common.HM_DOMAIN) {
    return Common.HM_DOMAIN.replace(/^http/, "ws");
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}`;
};

const requestWebSocketTicket = async () => {
  const response = await AxiosInstance.post("/ws/ticket");
  const ticket = response?.data?.data;

  if (!ticket) {
    throw new Error("WebSocket ticket was not issued.");
  }

  return ticket;
};

const createChatSocketUrl = (chatRoomId, ticket) => {
  const params = new URLSearchParams({
    chatRoomId: String(chatRoomId),
    ticket,
  });

  return `${getWebSocketBaseUrl()}${CHAT_SOCKET_PATH}?${params.toString()}`;
};

const parseSocketMessage = (event) => {
  try {
    return JSON.parse(event.data);
  } catch (error) {
    return event.data;
  }
};

export const connectChatSocket = ({
  chatRoomId,
  onOpen,
  onMessage,
  onClose,
  onError,
  onAuthFailure,
}) => {
  if (!chatRoomId) {
    throw new Error("chatRoomId is required.");
  }

  let socket;
  let opened = false;
  let closedByClient = false;
  let retriedAfterFailure = false;

  const openSocket = async () => {
    try {
      const ticket = await requestWebSocketTicket();

      if (closedByClient) {
        return;
      }

      socket = new WebSocket(createChatSocketUrl(chatRoomId, ticket));
    } catch (error) {
      onError?.(error);
      onAuthFailure?.(error);
      onClose?.(error, {
        authFailed: true,
        closedByClient,
        wasOpened: false,
      });
      return;
    }

    socket.onopen = (event) => {
      opened = true;
      onOpen?.(event);
    };

    socket.onmessage = (event) => {
      onMessage?.(parseSocketMessage(event), event);
    };

    socket.onerror = (event) => {
      onError?.(event);
    };

    socket.onclose = (event) => {
      const wasOpened = opened;

      if (!closedByClient && !opened && !retriedAfterFailure) {
        retriedAfterFailure = true;
        openSocket();
        return;
      }

      onClose?.(event, {
        authFailed: !closedByClient && !wasOpened,
        closedByClient,
        wasOpened,
      });
    };
  };

  openSocket();

  return {
    send: (payload) => {
      if (socket?.readyState !== WebSocket.OPEN) {
        return false;
      }

      socket.send(JSON.stringify(payload));
      return true;
    },
    sendMessage: ({
      message,
      imageUrl = null,
      messageType = DEFAULT_MESSAGE_TYPE,
    }) => {
      if (socket?.readyState !== WebSocket.OPEN) {
        return false;
      }

      socket.send(
        JSON.stringify({
          message,
          imageUrl,
          messageType,
        }),
      );
      return true;
    },
    close: (code, reason) => {
      closedByClient = true;
      socket?.close(code, reason);
    },
    getSocket: () => socket,
  };
};

const ChatSocketApi = {
  connect: connectChatSocket,
};

export default ChatSocketApi;
