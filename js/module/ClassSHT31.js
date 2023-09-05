const ClassMiddleSensor = require("https://raw.githubusercontent.com/Nicktonious/ModuleSensorArchitecture/main/js/module/ClassSensorArchitecture.min.js");
/**
 * @class
 * Класс ClassSHT31 реализует работу датчика на базе чипа SHT31 для измерения температуры и относительной
 * влажности воздуха. Класс наследован от ClassMiddleSensor и использует его нотацию. В качестве опций класс принимает 
 * I2C-шину. Минимальный период опроса - 1000 милисекунд.
 */
class ClassSHT31 extends ClassMiddleSensor {
    /**
     * @constructor
     * @param {Object} _opts   - Объект с параметрами по нотации ClassMiddleSensor
     */
    constructor(_opts, _sensor_props) {
        ClassMiddleSensor.apply(this, [_opts, _sensor_props]);
        this._name = 'ClassSHT31'; //переопределяем имя типа
		this._sensor = require('https://raw.githubusercontent.com/AlexGlgr/ModuleMeteoSHT31/fork-Alexander/js/module/meteo-sensor.min.js').connect({i2c: _opts.bus, address: _opts.address, repeatability: _opts.repeatability});
        this._minPeriod = 1000;
        this._usedChannels = [];
        this._interval;
    }
    /**
     * @method
     * Инициализирует датчик
     */
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
        this._sensor.read(function(err, d) {
            if (err) {
                console.log("Error " + err.message);
            }
            console.log('Temperature:', d.temp);
            console.log('Humidity:', d.humidity);
          });
    }

    /**
     * @method
     * Запускает сбор данных с датчика и передачи их в каналы
     * @param {Number} _period          - частота опроса (минимум 1000 мс)
     * @param {Number} _num_channel     - номер канала
     */
    Start(_period, _num_channel) {
        let period = (typeof _period === 'number' & _period >= this._minPeriod) ? _period    //частота сверяется с минимальной
                 : this._minPeriod;

        if (!this._usedChannels.includes(_num_channel)) this._usedChannels.push(_num_channel); //номер канала попадает в список опрашиваемых каналов. Если интервал уже запущен с таким же периодои, то даже нет нужды его перезапускать 
        if (!this._interval) {          //если в данный момент не ведется ни одного опроса
            this._interval = setInterval(() => {
            this._sensor.read((err,d) => {
                if (err) comsole.log (err.message);
                if (this._usedChannels.includes(0)) this.Ch0_Value = d.temp;
                if (this._usedChannels.includes(1)) this.Ch1_Value = d.humidity;
            });
            }, period);
        }     
        this._currentPeriod = period;
    }

    /**
     * @method
     * Меняет частоту опроса датчика
     * @param {Number} freq     - новая частота опроса (минимум 1000 мс)
     */
    ChangeFrequency(freq) {
        clearInterval(this._interval);
        setTimeout(() => this.Start(freq), this._minfrequency);
    }

    /**
     * @methhod
     * Останавливает сбор данных с датчика
     * @param {*} _num_channel   - номер канала, в который должен быть остановлен поток данных
     */
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