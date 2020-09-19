import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import { createServer, Server } from 'http';
import socketIo from 'socket.io';

class App {
  public app: express.Application;
  public server: Server;
  public io: SocketIO.Server;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);

    this.config();
  }

  private config() {
    // this.app.use(helmet());
    this.app.use(cors());
    this.app.use(bodyParser.json());
  }
}

const { app, io, server } = new App();

export { app, io, server };
