const config = require('./config');
const status = require('./status');
const five = require('johnny-five');
const Raspi = require('raspi-io');
const events = require('./lib/events-emitter');
const { checkFace, loadModels } = require('./lib/face-utils');
const {
  closeDoor,
  openDoor,
  printMessege,
  piezoSong
} = require('./lib/raspi-utils');
const socket = require('./lib/socket');
const board = new five.Board({
   io: new Raspi() 
});

events.on('person-want-enter', (data) => {
    status.person = data.person;
});


//loadModels();
board.on('ready', () => {
    const servo = new five.Servo({ pin: 'P1-32', startAt: 180 });
    const led = new five.Led('P1-33');
    //const motion = new five.Motion({ pin: 'P1-40' });
    //const piezo = new five.Piezo({ pin: 'P1-16' });
    const lcd = new five.LCD({ controller: 'LCM1602' });

    openDoor(servo, lcd);
    //board.repl.inject({ piezo });

    /*motion.on('calibrated', function(data) {
        console.log('calibrated', data);
    });
    motion.on('motionstart', function(data) {
        console.log('motionstart', data);
    });
    motion.on('motionend', function(data) {
        console.log('motionend', data);
    });*/
});

