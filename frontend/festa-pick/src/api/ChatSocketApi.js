import Common from "../utils/Common";

const CHAT_SOCKET_PATH = "/ws/chat";
const DEFAULT_MESSAGE_TYPE = "CHAT";

const getWebSocketBaseUrl = () => Common.HM_DOMAIN.replace(/^http/, "ws");

const createChatSocketUrl = (chatRoomId) => {
  const token = Common.getAccessToken();
  const params = new URLSearchParams({
    chatRoomId: String(chatRoomId),
    token: token ?? "",
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
  let retriedAfterRefresh = false;

  const openSocket = () => {
    socket = new WebSocket(createChatSocketUrl(chatRoomId));

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

    socket.onclose = async (event) => {
      if (!closedByClient && !opened && !retriedAfterRefresh) {
        retriedAfterRefresh = true;

        const refreshed = await Common.handleUnauthorized();

        if (refreshed) {
          openSocket();
          return;
        }

        onAuthFailure?.(event);
      }

      onClose?.(event);
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
