const destinationEnum = Object.freeze({
  HARDWARE_AND_SOFTWARE: 0,
  HARDWARE_ONLY: 1,
  SOFTWARE_ONLY: 2,
});

export default class CounterAction {
  static onKeyDown(websocket, context, settings) {
    this.timer = setTimeout(() => {
      const updatedSettings = {};
      updatedSettings['keyPressCounter'] = -1;

      CounterAction.setSettings(websocket, context, updatedSettings);
      CounterAction.setTitle(websocket, context, 0);
    }, 1500);
  }

  static onKeyUp(websocket, context, settings) {
    clearTimeout(this.timer);

    let keyPressCounter = 0;
    if (settings != null && settings.hasOwnProperty('keyPressCounter')) {
      keyPressCounter = settings['keyPressCounter'];
    }

    keyPressCounter++;

    const updatedSettings = {};
    updatedSettings['keyPressCounter'] = keyPressCounter;

    CounterAction.setSettings(websocket, context, updatedSettings);

    CounterAction.setTitle(websocket, context, keyPressCounter);
  }

  static onWillAppear(websocket, context, settings, coordinates) {
    let keyPressCounter = 0;
    if (settings != null && settings.hasOwnProperty('keyPressCounter')) {
      keyPressCounter = settings['keyPressCounter'];
    }

    CounterAction.setTitle(websocket, context, keyPressCounter);
  }

  static setTitle(websocket, context, keyPressCounter) {
    const json = {
      event: 'setTitle',
      context: context,
      payload: {
        title: '' + keyPressCounter,
        target: destinationEnum.HARDWARE_AND_SOFTWARE,
      },
    };

    websocket.send(JSON.stringify(json));
  }

  static setSettings(websocket, context, settings) {
    const json = {
      event: 'setSettings',
      context: context,
      payload: settings,
    };

    websocket.send(JSON.stringify(json));
  }
}
