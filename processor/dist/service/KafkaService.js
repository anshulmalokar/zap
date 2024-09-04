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
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
class KafkaService {
    constructor() {
        const config = {
            clientId: "my-app",
            brokers: ["localhost:29092"],
        };
        this.kafka = new kafkajs_1.Kafka(config);
        this.kafka_producer = this.kafka.producer();
        this.kafka_consumer = this.kafka.consumer({ groupId: "youtube-uploader" });
    }
    static getInstance() {
        if (!KafkaService._instance) {
            this._instance = new KafkaService();
            return this._instance;
        }
        return this._instance;
    }
    subscribe(topic, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.kafka_consumer.connect();
                yield this.kafka_consumer.subscribe({
                    topic: topic,
                    fromBeginning: true,
                });
                yield this.kafka_consumer.run({
                    eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message, }) {
                        var _b;
                        const value = (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString();
                        callback(value);
                    }),
                });
            }
            catch (error) {
                throw new Error("");
                console.log(error);
            }
        });
    }
    publish(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.kafka_producer.connect();
                this.kafka_producer.send({
                    topic: topic,
                    messages: [message],
                });
                console.log("Message uploaded successfylly:");
                console.log("msg" + message);
                console.log("topic" + topic);
            }
            catch (e) {
                console.log(e);
                throw new Error("");
            }
            finally {
                yield this.kafka_producer.disconnect();
            }
        });
    }
}
exports.default = KafkaService;
