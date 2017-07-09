import * as crypto from "crypto";
export class CryptoHelper {
    public static calculateHash(value: string, salt: string) {
        let valueToHash = value.trim() + salt;
        let data = Buffer.from(valueToHash, "ascii");
        return crypto.createHash("sha256").update(data, "utf8").digest().toString("base64");
    }
}
