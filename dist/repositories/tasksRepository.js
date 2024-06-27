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
exports.TasksRepository = void 0;
const prisma_1 = require("../database/prisma");
class TasksRepository {
    create({ title, description, completed = false, userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdTask = yield prisma_1.prisma.task.create({
                data: {
                    title,
                    description,
                    completed,
                    userId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            return createdTask;
        });
    }
    findById(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield prisma_1.prisma.task.findUnique({
                where: { id: taskId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            return task;
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasksByUserId = yield prisma_1.prisma.task.findMany({
                where: { userId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            return tasksByUserId;
        });
    }
    update(taskId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTask = yield prisma_1.prisma.task.update({
                where: {
                    id: taskId,
                },
                data,
                include: {
                    user: true,
                },
            });
            return updatedTask;
        });
    }
    delete(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedTask = yield prisma_1.prisma.task.delete({
                where: {
                    id: taskId,
                },
            });
            return deletedTask;
        });
    }
    findByTitleAndUserId(title, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield prisma_1.prisma.task.findFirst({
                where: {
                    title,
                    userId,
                },
            });
            return task;
        });
    }
}
exports.TasksRepository = TasksRepository;
