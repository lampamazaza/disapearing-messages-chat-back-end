import { IWebSocketService } from "./webSocket.interface";
import "reflect-metadata";
import { Server as SocketServer } from "socket.io";
import { Server } from "http";
import { IConfigService } from "../../config/config.service.interface";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { verify } from "jsonwebtoken";
import getToken from "../../utils/getToken";

@injectable()
export class WebSocketService implements IWebSocketService {
  io: SocketServer;
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {}
  init(app: Server) {
    const PRIVATE_KEY_QUERY_PARAM_NAME = "pk";
    let config = {};
    if (this.configService.get("CORS_DEV_ALLOW")) {
      config = {
        cors: {
          origin: this.configService.get("CORS_DEV_ALLOW"),
          methods: ["GET", "POST"],
          allowedHeaders: ["*"],
          credentials: true,
        },
      };
    }
    this.io = new SocketServer(app, config);

    this.io.use((socket, next) => {
      const token = getToken(socket.handshake.headers.cookie);
      verify(token, this.configService.get("SECRET"), (err, payload) => {
        if (err || !payload) {
          next(new Error("Non valid Token"));
        }

        if (
          socket.handshake.query[PRIVATE_KEY_QUERY_PARAM_NAME] ===
          payload.publicKey
        ) {
          next();
        } else {
          next(new Error("Non valid Token"));
        }
      });
    });

    this.io.on("connection", (socket) => {
      socket.on("subscribe", function (publicKey: string) {
        socket.join(publicKey);
      });
    });
  }

  publishPrivateMessage(to, message) {
    this.io.to(to).emit("update", message);
  }
}
