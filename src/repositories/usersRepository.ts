import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma";
import { User } from "../models/userModel";

class UsersRepository {
  async create({ name, email, password }: User) {
    try {
      const result = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      return result;
    } catch (error: any) {
      throw new Error(
        `Failed to create user: ${
          (error as Prisma.PrismaClientKnownRequestError).message
        }`
      );
    }
  }

  async findById(id: string) {
    try {
      const result = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      return result;
    } catch (error: any) {
      throw new Error(
        `Failed to find user by id ${id}: ${
          (error as Prisma.PrismaClientKnownRequestError).message
        }`
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const result = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return result;
    } catch (error: any) {
      throw new Error(
        `Failed to find user by email ${email}: ${
          (error as Prisma.PrismaClientKnownRequestError).message
        }`
      );
    }
  }

  async update(id: string, name: string, email: string) {
    try {
      const result = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
        },
      });
      return result;
    } catch (error: any) {
      throw new Error(
        `Failed to update user ${id}: ${
          (error as Prisma.PrismaClientKnownRequestError).message
        }`
      );
    }
  }

  async updatePassword(newPassword: string, id: string) {
    try {
      const result = await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: newPassword,
        },
      });
      return result;
    } catch (error: any) {
      throw new Error(
        `Failed to update password for user ${id}: ${
          (error as Prisma.PrismaClientKnownRequestError).message
        }`
      );
    }
  }

  async delete(id: string) {
    try {
      await prisma.task.deleteMany({
        where: {
          userId: id,
        },
      });

      const result = await prisma.user.delete({
        where: {
          id,
        },
      });

      return result;
    } catch (error: any) {
      throw new Error(`Failed to delete user ${id}: ${error.message}`);
    }
  }
}

export { UsersRepository };
