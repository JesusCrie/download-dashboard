import { ValidationError } from 'express-json-validator-middleware';
import { AuthenticationError } from '../services/authService';
import { commonForbidden, commonNotFound } from '../commonPayload';

export const validationFailedMiddleware = (err, req, res, next) => {
    // Schema validation failed
    if (err instanceof ValidationError) {
        res.status(422).json({
            error: true,
            code: 422,
            message: 'Unprocessable entity',
            name: err.name,
            errors: err.validationErrors.body
        });
    } else {
        next(err);
    }
};

export const unauthorizedMiddleware = (err, req, res, next) => {
    // Auth error
    if (err instanceof AuthenticationError) {
        res.status(403).json(commonForbidden);
    } else {
        next(err);
    }
};

export const errorMiddleware = (err, req, res, next) => {
    // General error
    res.status(500).json({
        error: true,
        code: 500,
        message: `An error occurred: ${err.message}`
    });
};

export const notFoundMiddleware = (req, res, next) => {
    // 404
    res.status(404).json({
        ...commonNotFound,
        message: 'Route not found'
    });
};
