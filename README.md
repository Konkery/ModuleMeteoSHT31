# ModuleMeteoSHT31
<div style = "font-family: Open sans; font-size: 16px">

Модуль поддерживает работу и реализует базовые функции метеодатчика на базе чипа [SHT31](http://wiki.amperka.ru/_media/%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D1%8B:troyka-meteo-sensor:sht31_datasheet.pdf). Тестирование проводилось на модуле [Amperka](https://amperka.ru/product/troyka-meteo-sensor). Реализованные функции включают в себя чтение температуры и относительной влажности воздуха с датчика. Пример вывода данных представлен в файле index.js. Класс реализован в соответсвии с нотацией архитектуры фреймворка EcoLite.

Модуль состоит из двух классов:
- Базовый класс BaseClassSHT31 обеспечивает работу непосредственно с чипом SHT31 и его битовой таблицей;
- Основной класс ClassSHT31, использующий стэк EcoLite, с которым непосредственно взаимодействует пользователь.

## Конструктор
Конструктор принимает 1 объект типа opts и 1 объект типа sensor_props.
Параметр *_opts* типа **SensorOptsType**:
```js
const _opts = {
    bus: some_i2c_bus,
    address: 0x44,
    repeatability: 'LOW'
    quantityChannel: 2
}
```
- <mark style="background-color: lightblue">bus</mark> - объект класса I2C. Содержится в объекте I2Cbus класса [ClassI2CBus](https://github.com/AlexGlgr/ModuleBaseI2CBus/blob/fork-Alexander/README.md);
- <mark style="background-color: lightblue">address</mark> - адрес датчика на шине;
- <mark style="background-color: lightblue">repeatability</mark> - повторяемость датчика;
- <mark style="background-color: lightblue">quantityChannel</mark> - количество каналов.

Про объекты класса **SensorOptsType** и **SensorPropsType** и как их использовать можно почитать [здесь](https://github.com/Nicktonious/ModuleSensorArchitecture/blob/main/README.md).

## Поля
Класс содержит следующие поля:
- <mark style="background-color: lightblue">_name</mark> - имя класса в строковом виде;
- <mark style="background-color: lightblue">_sensor</mark> - объект базового класса;
- <mark style="background-color: lightblue">_minPeriod</mark> - минимальная частота опроса датчика - 1000 мс;
- <mark style="background-color: lightblue">_usedChannels</mark> - используемые каналы данных по нотации архитектуры фреймворка EcoLite;
- <mark style="background-color: lightblue">_interval</mark> - функция SetInterval для опроса датчика.

## Методы
- <mark style="background-color: lightblue">Init(_sensor_props)</mark> - метод обязывающий провести инициализацию датчика настройкой необходимых для его работы регистров;
- <mark style="background-color: lightblue">Reset()</mark> - метод сбрасывает датчик в состояние по-умолчанию;
- <mark style="background-color: lightblue">Start(_num_channel, _period)</mark> - метод запускает циклический опрос определенного канала датчика с заданной периодичностью в мс. Переданное значение периода сверяется с минимальным значением, хранящимся в поле *_minPeriod*, и, если требуется, регулируется;
- <mark style="background-color: lightblue">ChangeFrequency(_num_channel, _period)</mark> - метод останавливает опрос указанного канала и запускает его вновь с уже новой частотой.
- <mark style="background-color: lightblue">Stop(_num_channel)</mark> - метод прекращает считывание значений с заданного канала.

## Получаемые данные
Датчик предоставляет данные об относительной влажности воздуха в процентах от 0% до 100%, и температуру окружающей среды от 0 до 90 градусов по шкале цельсия. Перевода значений температуры в другую шкалу выполняется по следующим формулам:
- В Кельвины: t + 273.15;
- В Фарегейты: (t * 9/5) + 32;


## Примеры
Пример параметра *_sensor_props* типа **SensorPropsType**: 
```js
const _sensor_props = {
    name: "SHT31",
    type: "sensor",
    channelNames: ['temperature', 'humidity'],
    typeInSignal: "analog",
    typeOutSignal: "digital",
    quantityChannel: 2,
    busType: [ "i2c" ],
    manufacturingData: {
        IDManufacturing: [
            {
                "ModuleSD": "32-016"
            }
        ],
        IDsupplier: [
            {
                "ModuleSD": "32-016"
            }
        ],
        HelpSens: "SHT31 Meteo sensor"
};
```
</div>