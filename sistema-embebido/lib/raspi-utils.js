const events = require('./events-emitter');
const status = require('../status');

function printMessege(lcd, messege) {
	lcd.clear();
	lcd.cursor(0, 0);
	lcd.print(messege);
}
function closeDoor(servo) {
	 servo.to(180, 500);
}
function openDoor(servo, led) {
	led.pulse();
	servo.to(0, 5000);
	setTimeout(() => {
		console.log("setTimeout")
		led.off();
		events.emit('door-open');
	}, 500); 
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
  printMessege,
  piezoSong
};
