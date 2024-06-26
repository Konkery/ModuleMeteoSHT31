// Temperature and humidity class

// Registers
REG_REPEAT      = 0x2C;
REG_DATA        = 0x24;
REG_STATUS      = 0x30;

// Values
REP_LOW         = 0x10;
REP_MID         = 0x0D;
REP_HIGH        = 0x06;
SENS_RESET      = 0xA2;
HEAT_ON         = 0x6D;
HEAT_OFF        = 0x66;
POLY            = 0x31;

// Intervals - table 4 of datasheet.pdf
INT_15_MS       = 15;
INT_06_MS       = 6;
INT_04_MS       = 4;

// CRC table
let CRCtable = [
    0, 49, 98, 83, 196, 245, 166, 151, 185, 136, 219, 234, 125, 76, 31, 46,
    67, 114, 33, 16, 135, 182, 229, 212, 250, 203, 152, 169, 62, 15, 92, 109,
    134, 183, 228, 213, 66, 115, 32, 17, 63, 14, 93, 108, 251, 202, 153, 168,
    197, 244, 167, 150, 1, 48, 99, 82, 124, 77, 30, 47, 184, 137, 218, 235,
    61, 12, 95, 110, 249, 200, 155, 170, 132, 181, 230, 215, 64, 113, 34, 19,
    126, 79, 28, 45, 186, 139, 216, 233, 199, 246, 165, 148, 3, 50, 97, 80,
    187, 138, 217, 232, 127, 78, 29, 44, 2, 51, 96, 81, 198, 247, 164, 149,
    248, 201, 154, 171, 60, 13, 94, 111, 65, 112, 35, 18, 133, 180, 231, 214,
    122, 75, 24, 41, 190, 143, 220, 237, 195, 242, 161, 144, 7, 54, 101, 84,
    57, 8, 91, 106, 253, 204, 159, 174, 128, 177, 226, 211, 68, 117, 38, 23,
    252, 205, 158, 175, 56, 9, 90, 107, 69, 116, 39, 22, 129, 176, 227, 210,
    191, 142, 221, 236, 123, 74, 25, 40, 6, 55, 100, 85, 194, 243, 160, 145,
    71, 118, 37, 20, 131, 178, 225, 208, 254, 207, 156, 173, 58, 11, 88, 105,
    4, 53, 102, 87, 192, 241, 162, 147, 189, 140, 223, 238, 121, 72, 27, 42,
    193, 240, 163, 146, 5, 52, 103, 86, 120, 73, 26, 43, 188, 141, 222, 239,
    130, 179, 224, 209, 70, 119, 36, 21, 59, 10, 89, 104, 255, 206, 157, 172
];

// Class initialization
var Termometer = function(bus, addr, rep) {
    this._i2c = bus || I2C1;
    this._address = addr || 0x44;
    this._repeatability = rep || 'HIGH';
    this._repreg = REP_HIGH;
    this._tmout = INT_15_MS;
};

// The method writes data to the reg register
Termometer.prototype.writeI2C = function(reg, data) {
    this._i2c.writeTo(this._address, [reg, data]);
};
  
// The method reads from the reg register the number of bytes count
Termometer.prototype.readI2C = function(reg, count) {
    if (count === undefined) {
        count = 1;
    }
    this._i2c.writeTo(this._address, [reg, 0x80]);
    return this._i2c.readFrom(this._address, count);
};

Termometer.prototype.init = function() {
    this.reset();
    this.setRepeatability(this._repeatability);
};

// Method sets repeatability
Termometer.prototype.setRepeatability = function(value) {
    this._repeatability = value || 'HIGH';
    switch (this._repeatability) {
        case 'LOW':
            this._repreg = REP_LOW;
            this._tmout = INT_04_MS;
            break;
        case 'MEDIUM':
            this._repreg = REP_MED;
            this._tmout = INT_06_MS;
            break;
        case 'HIGH':
        default:
            this._repreg = REP_HIGH;
            this._tmout = INT_15_MS;
            break;
    };
};

// Control for heater
Termometer.prototype.switchHeater = function(swtch) {
    let sw = swtch || false;
    if (sw) {this.writeI2C(REG_STATUS, HEAT_ON);}
    else {this.writeI2C(REG_STATUS, HEAT_OFF);}
};

// Reset sensor
Termometer.prototype.reset = function() {
    this.writeI2C(REG_STATUS, SENS_RESET);
};

// CRC-8 check - page 14 of datasheet.pdf
Termometer.prototype.checkCRC8 = function(data, num, len) {
    let crc = 0xff;
    for (var i = num; i < len; i++) {
        crc = CRCtable[(crc ^ data[i]) % 256];
    }    
    return crc;
}

// Read data
Termometer.prototype.get = function(callback) {
    this._i2c.writeTo(this._address, [REG_REPEAT, this._repreg]);
    setTimeout(() => {        
        let data = this._i2c.readFrom(this._address, 6);
        if (data[2] != this.checkCRC8(data, 0, 2) ||
            data[5] != this.checkCRC8(data, 3, 5)) {
                callback({hum : data[2], temp : data[5]});
            }
        else {
            callback({ hum : (((data[3] * 256.0 + data[4]) * 100.0) / 65535.0),
                       temp : (((data[0] * 256.0 + data[1]) * 175.0) / 65535.0 - 45.0)});
        };
    }, this._tmout);
};

// Exporting the class
exports.connect = function(bus, addr, rep) {
    return new Termometer(bus, addr, rep);
};