import { NextFunction, Request, Response, Router } from "express";
import { verify } from "jsonwebtoken";
import * as mongoose from "mongoose";
import { parameters } from "../environment/environment";

export const mongoDbConnection = (dbName: string, useEnvironment: boolean) => {

    (<any>mongoose).Promise = global.Promise;

    return (request: Request, response: Response, next: NextFunction) => {

        if (request.method === "OPTIONS") {
            return next();
        }

        const openConnection = (host: string, name: string, debug: boolean) => {
            mongoose.set("debug", debug);
            response.on("finish", () => {
                mongoose.connection.close();
                if (!!response.locals.conn) {
                    response.locals.conn.close();
                }
            });

            if (useEnvironment) {
                const conn = mongoose.createConnection(`mongodb://${host}/${name}`);
                response.locals.conn = conn;
                next();
                return;
            }

            mongoose.connect(`mongodb://${host}/${name}`, {
                // useMongoClient: true  @types/mongoose is not up to date.
            }, (error) => {
                if (error) {
                    return response.status(400).json(error);
                }
                next();
            });

        };

        const cfg = parameters();
        let token = request.headers.authorization;
        let name = dbName;

        if (!!token && token.startsWith("Bearer ")) {
            token = token.replace("Bearer ", "");
        }

        if (useEnvironment) {
            verify(token, cfg.identity.secret, (tokenError, decodedToken) => {
                if (!!tokenError) {
                    return response.status(403).json({ message: "Unauthorized, Invalid token" });
                }
                console.log(decodedToken);

                openConnection(cfg.mongoDb.host,
                    `${name}-${decodedToken.projectId}-${decodedToken.env}`,
                    cfg.mongoDb.debug);
            });
            return;
        }

        openConnection(cfg.mongoDb.host, name, cfg.mongoDb.debug);

    };
};
