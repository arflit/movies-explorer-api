"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var helmet_1 = __importDefault(require("helmet"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var index_1 = require("./routes/index");
require('dotenv').config();
/* import cors from 'cors';

const corsWhiteList = ['http://kino.flitman.ru', 'https://kino.flitman.ru'];

const corsOptions = {
  origin: (origin, callback) => {
    if (corsWhiteList.indexOf(origin) !== -1) {
      callback(null, true);
    }
  },
  credentials: true,
};
 */
var _a = process.env.PORT, PORT = _a === void 0 ? 3000 : _a;
var app = express_1.default();
var limiter = express_rate_limit_1.default({
    windowMs: 15 * 60 * 1000,
    max: 100, // можно совершить максимум 100 запросов с одного IP
});
app.use(limiter);
mongoose_1.default.connect('mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
});
app.use(body_parser_1.default.json());
app.use(cookie_parser_1.default());
app.use(helmet_1.default());
// app.use(cors(corsOptions));
app.use('/', index_1.router);
app.listen(PORT);
