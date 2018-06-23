const io = require('socket.io-client');
const socket = io(config.API);
const events = require('./lib/events-emitter');
const status = require('./status');

function printPerson() {
	lcd.clear();
	lcd.cursor(row, col);
	lcd.print(status.person);
}
function closeDoor(servo) {
	 servo.to(180, 500);
}
function openDoor(servo, led) {
	led.pulse();
	servo.to(0, 500); 
	setTimeout(() => {
		led.off();
		events.emit('door-open');
	}, 550); 
}
function piezoSong(piezo) {
  piezo.play({
    song: 'C D F D G - A G - C D F D G - G G G G F F F F - -',
    beats: 1 / 2,
    tempo: 5000
  });
}
module.exports = {
  closeDoor,
  openDoor,
	printPerson,
  piezoSong
};