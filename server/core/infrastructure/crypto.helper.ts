import * as crypto from "crypto";
export class CryptoHelper {
    public static calculateHash(value: string, salt: string) {
        const valueToHash = value.trim() + salt;
        const data = Buffer.from(valueToHash, "ascii");
        return crypto.createHash("sha256").update(data, "utf8").digest().toString("base64");
    }
}
