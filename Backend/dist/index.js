"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware to parse JSON
app.use(express_1.default.json());
(0, db_1.default)().then(() => {
    console.log("Database connection established");
});
app.use("/user", user_route_1.default);
app.use("/auth", auth_route_1.default);
// Basic route
app.get("/", (req, res) => {
    res.send("Hello, World! Backend is running");
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} and port ${port}`);
});
