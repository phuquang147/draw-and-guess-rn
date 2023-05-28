import Axios from 'axios';

const ChatRoomServices = {
  createRoom: () => {
    return Axios({
      url: 'https://api.netless.link/v5/rooms',
      method: 'POST',
      headers: {
        token:
          'NETLESSSDK_YWs9Zl9adUFmaVFwOENvRGY3dSZub25jZT1jOWIwMDIxMC1mYWM1LTExZWQtOGE1OC01NzMzZDk0MDkxMDImcm9sZT0wJnNpZz1hZjdkYTRkYWI1MTQ0MGM3Nzk4YjU3NGZmN2M4OGVhNGViN2RjYjU2MWMwZWU1NDk0YzJhOWRiMzY5ZjU2ZDll',
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
          'NETLESSSDK_YWs9Zl9adUFmaVFwOENvRGY3dSZub25jZT1hZTNhNmI5MC1mODViLTExZWQtYTRhYS05NTVjMDAzNDVkZmQmcm9sZT0wJnNpZz1mY2YxZDEwOWVkZjY2Y2M5NTg4Njg5MDFiM2UzOWEzMzJkMmUxOGY5YTUwMjc5MDJiNjA0MDBiM2YzNWZmYmY2',
        region: 'sg',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({lifespan: 3600000, role: 'admin'}),
    });
  },
};

export default ChatRoomServices;
