import { Request, Response, Router } from "express";
import { sign } from "jsonwebtoken";

import { IUser, User, Environment } from "../../core";
import { parameters } from "../../environment/environment";
import { CryptoHelper } from "../../core/infrastructure/crypto.helper";

export const userPost = (request: Request, response: Response) => {
    const model: IUser = request.body;
    const cfg = parameters();
    const user = new User(request.body);

    user.save((error, result) => {
        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(result);
    });
};

export const userPut = (request: Request, response: Response) => {

    const id = request.params.id;
    const userRequest = request.body;
    delete request.body.password;

    User.findByIdAndUpdate(id, userRequest, { new: true }, (error, user) => {

        if (!!error) {
            return response.status(400).json(error);
        }

        if (!user) {
            return response.status(400).json({ message: `Entry '${id}' not found` });
        }

        return response.status(200).json(user);
    });
};

export const userLogin = (request: Request, response: Response) => {

    const email = request.body.email;
    const password = request.body.password;
    const key = request.body.public_key;
    const cfg = parameters();

    User.findOne({ email, "permissions.god": true }, (userError, user) => {
        if (!!userError) {
            return response.status(400).json(userError);
        }

        const passwordHash = CryptoHelper.calculateHash(password, cfg.identity.secret);

        if (!user || user.password !== passwordHash) {
            return response.status(401).json({ error: "Unathorized" });
        }

        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        const token = sign(payload, cfg.identity.secret, {
            expiresIn: "1d",
        });

        return response.status(200).json({ token });

    });
};

export const userLoginCrm = (request: Request, response: Response) => {

    const email = request.body.email;
    const password = request.body.password;
    const key = request.body.public_key;
    const cfg = parameters();

    Environment.findOne({ key }, (envError, env) => {

        if (!!envError) {
            return response.status(400).json(envError);
        }

        if (!env) {
            return response.status(400).json({ error: `Environment not found` });
        }

        User.findOne({ email }, (userError, user) => {
            if (!!userError) {
                return response.status(400).json(userError);
            }

            const passwordHash = CryptoHelper.calculateHash(password, cfg.identity.secret);

            if (!user || user.password !== passwordHash) {
                return response.status(401).json({ error: "Unathorized" });
            }

            if (user.permissions.environmentIds.filter((id) => id.toString() === env.id).length === 0) {
                return response.status(401).json({
                    error: `User do not have permissions for '${env.name}' environment`,
                });
            }

            const payload = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                env: env.name,
                projectId: env.projectId,
                allowOrigin: env.allowOrigin,
            };


            const token = sign(payload, cfg.identity.secret, {
                expiresIn: env.tokenExpiresIn,
            });

            return response.status(200).json({ token });
        });

    });
};
