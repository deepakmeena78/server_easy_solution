import jwt from "jsonwebtoken";

export class Token {
    tokenGanrate(tokenObj) {
        let token = jwt.sign(tokenObj, process.env.JWT_SECRET_KEY || 'easysolution123');
        return token; 
    }

    verifyToken(token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY)
        return true
    }
}
