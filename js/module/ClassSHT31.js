/**
 * @class
 * Класс ClassSHT31 р
 */
class ClassSHT31 {
    /**
     * @constructor
     * @param {Object} _bus   - объект класса I2C Bus
     * @param {Hex} _address  - адрес - 0х44 или 0х45
     * @param {string} _rep   - повторяемость (repeatability)
     */
    constructor(_Bus, _address, _rep) {
        this._name = 'ClassSHT31'; //переопределяем имя типа
		this._sensor = require('https://raw.githubusercontent.com/AlexGlgr/ModuleMeteoSHT31/fork-Alexander/js/module/meteo-sensor.min.js').connect({i2c: _Bus, address: _address, repeatabulity: _rep});
        this._heaterOn = false;
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
    /**
     * @method
     * Включает/выключает нагреватель
     * @returns {boolean}  - нагреватель включен или выключен
     */
    SwitchHeater() {
        if (this._heaterOn) {
            this._sensor.heaterOff();
            this._heaterOn = false;
        }
        else {
            this._sensor.heaterOn();
            this._heaterOn = true;
        }

        return this._heaterOn;
    }
    /**
     * @method
     * Сбрасывает датчик
     * @returns {string}  - подтверждение, что датчик сброшен
     */
    Reset() {
        this._sensor.reset();

        return "Sensor reset";
    }

    /*
    meteoSensor.read(function(err, data) {
    if (err) {
        print(err);
    } else {
        print("Temp is: "+data.tempC+" C," + "Temp is: "+data.tempF+" F,"+
        "Temp is: "+data.tempK+" K,"+"Hum is: "+data.humidity+" %");
    }
    });
    */
}
	

exports = ClassSHT31;