import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
/**
 * @param data 业务数据
 * @param publicKey 后端获取公钥
 * @returns
 */
export const encryptDataHandler = async (
  data: Record<string, any>,
  publicKey: string,
) => {
  // 1. 生成 AES 密钥和初始化向量
  const initAesKey = CryptoJS.lib.WordArray.random(32);
  const initIv = CryptoJS.lib.WordArray.random(16);
  const base64 = CryptoJS.enc.Base64;

  // 2. 配置加密参数
  const AESOptions = {
    mode: CryptoJS.mode.CBC,
    iv: initIv,
    padding: CryptoJS.pad.Pkcs7,
  };

  // 3. AES加密业务数据
  const postValues = JSON.stringify(data);
  const result = CryptoJS.AES.encrypt(postValues, initAesKey, AESOptions);
  const requestStr = result.ciphertext.toString(base64);

  // 4. RSA加密传输密钥
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(atob(publicKey));

  return {
    requestStr,
    aesKeyValue: encrypt.encrypt(initAesKey.toString(base64)),
    ivValue: encrypt.encrypt(initIv.toString(base64)),
  };
};
