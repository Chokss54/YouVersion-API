import express, {Express} from 'express';
import dotEnvExtended from 'dotenv-extended';
import client from './biblebot';

import api from './api/index';

dotEnvExtended.load()

const app: Express = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.use("/api", api);

const onServerStart = async () => {
    app.listen(port, () => {
        console.log(`⚡️[Server]: Server is running at http://localhost:${port}`);
    });
    // Initialize discord bot here...
    await client.login();
};

onServerStart();

export default app;
