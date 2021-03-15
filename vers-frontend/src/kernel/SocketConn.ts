const plantUrl = process.env.REACT_APP_SOC_PLANT_URL ?? "";

class SocketConn {
  static getPlantSoc = (onmessage?: (e: MessageEvent) => any, onclose?: (e: CloseEvent) => any) => {
    try {
      let ws = new WebSocket(plantUrl);
      if (onmessage) ws.onmessage = onmessage;
      if (onclose) ws.onclose = onclose;
      return ws;
    } catch (e) {
      console.log(e);
    }
  };
}

export default SocketConn;
