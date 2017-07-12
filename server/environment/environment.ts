export function parameters() {
    return {
        mongoDb: {
            name: "dbsystem",
            debug: process.env.DB_DEBUG === "1",
            host: process.env.DB_HOST,
            modelInMemory: process.env.DB_MODELS_INMEMORY === "1",
        },
        identity: {
            secret: "LhfzxtkIST9PHm1hD902UQo00X77Z8/yOMH0ShGOs/o=",
        }
    };
}
