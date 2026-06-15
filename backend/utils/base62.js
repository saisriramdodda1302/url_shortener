const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = ALPHABET.length;

export const encodeBase62 = (num) => {
    let bigint = BigInt(num);
    if (bigint === 0n) return ALPHABET[0];
    let encoded = "";
    while (bigint > 0n) {
        let remainder = bigint % BigInt(BASE);
        encoded = ALPHABET[Number(remainder)] + encoded;
        bigint = bigint / BigInt(BASE);
    }
    return encoded;
};
