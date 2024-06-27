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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const usersServices_1 = require("../services/usersServices");
class UsersController {
    constructor() {
        this.usersServices = new usersServices_1.UsersServices();
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.login = this.login.bind(this);
    }
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = request.body;
            try {
                const newUser = yield this.usersServices.create({
                    name,
                    email,
                    password,
                });
                const { password: omitPassword } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
                return response.status(201).json(userWithoutPassword);
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            try {
                const { token, userId, userName } = yield this.usersServices.login(email, password);
                return response.status(200).json({ token, userId, userName });
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, oldPassword, newPassword } = request.body;
            try {
                const authenticatedUserId = request.userId;
                const { id } = request.params;
                const updatedUser = yield this.usersServices.update(authenticatedUserId, id, {
                    name,
                    email,
                    oldPassword,
                    newPassword,
                });
                const { password: omitPassword } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
                return response.status(200).json(userWithoutPassword);
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authenticatedUserId = request.userId;
            const { id } = request.params;
            try {
                yield this.usersServices.delete(authenticatedUserId, id);
                return response.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UsersController = UsersController;
