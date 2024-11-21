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
const app_1 = __importDefault(require("./app"));
const configs_1 = __importDefault(require("./app/configs"));
const bootStrap = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to DB
        yield configs_1.default.connectDB();
        // Listen to the Server
        app_1.default.listen(configs_1.default.port, () => {
            console.log('🟢 Server is Listening on Port: ', configs_1.default.port);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('🚫 Error Occurred: ', error.message);
        }
        else {
            console.error('🛑 Unknown Error Occurred!');
        }
    }
});
bootStrap().catch(console.dir);
