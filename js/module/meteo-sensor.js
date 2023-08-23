function TroykaMeteoSensor(opts) {
  console.log(opts);
  opts = opts || {};
  var _i2c = opts.i2c || PrimaryI2C;
  var _address = opts.address || 0x44;
  var _repeatability = opts.repeatability || 'HIGH';

  this.setRepeatability = function(value) {
    _repeatability = value;
  };

  this.reset = function() {
    _i2c.writeTo(_address, [0x30, 0xa2]);
  };

  this.heaterOn = function() {
    _i2c.writeTo(_address, [0x30, 0x6d]);
  };

  this.heaterOff = function() {
    _i2c.writeTo(_address, [0x30, 0x66]);
  };

  this.read = function(callback) {
    switch (_repeatability) {
      case 'HIGH':
        try {
          _i2c.writeTo(_address, [0x2c, 0x06]);
        } catch (e) {
          callback(new Error('I2C HIGH write error'), undefined);
        }
        break;
      case 'MEDIUM':
        try {
          _i2c.writeTo(_address, [0x2c, 0x0d]);
        } catch (e) {
          callback(new Error('I2C MEDIUM write error'), undefined);
        }
        break;
      case 'LOW':
        try {
          _i2c.writeTo(_address, [0x2c, 0x10]);
        } catch (e) {
          callback(new Error('I2C LOW write error'), undefined);
        }
        break;
      default:
        try {
          _i2c.writeTo(_address, [0x2c, 0x06]);
        } catch (e) {
          callback(new Error('I2C DEFAULT write error'), undefined);
        }
    }

    try {
      var data = _i2c.readFrom(_address, 6);
      if (
        data[2] != _checkCRC8(data, 0, 2) ||
        data[5] != _checkCRC8(data, 3, 5)
      ) {
        callback(new Error('checksum error'), undefined);
      } else {
        var tmpC = ((data[0] * 256.0 + data[1]) * 175.0) / 65535.0 - 45.0;
        var hum = ((data[3] * 256.0 + data[4]) * 100.0) / 65535.0;
        callback(null, {
          temp: tmpC,
          humidity: hum
        });
      }
    } catch (e) {
      callback(new Error('I2C WORST read error', undefined));
    }
  };

  var _checkCRC8 = function(data, num, len) {
    var crc = 0xff;
    // prettier-ignore
    var table = [
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

    for (var i = num; i < len; i++) {
      crc = table[(crc ^ data[i]) % 256];
    }
    return crc;
  };
}

exports.connect = function(opts) {
  return new TroykaMeteoSensor(opts);
};
