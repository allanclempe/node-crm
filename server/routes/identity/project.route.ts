import { Request, Response, Router } from "express";
import { createDiffieHellman } from "crypto";
import { Project, IEnvironment, Environment, User } from "../../core";

export const projectPost = (request: Request, response: Response) => {

    const project = new Project(request.body);
    const diffHell = createDiffieHellman(256);
    const environments: IEnvironment[] = [];
    const envNames = ["dev", "staging", "prod"];

    for (const envName of envNames) {
        const env = Environment.createInstance(envName, project.id);
        environments.push(env);
    }

    project.save((projError, projectResult) => {

        if (!!projError) {
            return response.status(400).json(projError);
        }

        Environment.insertMany(environments, (envError, envResult) => {

            if (!!envError) {
                return response.status(400).json(envError);
            }

            return response.status(200).json({ project: projectResult, environments: envResult });
        });

    });
};

export const projectPut = (request: Request, response: Response) => {

    const id = request.params.id;
    const projectRequest = request.body;

    User.findByIdAndUpdate(id, projectRequest, (error, project) => {

        if (!!error) {
            return response.status(400).json(error);
        }

        return response.status(200).json(project);
    });

};
