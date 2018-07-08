const events = require('./events-emitter');
const status = require('../status');

function piezoSong(piezo) {
  piezo.play({
    song: [
      ['C4', 1 / 4],
      ['D4', 1 / 4],
      ['F4', 1 / 4],
      ['D4', 1 / 4],
      ['G4', 1 / 4],
      [null, 1 / 4],
      ['A4', 1],
      ['G4', 1],
      [null, 1 / 2],
      ['C4', 1 / 4],
      ['D4', 1 / 4],
      ['F4', 1 / 4],
      ['D4', 1 / 4],
      ['G4', 1 / 4],
      [null, 1 / 4],
      ['G4', 1],
      ['F4', 1],
      [null, 1 / 2]
    ],
    tempo: 100
  });
}
function printMessege(lcd, messege, optionalText) {
  lcd.clear();
  lcd.cursor(0, 1);
	lcd.print(messege);
	if(optionalText) {
    lcd.cursor(1, 1);
		lcd.print(optionalText);
	}
  console.log(messege, optionalText || '');
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

module.exports = {
  closeDoor,
  openDoor,
  printMessege,
  piezoSong
};
