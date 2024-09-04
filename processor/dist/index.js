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
const db_1 = __importDefault(require("./db"));
const KafkaService_1 = __importDefault(require("./service/KafkaService"));
const TOPIC_NAME = "ZAP_PUBLISH";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting the Processor");
        while (1) {
            const all_data = yield db_1.default.zapRunOutBox.findMany({});
            yield Promise.all(all_data.map(data => {
                const message = {
                    value: data.zapRunId
                };
                KafkaService_1.default.getInstance().publish(TOPIC_NAME, message);
            }));
            yield Promise.all(all_data.map((data) => __awaiter(this, void 0, void 0, function* () {
                yield db_1.default.zapRunOutBox.delete({
                    where: {
                        id: data.id,
                    }
                });
            })));
        }
    });
}
main();
