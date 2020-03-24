'use strict';

const readline = require('readline');

const Remote = require('./remote');

(function() {
  const ip = process.argv[2];
  if (!ip) {
    throw new Error('No IP provided');
  }

  const remote = new Remote(ip);

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  const shutdown = function() {
    console.log('Exiting..');
    process.stdin.setRawMode(false);
    process.stdin.resume();
    process.exit(0);
  };

  const keymap = {
    p: 'input',
    m: 'menu',
    h: 'home',
    j: 'left',
    l: 'right',
    i: 'up',
    k: 'down',
    space: 'play',
    return: 'enter',
    backspace: 'back',
    '-': 'volume_down',
    '=': 'volume_up',
    '0': 'mute',
    'ctrl-x': 'power',

    q: shutdown,
    'ctrl-c': shutdown
  };

  process.stdin.on('keypress', (str, key) => {
    if (!key) {
      return;
    }

    const { name, sequence, ctrl, meta, shift } = key;

    let label;
    if (name) {
      label = '';
      if (ctrl) {
        label += 'ctrl-';
      }
      if (meta) {
        label += 'meta-';
      }
      if (shift) {
        label += 'shift-';
      }
      label += name;
    } else {
      // name doesn't exist for symbols such as -, =
      label = sequence;
    }

    if (label in keymap) {
      const val = keymap[label];
      if (typeof val === 'string') {
        remote.send(val, err => {
          if (err) {
            console.log(`Failed to send command ${command}: ${err}`);
          }
        });
      } else if (typeof val === 'function') {
        val();
      } else {
        throw new Error('Unknown value for key ' + key);
      }
    } else {
      console.log('Unknown key: ' + JSON.stringify(key));
    }
  });
})();
