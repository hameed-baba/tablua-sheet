import CryptoJS from "crypto-js";

const SECRET_KEY = "b@5M@ll@h737&$";

export function safeEncryptParam(value) {
  try {
    if (value === undefined || value === null) return null;

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      SECRET_KEY
    ).toString();

    // Make it URL-safe
    return encodeURIComponent(encrypted);
  } catch (e) {
    return null;
  }
}

export function safeDecryptParam(cipherText) {
  try {
    if (!cipherText) return null;

    const decoded = decodeURIComponent(cipherText);
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) return null;

    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
}
