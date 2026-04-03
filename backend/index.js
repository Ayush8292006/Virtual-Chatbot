import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

// ✅ Localhost origins (auto detect)
const getLocalhostOrigins = () => {
    return [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8000"
    ];
};

// ✅ .env se frontend URL le (deploy ke baad change kar sakte ho)
const getFrontendUrl = () => {
    return process.env.FRONTEND_URL || "";
};

// ✅ Sab origins combine (localhost + .env wala frontend URL)
const allowedOrigins = [...getLocalhostOrigins()];

// Agar .env mein FRONTEND_URL hai to add karo
const frontendUrl = getFrontendUrl();
if (frontendUrl) {
    allowedOrigins.push(frontendUrl);
}

console.log("✅ CORS Allowed Origins:", allowedOrigins);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin
        if (!origin) {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("❌ Blocked origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Start server
const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (error) {
        console.error("❌ Failed to connect to DB:", error.message);
        process.exit(1);
    }
};

startServer();