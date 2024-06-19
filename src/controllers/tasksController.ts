import { NextFunction, Request, Response } from "express";
import { TasksServices } from "../services/tasksServices";

class TasksController {
  private tasksServices: TasksServices;

  constructor() {
    this.tasksServices = new TasksServices();
    this.create = this.create.bind(this);
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { title, description, completed, userId } = request.body;

    try {
      const result = await this.tasksServices.create({
        title,
        description,
        completed,
        userId,
      });
      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export { TasksController };
