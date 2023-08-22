const ClassMiddleSensor = require("https://raw.githubusercontent.com/Nicktonious/ModuleSensorArchitecture/main/js/module/ClassSensorArchitecture.min.js");
const I2C = require("https://raw.githubusercontent.com/AlexGlgr/ModuleBaseI2CBus/fork-Alexander/js/module/ClassBaseI2CBus.min.js");
/**
 * @class
 * Класс ClassSHT31 р
 */
class ClassSHT31 extends ClassMiddleSensor {
    /**
     * @constructor
     * @param {Object} _opts   - Объект с параметрами по нотации ClassMiddleSensor
     */
    constructor(_opts) {
        ClassMiddleSensor.apply(this, [_opts]);
        this._name = 'ClassSHT31'; //переопределяем имя типа
		this._sensor = require('https://raw.githubusercontent.com/AlexGlgr/ModuleMeteoSHT31/fork-Alexander/js/module/BaseClassSHT31.min.js').connectI2C((new I2C).AddBus({sda: _opts._Pins[0], scl: _opts._Pins[1], bitrate: 100000}).IDBus);
        this._minPeriod = 1000;
        this._usedChannels = [];
        this._interval;
    }
    Init(_sensor_props) {
        super.Init(_sensor_props);
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
    /**
     * @method
     * Получает данные о температуре и влажности с датчика
     * @returns {Object}  - объект, поля которого содержат температуру и влажность
     */
    GetData() {
        this._sensor.read(function(d) {
            console.log('Temperature:', d.temp);
            console.log('Humidity:', d.humidity);
          });
          return d;
    }

    Start(_period, _num_channel) {
        //this._interval = setInterval(() => this.GetData(), freq);
        let period = (typeof _period === 'number' & _period >= this._minPeriod) ? _period    //частота сверяется с минимальной
                 : this._minPeriod;

        if (!this._usedChannels.includes(_num_channel)) this._usedChannels.push(_num_channel); //номер канала попадает в список опрашиваемых каналов. Если интервал уже запущен с таким же периодои, то даже нет нужды его перезапускать 
        if (!this._interval) {          //если в данный момент не ведется ни одного опроса
            this._interval = setInterval(() => {
            this._sensor.read(d => {
                if (this._usedChannels.includes(0)) this.Ch0_Value = d.temp;
                if (this._usedChannels.includes(1)) this.Ch1_Value = d.humidity;
            });
            }, period);
        }     
        this._currentPeriod = period;
    }

    ChangeFrequency(freq) {
        clearInterval(this._interval);
        setTimeout(() => this.Start(freq), this._minfrequency);
    }

    Stop(_num_channel) {
        if (_num_channel) this._usedChannels.splice(this._usedChannels.indexOf(_num_channel));
        else {
            this._usedChannels = [];
            clearInterval(this._interval);
            this._interval = null;
        }
    }
}
	

exports = ClassSHT31;