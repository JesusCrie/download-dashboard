import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import metricsRoutes from './routes/metrics';

export const run = () => {
    const app = express();
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.json({status: 'ok'});
    });

    app.use('/auth', authRoutes);
    app.use(metricsRoutes);

    const port = process.env.PORT;
    app.listen(port, () => console.log(`App started and listening on port ${port} !`));
};
