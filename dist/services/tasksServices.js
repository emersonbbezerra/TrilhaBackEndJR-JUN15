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
exports.TasksServices = void 0;
const tasksRepository_1 = require("../repositories/tasksRepository");
const errors_1 = require("../utils/errors");
class TasksServices {
    constructor() {
        this.tasksRepository = new tasksRepository_1.TasksRepository();
    }
    create(authenticatedUserId, { title, description, userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!title || !description || !userId) {
                throw new errors_1.BadRequestError("Title, description, and userId are required");
            }
            if (userId !== authenticatedUserId) {
                throw new errors_1.UnauthorizedError("You can only create tasks for your own account");
            }
            const existingTask = yield this.tasksRepository.findByTitleAndUserId(title, userId);
            if (existingTask) {
                throw new errors_1.BadRequestError("Task with the same title already exists for this user");
            }
            const createTask = yield this.tasksRepository.create({
                title,
                description,
                userId,
            });
            return {
                id: createTask.id,
                title: createTask.title,
                description: createTask.description,
                completed: createTask.completed,
                userId: createTask.user.id,
                userName: createTask.user.name,
            };
        });
    }
    findById(authenticatedUserId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.tasksRepository.findById(taskId);
            if (!task) {
                throw new errors_1.NotFoundError("Task not found");
            }
            if (task.userId !== authenticatedUserId) {
                throw new errors_1.UnauthorizedError("You are not authorized to view this task");
            }
            return {
                id: task.id,
                title: task.title,
                description: task.description,
                completed: task.completed,
                userId: task.user.id,
                userName: task.user.name,
            };
        });
    }
    findByUserId(authenticatedUserId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId !== authenticatedUserId) {
                throw new errors_1.UnauthorizedError("You are not authorized to view these tasks");
            }
            const tasks = yield this.tasksRepository.findByUserId(userId);
            if (tasks.length === 0) {
                throw new errors_1.NotFoundError("No tasks found for this user");
            }
            const tasksList = tasks.map((task) => ({
                title: task.title,
                description: task.description,
                completed: task.completed,
                userId: task.userId,
            }));
            return tasksList;
        });
    }
    update(authenticatedUserId, taskId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingTask = yield this.tasksRepository.findById(taskId);
            if (!existingTask) {
                throw new errors_1.NotFoundError("Task not found");
            }
            if (existingTask.userId !== authenticatedUserId) {
                throw new errors_1.UnauthorizedError("You are not authorized to update this task");
            }
            if (data.title) {
                const duplicateTask = yield this.tasksRepository.findByTitleAndUserId(data.title, authenticatedUserId);
                if (duplicateTask && duplicateTask.id !== taskId) {
                    throw new errors_1.BadRequestError("A task with the same title already exists for this user");
                }
            }
            const updatedTask = yield this.tasksRepository.update(taskId, data);
            return {
                id: updatedTask.id,
                title: updatedTask.title,
                description: updatedTask.description,
                completed: updatedTask.completed,
                userId: updatedTask.user.id,
                userName: updatedTask.user.name,
            };
        });
    }
    delete(authenticatedUserId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingTask = yield this.tasksRepository.findById(taskId);
            if (!existingTask) {
                throw new errors_1.NotFoundError("Task not found");
            }
            if (existingTask.userId !== authenticatedUserId) {
                throw new errors_1.UnauthorizedError("You are not authorized to delete this task");
            }
            yield this.tasksRepository.delete(taskId);
        });
    }
}
exports.TasksServices = TasksServices;
