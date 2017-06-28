import { Request, Response, Router } from "express";
import Person from "../core/person";

const publicRouter: Router = Router();

publicRouter.get("/simple", (request: Request, response: Response) => {

  let person = new Person({
      firstName: "Allan",
      lastName: "Clempe",
  });

  person.save((error, person) => {
      response.status(200).json(person);
  });

});

export { publicRouter };
