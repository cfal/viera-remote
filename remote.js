'use strict';

const http = require('http');

// Commands are taken from: https://github.com/pvalkone/viera-ip-control-proxy/blob/master/src/main/scala/com/github/pvalkone/vieraipcontrolproxy/vieraIpControlProxyServer.scala#L206
// which in turn were taken from: https://github.com/samuelmatis/viera-control/blob/master/codes.txt

const COMMAND_CODES = {
  power: 'NRC_POWER-ONOFF',
  menu: 'NRC_MENU-ONOFF',
  '3d': 'NRC_3D-ONOFF',
  tv: 'NRC_TV-ONOFF',
  input: 'NRC_CHG_INPUT-ONOFF',
  info: 'NRC_INFO-ONOFF',
  exit: 'NRC_CANCEL-ONOFF',
  apps: 'NRC_APPS-ONOFF',
  home: 'NRC_HOME-ONOFF',
  guide: 'NRC_EPG-ONOFF',
  up: 'NRC_UP-ONOFF',
  right: 'NRC_RIGHT-ONOFF',
  down: 'NRC_DOWN-ONOFF',
  left: 'NRC_LEFT-ONOFF',
  enter: 'NRC_ENTER-ONOFF',
  submenu: 'NRC_SUBMENU-ONOFF',
  back: 'NRC_RETURN-ONOFF',
  red: 'NRC_RED-ONOFF',
  green: 'NRC_GREEN-ONOFF',
  yellow: 'NRC_YELLOW-ONOFF',
  blue: 'NRC_BLUE-ONOFF',
  mute: 'NRC_MUTE-ONOFF',
  text: 'NRC_TEXT-ONOFF',
  sttl: 'NRC_STTL-ONOFF',
  aspect: 'NRC_DISP_MODE-ONOFF',
  volume_up: 'NRC_VOLUP-ONOFF',
  volume_down: 'NRC_VOLDOWN-ONOFF',
  channel_up: 'NRC_CH_UP-ONOFF',
  channel_down: 'NRC_CH_DOWN-ONOFF',
  digit_1: 'NRC_D1-ONOFF',
  digit_2: 'NRC_D2-ONOFF',
  digit_3: 'NRC_D3-ONOFF',
  digit_4: 'NRC_D4-ONOFF',
  digit_5: 'NRC_D5-ONOFF',
  digit_6: 'NRC_D6-ONOFF',
  digit_7: 'NRC_D7-ONOFF',
  digit_8: 'NRC_D8-ONOFF',
  digit_9: 'NRC_D9-ONOFF',
  digit_0: 'NRC_D0-ONOFF',
  ehelp: 'NRC_GUIDE-ONOFF',
  last_view: 'NRC_R_TUNE-ONOFF',
  rewind: 'NRC_REW-ONOFF',
  play: 'NRC_PLAY-ONOFF',
  fast_forward: 'NRC_FF-ONOFF',
  skip_previous: 'NRC_SKIP_PREV-ONOFF',
  pause: 'NRC_PAUSE-ONOFF',
  skip_next: 'NRC_SKIP_NEXT-ONOFF',
  stop: 'NRC_STOP-ONOFF',
  record: 'NRC_REC-ONOFF'
};

class Remote {
  constructor(ip) {
    this._ip = ip;
  }

  send(command, cb) {
    if (typeof command !== 'string') {
      throw new Error('Invalid command');
    }
    command = command.toLowerCase();
    if (!(command in COMMAND_CODES)) {
      throw new Error('Unknown command: ' + command);
    }

    const code = COMMAND_CODES[command];
    const data = `<?xml version="1.0" encoding="utf-8"?>
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <s:Body>
        <u:X_SendKey xmlns:u="urn:panasonic-com:service:p00NetworkControl:1">
          <X_KeyEvent>${code}</X_KeyEvent>
        </u:X_SendKey>
      </s:Body>
    </s:Envelope>`;

    const req = http.request({
      host: this._ip,
      port: '55000',
      path: '/nrc/control_0',
      method: 'POST',
      headers: {
        'Content-Type' : 'text/xml; charset="utf-8"',
        'SOAPACTION' : '"urn:panasonic-com:service:p00NetworkControl:1#X_SendKey"'
      }
    }, res => {
      if (res.statusCode !== 200) {
        return cb('Returned status code ' + res.statusCode);
      }
      cb();
    });

    req.end(data);
  }
}

module.exports = Remote;
