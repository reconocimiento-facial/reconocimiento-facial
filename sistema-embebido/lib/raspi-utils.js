const events = require('./events-emitter');
const status = require('../status');

function printMessege(lcd, messege) {
    	lcd.clear();
    	lcd.cursor(0, 1);
	lcd.print(messege);
    	lcd.cursor(1, 1);
	lcd.print('quiere entrar');
}
function closeDoor(servo) {
	 servo.to(180, 1000);
	setTimeout(() => {
		status.doorOpen = false;
		events.emit('door-close');
	}, 1000); 
}
function openDoor(servo, led) {
	if (status.doorOpen) {
		return;	
	}
	status.doorOpen = true;
	led.pulse();
	servo.to(0, 5000);
	setTimeout(() => {
		led.stop();
		led.off();
		closeDoor(servo);
		events.emit('door-open');
	}, 5000); 
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
