import config from '../../config/index.ts';
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

const JWT = config.jwt;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(401).json({
            status: 'error',
            message: 'Unauthorized',
        });
        return;
    }

    jwt.verify(token, JWT as string, (err: any, decoded: any) => {
        if (err) {
            res.status(401).json({
                status: 'error',
                message: 'Unauthorized',
            });
            return;
        }

        next();
    });

};



export default authMiddleware;
