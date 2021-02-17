import CounterAction from './counter';

// eslint-disable-next-line no-unused-vars
function connectElgatoStreamDeckSocket(
  inPort,
  inPluginUUID,
  inRegisterEvent,
  inInfo
) {
  const pluginUUID = inPluginUUID;

  // Open the web socket
  const websocket = new WebSocket('ws://127.0.0.1:' + inPort);

  function registerPlugin(inPluginUUID) {
    const json = {
      event: inRegisterEvent,
      uuid: inPluginUUID,
    };

    websocket.send(JSON.stringify(json));
  }

  websocket.onopen = () => {
    // WebSocket is connected, send message
    registerPlugin(pluginUUID);
  };

  websocket.onmessage = (evt) => {
    // Received message from Stream Deck
    const jsonObj = JSON.parse(evt.data);
    const event = jsonObj['event'];
    // eslint-disable-next-line no-unused-vars
    const action = jsonObj['action'];
    const context = jsonObj['context'];

    if (event === 'keyDown') {
      const jsonPayload = jsonObj['payload'];
      const settings = jsonPayload['settings'];
      // const coordinates = jsonPayload['coordinates'];
      // const userDesiredState = jsonPayload['userDesiredState'];
      CounterAction.onKeyDown(websocket, context, settings);
    } else if (event === 'keyUp') {
      const jsonPayload = jsonObj['payload'];
      const settings = jsonPayload['settings'];
      // const coordinates = jsonPayload['coordinates'];
      // const userDesiredState = jsonPayload['userDesiredState'];
      CounterAction.onKeyUp(websocket, context, settings);
    } else if (event === 'willAppear') {
      const jsonPayload = jsonObj['payload'];
      const settings = jsonPayload['settings'];
      const coordinates = jsonPayload['coordinates'];
      CounterAction.onWillAppear(websocket, context, settings, coordinates);
    }
  };

  websocket.onclose = () => {
    // Websocket is closed
  };
}

// Line to keep the function after webpack build
window.connectElgatoStreamDeckSocket = connectElgatoStreamDeckSocket;
