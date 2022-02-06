import express from 'express';

export default class Server {

    public app: express.Application;

    constructor(private port:number) {
        this.app = express();
    }

    start( callback: () => void ) {
        this.app.listen( this.port, callback );
    }

}