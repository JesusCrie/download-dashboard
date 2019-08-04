import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import metricsRoutes from './routes/metrics';
import { ValidationError } from 'express-json-validator-middleware';

export const run = () => {
    const app = express();
    app.use(bodyParser.json());

    app.use('/auth', authRoutes);
    app.use(metricsRoutes);

    app.use((err, req, res, next) => {
        if (err instanceof ValidationError) {
            res.status(422).json({
                error: true,
                code: 422,
                message: 'Unprocessable entity',
                name: err.name,
                errors: err.validationErrors.body
            });
        } else {
            next();
        }
    });

    const port = process.env.PORT;
    app.listen(port, () => console.log(`App started and listening on port ${port} !`));
};
