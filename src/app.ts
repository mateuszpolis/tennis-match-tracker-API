import express, { Application } from "express";
import sequelize from "./config/database";
import cors from "cors";
import passport from "./config/passportConfig";
import cookieParser from "cookie-parser";
import "./models/associations";
import MailService from "./services/mailService";
import AuthService from "./services/authService";
import AuthRouter from "./routers/authRouter";
import GroundService from "./services/groundService";
import GroundRouter from "./routers/groundRouter";
import MatchRouter from "./routers/matchRouter";
import MatchService from "./services/matchService";
import TournamentService from "./services/tournamentService";
import TournamentRouter from "./routers/tournamentRouter";
import UserRouter from "./routers/userRouter";
import UserService from "./services/userService";

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

const mailService = new MailService();
const authService = new AuthService();
const groundService = new GroundService();
const matchService = new MatchService();
const tournamentService = new TournamentService(matchService);
const userService = new UserService();

const authRouter = new AuthRouter(mailService, authService).router;
const groundRouter = new GroundRouter(groundService, authService).router;
const matchRouter = new MatchRouter(
  authService,
  matchService,
  tournamentService
).router;
const tournamentRouter = new TournamentRouter(
  tournamentService,
  authService,
  groundService
).router;
const userRouter = new UserRouter(authService, userService).router;

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tournaments", tournamentRouter);
app.use("/api/grounds", groundRouter);
app.use("/api/matches", matchRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

(async () => {
  try {  
    app.listen(5010, () => {
      console.log("Server is running on port 5010");
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();

export default app;
