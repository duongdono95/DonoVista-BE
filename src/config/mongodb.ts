// donovista
// XH4qn2r6iqHkhKGv
import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { env } from './environment';

let donoVistaInstance: null | Db = null;

const mongoClientInstance = new MongoClient(env.MONGODB_URI ?? '', {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export const CONNECT_DB = async () => {
    await mongoClientInstance.connect();

    donoVistaInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

export const GET_DB = () => {
    if (!donoVistaInstance) throw new Error('Must connect to Database first.');
    return donoVistaInstance;
};

export const CLOSE_DB = async () => {
    await mongoClientInstance.close();
};
