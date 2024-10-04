import express, { Application } from "express";
import cors from "cors";
import passport from "./config/passportConfig";
import cookieParser from "cookie-parser";
import sequelize from "./config/database";
import userRouter from "./routers/userRouter";
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const origins =
  process.env.NODE_ENV === "production" ? [] : ["http://localhost:3000"];

const corsOptions = {
  origin: origins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

(async () => {
  try {
    await sequelize.sync({ force: true });

    app.listen(5010, () => {
      console.log("Server is running on port 5010");
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();

export default app;
