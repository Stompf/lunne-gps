import { Db, MongoClient } from 'mongodb';

let db: Db | undefined;

async function initDatabase() {
    if (!process.env.DB_USER || !process.env.DB_PASS) {
        throw Error('Missing auth');
    }

    const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;

    const client = await MongoClient.connect(uri, {
        useUnifiedTopology: true,
        auth: {
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        },
    });

    return client.db(process.env.DB_NAME);
}

export async function getDB() {
    if (!db) {
        db = await initDatabase();
    }
    return db;
}
