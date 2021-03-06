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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetUser = exports.validateRegisterUser = exports.updateUserPurchasedProducts = exports.findUserById = exports.findUser = exports.createUser = void 0;
var db_1 = require("../startup/db");
var uniqid_1 = __importDefault(require("uniqid"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var joi_1 = __importDefault(require("joi"));
// Database Queries
var createUser = function (fName, lName, email, password, age, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var salt, hashedPassword, decimalAge, id, sql;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
            case 1:
                salt = _a.sent();
                return [4 /*yield*/, bcryptjs_1.default.hash(password, salt)];
            case 2:
                hashedPassword = _a.sent();
                decimalAge = new Date().getFullYear() - new Date(age).getFullYear();
                id = uniqid_1.default();
                sql = "INSERT INTO USERS \n                    (id, first_name, last_name, email, password, age, purchased_products) \n                    VALUES ($id, $fName, $lName, $email, $password, $age, null)";
                db_1.database.run(sql, [id, fName, lName, email, hashedPassword, decimalAge], function (error) {
                    if (error) {
                        callback(error.message);
                    }
                    var message = 'The user has been created successfully.';
                    callback(message);
                });
                return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
var findUser = function (id, password, callback) {
    var sql = "SELECT * FROM USERS WHERE ID = $id";
    db_1.database.get(sql, [id], function (error, userRow) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (error) {
                        callback(error.message);
                    }
                    return [4 /*yield*/, bcryptjs_1.default.compare(password, userRow.password)];
                case 1:
                    // check passwords
                    if (_a.sent()) {
                        userRow.password = '****';
                        callback(userRow);
                    }
                    else {
                        callback(new Error('Passwords are not match!'));
                    }
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.findUser = findUser;
var findUserById = function (id, callback) {
    var sql = "SELECT * FROM USERS WHERE ID = $id";
    db_1.database.get(sql, [id], function (error, row) {
        if (error) {
            callback(error.message);
        }
        callback(row);
    });
};
exports.findUserById = findUserById;
var updateUserPurchasedProducts = function (user, newPurchasedProducts, callback) {
    var sql = "UPDATE USERS SET Purchased_products=$newPurchasedProducts WHERE ID=$user";
    db_1.database.run(sql, [newPurchasedProducts, user], function (error, row) {
        if (error) {
            callback(error.message);
        }
        callback();
    });
};
exports.updateUserPurchasedProducts = updateUserPurchasedProducts;
// Validations
function validateRegisterUser(user) {
    var schema = joi_1.default.object({
        first_name: joi_1.default.string().required(),
        last_name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(0).required(),
        age: joi_1.default.string().required(),
    });
    return schema.validate(user);
}
exports.validateRegisterUser = validateRegisterUser;
function validateGetUser(userInfo) {
    var schema = joi_1.default.object({
        id: joi_1.default.string().required(),
        password: joi_1.default.string().min(0).required(),
    });
    return schema.validate(userInfo);
}
exports.validateGetUser = validateGetUser;
