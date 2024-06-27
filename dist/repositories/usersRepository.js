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
exports.UsersRepository = void 0;
const prisma_1 = require("../database/prisma");
class UsersRepository {
    create({ name, email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma_1.prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                },
            });
            return result;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma_1.prisma.user.findUnique({
                where: {
                    id,
                },
            });
            return result;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma_1.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            return result;
        });
    }
    update(id, name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma_1.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    name,
                    email,
                },
            });
            return result;
        });
    }
    updatePassword(newPassword, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma_1.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    password: newPassword,
                },
            });
            return result;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.task.deleteMany({
                where: {
                    userId: id,
                },
            });
            const result = yield prisma_1.prisma.user.delete({
                where: {
                    id,
                },
            });
            return result;
        });
    }
}
exports.UsersRepository = UsersRepository;
