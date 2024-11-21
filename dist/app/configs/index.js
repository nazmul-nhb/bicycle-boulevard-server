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
exports.connectDB = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const mongoUri = process.env.MONGO_URI;
/**
 * Connect to MongoDB using Mongoose
 */
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Throw error if there is no connection string
        if (!mongoUri) {
            throw new Error('MongoDB URI is Not Defined!');
        }
        yield mongoose_1.default.connect(mongoUri);
        console.log('🟢 MongoDB is Connected!');
        // Listen for established connection
        mongoose_1.default.connection.on('connected', () => {
            console.log('🟢 MongoDB is Connected!');
        });
        // Listen for connection errors
        mongoose_1.default.connection.on('error', (err) => {
            console.error('🛑 MongoDB Connection Error: ', err.message);
        });
        // Optional: Listen for disconnection
        mongoose_1.default.connection.on('disconnected', () => {
            console.error('🔴 MongoDB is Disconnected!');
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('🚫 MongoDB Error: ', error.message);
        }
        else {
            console.error('🛑 Unknown Error Occurred!');
        }
    }
});
exports.connectDB = connectDB;
exports.default = {
    port: process.env.PORT || 4242,
    connectDB: exports.connectDB,
};
