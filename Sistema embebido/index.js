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



loadModels();
board.on('ready', () => {
    const servo = new five.Servo({ pin: 'P1-32', startAt: 180 });
    const led = new five.Led('P1-33');
    const motion = new five.Motion({ pin: 'P1-40' });
    const piezo = new five.Piezo({ pin: 'P1-16' });
    const lcd = new five.LCD({ controller: 'LCM1602' });
    board.repl.inject({ piezo });
    events.on('force-open', () => {
			if (status.doorOpen || status.checking ) {
				return;	
			}
			printMessege(lcd, 'puede entrar');
			piezoSong(piezo);		    
			openDoor(servo, led);
    })
    events.on('person-want-enter', (person) => {
			if (status.doorOpen || status.checking ) {
				return;	
			}
			if(status.detectedMotion == false) {
				printMessege(lcd, 'Movimiento no', 'detectado');
				return;
			}
			printMessege(lcd, 'Escaneando cara de ', person);
			status.checking = true;
			checkFace().then((prediction) => {
				console.log(prediction, status.unknownThreshold);
				status.checking = false;
				if(prediction.className !== 'unknown') {
					console.log('Nombre -> ', prediction.className)
				} else {
					console.log('Persona desconocida');
				}
				if(prediction.className == person) {
					printMessege(lcd, person, 'puede entrar');
					piezoSong(piezo);		    
					openDoor(servo, led);
				}
			});
    });

    motion.on('calibrated', () => {
      console.log('Motion calibrated');
    });
    motion.on('motionstart', (data) => {
			status.detectedMotion = data.detectedMotion;
    });
    motion.on('motionend', (data) => {
			status.detectedMotion = data.detectedMotion;
    });
});

