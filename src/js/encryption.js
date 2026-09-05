export async function encrypt(data, password) {

    const encoder = new TextEncoder();

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await getKey(password, salt);

    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encoder.encode(data)
    );

    return {
        salt: Array.from(salt),
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData))
    };
}

export async function decrypt(encryptedFile, password) {

    const salt = new Uint8Array(encryptedFile.salt);
    const iv = new Uint8Array(encryptedFile.iv);
    const encryptedData = new Uint8Array(encryptedFile.data);

    const key = await getKey(password, salt);

    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedData
    );

    const decoder = new TextDecoder();

    return decoder.decode(decryptedData);
}

async function getKey(password, salt) {
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 250000,
            hash: "SHA-256"
        },
        keyMaterial,
        {
            name: "AES-GCM",
            length: 256
        },
        false,
        ["encrypt", "decrypt"]
    );
}