"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UsersServices = void 0;
const bcrypt = __importStar(require("bcrypt"));
const usersRepository_1 = require("../repositories/usersRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
class UsersServices {
    constructor() {
        this.usersRepository = new usersRepository_1.UsersRepository();
    }
    create({ name, email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name || !email || !password) {
                throw new errors_1.BadRequestError("Name, email, and password are required");
            }
            if (!this.isValidEmail(email)) {
                throw new errors_1.BadRequestError("Invalid email");
            }
            if (yield this.usersRepository.findByEmail(email)) {
                throw new errors_1.BadRequestError("User with this email already exists");
            }
            if (!this.isValidPassword(password)) {
                throw new errors_1.BadRequestError("Invalid password. Minimum 8 characters with 1 uppercase letter, 1 lowercase letter and 1 special character");
            }
            const hashPassword = yield bcrypt.hash(password, 10);
            const createUser = yield this.usersRepository.create({
                name,
                email,
                password: hashPassword,
            });
            return createUser;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidEmail(email) || !this.isValidPassword(password)) {
                throw new errors_1.BadRequestError("Invalid email or password");
            }
            const user = yield this.usersRepository.findByEmail(email);
            if (!user) {
                throw new errors_1.UnauthorizedError("Invalid email or password");
            }
            const userId = user.id;
            const userName = user.name;
            const passwordMatch = yield bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new errors_1.UnauthorizedError("Invalid email or password");
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.ACCESS_KEY_TOKEN, {
                expiresIn: "1h",
            });
            return { token, userId, userName };
        });
    }
    update(authenticatedUserId, id, { name, email, oldPassword, newPassword }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToUpdate = yield this.usersRepository.findById(id);
            if (!userToUpdate) {
                throw new errors_1.NotFoundError("User not found");
            }
            if (authenticatedUserId !== id) {
                throw new errors_1.UnauthorizedError("Unauthorized");
            }
            if (email && !this.isValidEmail(email)) {
                throw new errors_1.BadRequestError("Invalid email");
            }
            if (name === undefined || name === "") {
                throw new errors_1.BadRequestError("Name cannot be empty");
            }
            const isUpdatingPassword = oldPassword !== undefined || newPassword !== undefined;
            if (isUpdatingPassword) {
                if (oldPassword === undefined || oldPassword === "") {
                    throw new errors_1.BadRequestError("Old password is required to update password");
                }
                if (newPassword === undefined || newPassword === "") {
                    throw new errors_1.BadRequestError("New password is required to update password");
                }
                if (!(yield bcrypt.compare(oldPassword, userToUpdate.password))) {
                    throw new errors_1.UnauthorizedError("Invalid password");
                }
                if (!this.isValidPassword(newPassword)) {
                    throw new errors_1.BadRequestError("Invalid new password. Minimum 8 characters with 1 uppercase letter, 1 lowercase letter and 1 special character");
                }
                const hashPassword = yield bcrypt.hash(newPassword, 10);
                yield this.usersRepository.updatePassword(hashPassword, id);
            }
            const updatedUser = yield this.usersRepository.update(id, name, email);
            return updatedUser;
        });
    }
    delete(authenticatedUserId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToDelete = yield this.usersRepository.findById(id);
            if (!userToDelete) {
                throw new errors_1.NotFoundError("User not found");
            }
            if (authenticatedUserId !== id) {
                throw new errors_1.BadRequestError("Unauthorized");
            }
            yield this.usersRepository.delete(id);
        });
    }
    isValidEmail(email) {
        const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailTest.test(email);
    }
    isValidPassword(password) {
        const passwordTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        return passwordTest.test(password);
    }
}
exports.UsersServices = UsersServices;
