import { verify } from "jsonwebtoken";
import { parameters } from "../environment/environment";

const cors = () => {
    return (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Access-Control-Allow-Methods, Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    };
};

export { cors };
