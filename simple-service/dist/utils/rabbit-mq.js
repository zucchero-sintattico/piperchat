"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQ {
    static initialize(connectionUri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RabbitMQ.instance) {
                RabbitMQ.instance = new RabbitMQ(connectionUri);
                yield RabbitMQ.instance.connect();
            }
        });
    }
    static getInstance() {
        if (!RabbitMQ.instance) {
            throw new Error("RabbitMQ not initialized");
        }
        return RabbitMQ.instance;
    }
    constructor(connectionUri) {
        this.connectionUri = connectionUri;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield amqplib_1.default.connect(this.connectionUri);
                this.channel = yield this.connection.createChannel();
                console.log("Connected to RabbitMQ");
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    getChannel() {
        return this.channel;
    }
}
exports.RabbitMQ = RabbitMQ;
