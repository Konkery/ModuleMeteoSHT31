/**
 * @class
 * Класс ClassSHT31 реализует работу датчика на базе чипа SHT31 для измерения температуры и относительной
 * влажности воздуха. Класс наследован от ClassSensor и использует его нотацию. В качестве опций класс принимает 
 * I2C-шину. Минимальный период опроса - 1000 милисекунд.
 */
class ClassSHT31 extends ClassSensor {
    /**
     * @constructor
     * @param {Object} _opts   - Объект с параметрами по нотации ClassSensor
     */
    constructor(_opts, _sensor_props) {
        ClassSensor.apply(this, [_opts, _sensor_props]);
        this._Name = 'ClassSHT31'; //переопределяем имя типа
		this._Sensor = require("BaseClassSHT31.min.js").connect(_opts.bus, _opts.address, _opts.repeatability);
        this._MinPeriod = 250;
        this._UsedChannels = [];
        this._Interval;
    }
    /**
     * @method
     * Инициализирует датчик
     */
    Init(_sensor_props) {
        super.Init(_sensor_props);
        this._Sensor.init();
    }
    /**
     * @method
     * Сбрасывает датчик в изначальное состояние
     * @returns {string}  - подтверждение, что датчик сброшен
     */
    Reset() {
        this._Sensor.reset();

        return "Sensor reset";
    }
    /**
     * @method
     * Получает данные о температуре и влажности с датчика
     * @returns {Object}  - объект, поля которого содержат температуру и влажность
     */
    GetData() {
        this._Sensor.get(function(d) {
            console.log('Temperature:', d.temp);
            console.log('Humidity:', d.hum);
          });
    }

    /**
     * @method
     * Запускает сбор данных с датчика и передачи их в каналы
     * @param {Number} _period          - частота опроса (минимум 1000 мс)
     * @param {Number} _num_channel     - номер канала
     */
    Start(_num_channel, _period) {
        let period = (typeof _period === 'number' & _period >= this._MinPeriod) ? _period    //частота сверяется с минимальной
                 : this._MinPeriod;

        if (!this._UsedChannels.includes(_num_channel)) this._UsedChannels.push(_num_channel); //номер канала попадает в список опрашиваемых каналов. Если интервал уже запущен с таким же периодои, то даже нет нужды его перезапускать 
        if (!this._Interval) {          //если в данный момент не ведется ни одного опроса
            this._Interval = setInterval(() => {
                this._Sensor.get((d) => {
                    if (this._UsedChannels.includes(0)) this.Ch0_Value = d.temp;
                    if (this._UsedChannels.includes(1)) this.Ch1_Value = d.hum;
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
    ChangeFreq(_num_channel, freq) {
        clearInterval(this._Interval);
        setTimeout(() => this.Start(freq), this._Minfrequency);
    }

    /**
     * @methhod
     * Останавливает сбор данных с датчика
     * @param {*} _num_channel   - номер канала, в который должен быть остановлен поток данных
     */
    Stop(_num_channel) {
        if (_num_channel) this._UsedChannels.splice(this._UsedChannels.indexOf(_num_channel));
        else {
            this._UsedChannels = [];
            clearInterval(this._Interval);
            this._Interval = null;
        }
    }
}
	

exports = ClassSHT31;