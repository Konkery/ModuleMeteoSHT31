/**
 * @class
 * Класс ClassSHT31 р
 */
class ClassSHT31 {
    /**
     * @constructor
     * @param {Object} _Bus   - - объект класса I2C Bus
     * @param {Hex} _address   - - адрес - 0х44 или 0х45
     * @param {string} _repeatability - повторяемость
     */
    constructor() {
        this._name = 'ClassSHT31'; //переопределяем имя типа
		this._sensor = require('ttt').connect({i2c: _Bus, address: _address, repeatabulity: _repeatability});
    }
    /**
     * @method
     * Настривает повторяемость
     * @param {string}  value - повторяемость
     */
    SetRepeatability(value) {
        switch (value) {
            case "HIGH":
                this._sensor.setRepeatability('HIGH'); 
                break;
            case "MEDIUM":
                this._sensor.setRepeatability('MEDIUM'); 
                break;
            default:
                this._sensor.setRepeatability('LOW'); 
                break;
        }
    }
}
	

exports = ClassSHT31;