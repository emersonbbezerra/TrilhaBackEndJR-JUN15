"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthMiddleware {
    auth(request, response, next) {
        var _a;
        const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            return response
                .status(401)
                .json({ error: "Unauthorized: Missing token" });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_KEY_TOKEN);
            if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
                request.userId = decoded.id;
                next();
            }
            else {
                throw new Error("Invalid token");
            }
        }
        catch (error) {
            return response
                .status(401)
                .json({ error: "Unauthorized: Invalid token" });
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
