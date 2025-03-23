export const dbConfig = {
    user: "postgres",
    host: "reddwarf-postgresql.reddwarf-storage.svc.cluster.local",
    database: "yjs",
    password: process.env.PG_PASSWORD,
    port: 5432,
};