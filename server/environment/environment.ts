export function parameters() {
    return {
        mongoDb: {
            debug: process.env.DB_DEBUG === "1",
            host: process.env.DB_HOST,
            modelInMemory: process.env.DB_MODELS_INMEMORY === "1",
        },
    };
}
