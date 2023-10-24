const ClassI2CBus = require("https://raw.githubusercontent.com/AlexGlgr/ModuleBaseI2CBus/fork-Alexander/js/module/ClassBaseI2CBus.min.js");
const err = require('https://raw.githubusercontent.com/Konkery/ModuleAppError/main/js/module/ModuleAppError.min.js');
const NumIs = require('https://raw.githubusercontent.com/Konkery/ModuleAppMath/main/js/module/ModuleAppMath.min.js');
     NumIs.is(); //добавить функцию проверки целочисленных чисел в Number

const Sht = require("https://raw.githubusercontent.com/AlexGlgr/ModuleMeteoSHT31/fork-Alexander/js/module/ClassSHT31.min.js");

let I2Cbus = new ClassI2CBus();
let bus = I2Cbus.AddBus({sda: P5, scl: P4, bitrate: 100000}).IDbus;

let opts = {_Bus: bus, _Address: 0x44, _Repeatability: 'LOW'};
let sensor_props = {
    _Name: "SHT31",
    _Type: "sensor",
    _ChannelNames: ['temperature', 'humidity'],
    _TypeInSignal: "analog",
    _TypeOutSignal: "digital",
    // this._NumMinPortsRequired = 2; //TODO: обдумать
    _QuantityChannel: 2,
    _BusType: [ "i2c" ],
    _ManufacturingData: {
        IDManufacturing: [
            {
                "Amperka": "AMP-B072"
            }
        ],
        IDsupplier: [
            {
                "Amperka": "AMP-B072"
            }
        ],
        HelpSens: "SHT31 Meteo sensor"
    }
};
let meteo = new Sht(opts);

meteo.GetData();