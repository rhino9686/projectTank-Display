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

    sendMessage(): void {
    }

    getMyAddress(): string {
        let addr: string;
        this.xbee.localCommand({
            // ATMY
            // get my 16 bit address
            command: 'MY'
        }).subscribe(function (response) {
            // response will be an array of two bytes, e.g. [ 23, 167 ]
            addr = response;
        }, function (e) {
            addr = 'no address found!';
        });

        return addr;
    }

}

