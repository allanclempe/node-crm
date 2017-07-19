import { Request, Response, Router } from "express";
import { sign } from "jsonwebtoken";

import { Environment, IEnvironment, Project } from "../../core";
import { parameters } from "../../environment/environment";

export const environmentGet = (request: Request, response: Response) => {

    Environment.find({}).exec((error, envs) => {
        if (!!error) {
            return response.status(400).json(error);
        }
        return response.status(200).json(envs);
    });

};

export const environmentSingle = (request: Request, response: Response) => {
    const id = request.params.id;

    Environment.findById(id).populate("project", "_id name").exec((error, env) => {
        if (!!error) {
            return response.status(400).json(error);
        }
        return response.status(200).json(env);
    });

};



export const environmentLogin = (request: Request, response: Response) => {

    const key = request.body.public_key;
    const cfg = parameters();

    Environment.findOne({ key }).then((env: IEnvironment) => {

        if (env == null) {
            return response.status(401).json({ error: "Unauthorized" });
        }
        const payload = { env: env.name, projectId: env.project, allowOrigin: env.allowOrigin };
        const token = sign(payload, cfg.identity.secret, {
            expiresIn: env.tokenExpiresIn,
        });

        return response.status(200).json({ token });

    });
};


export const environmentPost = (request: Request, response: Response) => {

    const model = request.body;
    const env = Environment.createInstance(model.name, model.projectId);

    env.save((error, result) => {
        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(result);
    });
};

export const environmentPut = (request: Request, response: Response) => {

    const id = request.params.id;
    const model = request.body;

    // TODO: HOW TO CHANGE MONGOOSE TO NOT UPDATE SOME FIELDS?
    Environment.findByIdAndUpdate(id, {
        allowOrigin: model.allowOrigin,
        tokenExpiresIn: model.tokenExpiresIn,
    }, { new: true }, (error, env) => {

        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(env);
    });
};
