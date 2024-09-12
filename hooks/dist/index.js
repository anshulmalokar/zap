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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
    return res.status(200).json({
        message: "Hello World"
    });
});
app.post("/hooks/catch/:userId/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const metaData = JSON.stringify(req.body);
    try {
        yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const zap_run = yield tx.zapRun.create({
                data: {
                    zapId: zapId,
                    metaData: JSON.parse(metaData)
                }
            });
            yield tx.zapRunOutBox.create({
                data: {
                    zapRunId: zap_run.id
                }
            });
        }));
        return res.status(200).json({
            message: "Request Successful"
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Request Failed"
        });
    }
}));
app.listen(PORT, () => {
    console.log(`The process started at the PORT ${PORT}`);
});
