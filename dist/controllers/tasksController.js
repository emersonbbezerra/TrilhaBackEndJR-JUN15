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
exports.TasksController = void 0;
const tasksServices_1 = require("../services/tasksServices");
class TasksController {
    constructor() {
        this.tasksServices = new tasksServices_1.TasksServices();
    }
    create(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, completed, userId } = request.body;
            try {
                const authenticatedUserId = request.userId;
                const newTask = yield this.tasksServices.create(authenticatedUserId, {
                    title,
                    description,
                    completed,
                    userId,
                });
                return response.status(201).json(newTask);
            }
            catch (error) {
                next(error);
            }
        });
    }
    findById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { taskId } = request.params;
            try {
                const authenticatedUserId = request.userId;
                const task = yield this.tasksServices.findById(authenticatedUserId, taskId);
                return response.status(200).json(task);
            }
            catch (error) {
                next(error);
            }
        });
    }
    findByUserId(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = request.params;
            const authenticatedUserId = request.userId;
            try {
                const tasks = yield this.tasksServices.findByUserId(authenticatedUserId, userId);
                return response.status(200).json(tasks);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { taskId } = request.params;
            const authenticatedUserId = request.userId;
            const { title, description, completed } = request.body;
            try {
                const updatedTask = yield this.tasksServices.update(authenticatedUserId, taskId, {
                    title,
                    description,
                    completed,
                });
                return response.status(200).json(updatedTask);
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { taskId } = request.params;
            const authenticatedUserId = request.userId;
            try {
                yield this.tasksServices.delete(authenticatedUserId, taskId);
                return response.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TasksController = TasksController;
