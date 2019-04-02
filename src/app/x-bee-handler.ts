import xbeeRx from 'xbee-rx';
import {} from 'electron';
import Fs from 'fs';

export class XBeeHandler {
    xbee;

    constructor(serialPortIn: string) {
        let isElectron: boolean = window && window['process'] && window['process'].type;


        if (isElectron) {
        let fs: typeof Fs = window['require']('fs');
        let app: Electron.App = window['require']('electron').remote;
        console.log(fs, app, window['process']);

        }


        this.xbee = xbeeRx({
            serialport: '/dev/tty.usbserial-AL02BYQV',
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

