import { Request, Response, NextFunction } from 'express';
import { addNewUser, getUserDetail, userList, updateUserDetails } from '../repository/userCollection';
import ApiError from '../entities/ApiError';
import * as jwt from 'jsonwebtoken';
// import * as admin from 'firebase-admin';
import { FirebaseError, auth } from 'firebase-admin';

const isError = (error: unknown): error is Error => {
    return (error as Error).message !== undefined;
};

const isFirebaseError = (error: unknown): error is FirebaseError => {
    return (error as FirebaseError).code !== undefined;
};

const home = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("Welcome to eBuddy REST API's!")
};

const createJwtToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = jwt.sign({}, process.env.JWT_SECRET || 'eBuddyApiTestingJWT', {
            expiresIn: '1h',
        });
        res.status(200).send({
            statusCode: 200,
            status: "success",
            message: "Token generated successfully",
            token: token,
        });
    } catch (error) {
        if (isError(error)) {
            next(ApiError.internal(error.message));
        } else {
            next(ApiError.internal('An unknown error occurred'));
        }
    }
};

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token)
        if (token) {
            const validate = await auth().verifyIdToken(token);
            console.log('-----', validate)
            res.status(200).send({
                statusCode: 200,
                status: "success",
                message: "Token validated successfully",
                validate: validate,
            });
        }
    } catch (error) {
        console.log(error)
        if (isFirebaseError(error) && error.code === 'auth/argument-error') {
            next(ApiError.unauthorized(error.message));
        } else {
            next(ApiError.internal('An unknown error occurred'));
        }
    }
};

const addUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userName, userEmailId } = req.body;
    try {
        console.log('Request: ', userName, userEmailId)
        const newUser = await addNewUser({ userName, userEmailId })
        console.log('Response: ', newUser)
        res.status(201).send({
            statusCode: 201,
            status: "success",
            message: "User added successfully",
            addedUserDetails: newUser,
        });
    } catch (error) {
        console.log('-----', error)
        if (isError(error)) {
            next(ApiError.badRequest(error.message));
        } else {
            next(ApiError.internal('An unknown error occurred'));
        }
    }
};

const getUsersList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getUsers = await userList()
        console.log('Response: ', getUsers)
        res.status(200).send({
            statusCode: 200,
            status: "success",
            getUsersList: getUsers,
        });
    } catch (error) {
        console.log(error)
        if (isError(error)) {
            next(ApiError.notFound(error.message));
        } else {
            next(ApiError.internal('An unknown error occurred'));
        }
    }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    try {
        const userDetail = await getUserDetail(id)
        console.log('Response: ', userDetail)
        res.status(200).send({
            statusCode: 200,
            status: "success",
            userDetail: userDetail,
        });
    } catch (error) {
        console.log(error)
        if (isError(error)) {
            next(ApiError.notFound(error.message));
        } else {
            next(ApiError.internal('An unknown error occurred'));
        }
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, userName, userEmailId } = req.body;
        console.log({ id, userName, userEmailId })
        const updateUser = await updateUserDetails({ id, userName, userEmailId })
        console.log(updateUser)
        res.status(200).send({
            statusCode: 200,
            status: "success",
            message: "User updated successfully",
            updatedUserDetails: updateUser,
        });
    } catch (error) {
        console.log(error)
        if (isError(error)) {
            next(ApiError.badRequest(error.message));
        } else {
            next(ApiError.internal('An unknown error occurred'));
        }
    }
};

export { home, createJwtToken, validateToken, addUser, getUser, getUsersList, updateUser };