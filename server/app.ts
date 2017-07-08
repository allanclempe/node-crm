import { json, urlencoded } from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as path from "path";

import * as dotenv from "dotenv";
import { mongoDbConnection } from "./middleware/mongoDb.middleware";
import { identityRouter } from "./routes/identity";
import { persistenceRouter } from "./routes/persistence";
import { schemaRouter } from "./routes/schema";

dotenv.config();

const app: express.Application = express();
const dbNames = {
  identity: "db-system",
  system: "db-system",
};

app.disable("x-powered-by");

app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

// api routes
app.use("/api/schema", mongoDbConnection(dbNames.system), schemaRouter);
app.use("/api/persistence", mongoDbConnection(dbNames.system), persistenceRouter);
app.use("/api/identity", mongoDbConnection(dbNames.identity), identityRouter);
// app.use("/api/secure", protectedRouter);
// app.use("/api/login", loginRouter);
// app.use("/api/public", publicRouter);
// app.use("/api/feed", feedRouter);
// app.use("/api/user", userRouter);

if (app.get("env") === "production") {

  // in production mode run application from dist folder
  app.use(express.static(path.join(__dirname, "/../client")));
}

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next) => {
  const err = new Error("Not Found");
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message,
  });
});

export { app };
