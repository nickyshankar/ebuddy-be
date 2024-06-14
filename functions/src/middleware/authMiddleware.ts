import { Request, Response, NextFunction } from 'express';
// import ApiError from '../entities/ApiError';
// import * as jwt from 'jsonwebtoken';
import { FirebaseError, auth } from 'firebase-admin';
import ApiError from '../entities/ApiError';

const isFirebaseError = (error: unknown): error is FirebaseError => {
    return (error as FirebaseError).code !== undefined;
};


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token)
        if (!token) {
            return next(ApiError.unauthorized('No token provided'));
        }
        if (token) {
            const validate = await auth().verifyIdToken(token);
            console.log('-----', validate)
            next();
        }
    } catch (error) {
        console.log(error)
        if (isFirebaseError(error) && error.code === 'auth/argument-error') {
            next(ApiError.unauthorized(error.message));
        } else if (isFirebaseError(error) && error.code === 'auth/id-token-expired') {
            next(ApiError.unauthorized(error.message));
        } else {
            next(ApiError.internal('An unknown error occurred'));
        }
    }
};

export default authMiddleware;