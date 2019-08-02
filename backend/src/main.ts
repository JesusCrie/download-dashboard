import express from 'express';
import metrics from './routes/metrics';

const app = express();
const port = 8000;

app.get('/', (req, res) => {
    res
        .status(200)
        .json({status: 'ok'});
});

app.get('/yolo', (req, res) => {
    res.send('Salut ma couille !');
});

app.use(metrics);

app.listen(port, () => console.log(`App started and listening on port ${port} !`));
