const xbeeRx = require('xbee-rx');

export class XBeeHandler {
    xbee;

    constructor(serialPortIn: string) {
        this.xbee = xbeeRx({
            serialport: serialPortIn,
            serialPortOptions: {
                baudRate: 57600
            },
            module: 'ZigBee'
        });
    }
}

