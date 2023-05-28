import Axios from 'axios';

const ChatRoomServices = {
  createRoom: () => {
    return Axios({
      url: 'https://api.netless.link/v5/rooms',
      method: 'POST',
      headers: {
        token:
          'NETLESSSDK_YWs9Zl9adUFmaVFwOENvRGY3dSZub25jZT01MjI3YjBhMC1mZDJhLTExZWQtOTI2My01ZjgyYjNlZjEzMTUmcm9sZT0wJnNpZz0yMjY3NzQ1M2RlMzM4NDA0MDQ1Yzc0NjM0NDY4NzEzZTY2YTIyYzMwNzY3NzFlY2Q5MGQxMmMzYWE0YTUyZmY5',
        region: 'sg',
      },
    });
  },
  generateRoomToken: uuid => {
    return Axios({
      url: `https://api.netless.link/v5/tokens/rooms/${uuid}`,
      method: 'POST',
      headers: {
        token:
          'NETLESSSDK_YWs9Zl9adUFmaVFwOENvRGY3dSZub25jZT01MjI3YjBhMC1mZDJhLTExZWQtOTI2My01ZjgyYjNlZjEzMTUmcm9sZT0wJnNpZz0yMjY3NzQ1M2RlMzM4NDA0MDQ1Yzc0NjM0NDY4NzEzZTY2YTIyYzMwNzY3NzFlY2Q5MGQxMmMzYWE0YTUyZmY5',
        region: 'sg',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({lifespan: 3600000, role: 'admin'}),
    });
  },
};

export default ChatRoomServices;
