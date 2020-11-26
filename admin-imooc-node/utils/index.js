const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {PRIVATE_KEY} = require('../utils/constant');

/*加密*/
function md5(pwd) {
  return crypto.createHash('md5')
    .update(String(pwd))
    .digest('hex');
}

/*加密*/
function aesEncrypt(data, md5Key) {
  const cipher = crypto.createCipher('aes192', md5Key);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/*解密*/
function aesDecrypt(encrypted, key) {
  const decipher = crypto.createDecipher('aes192', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function decoded(req) {
  let token = req.get('Authorization');
  if (token.indexOf('Bearer') === 0) {
    token = token.replace('Bearer ', '');
  }
  return jwt.verify(token, PRIVATE_KEY);
}

/*判断类型是否为对象*/
function isObject(model) {
  return Object.prototype.toString.call(model) === '[object Object]';
}

/*将对象数组转为String类型*/
function objectArrayToString(array) {
  let str = '';
  array.forEach((object, index) => {
    if (index === 0) {
      str = JSON.stringify(object);
    } else {
      str = str + '/' + JSON.stringify(object);
    }
  });
  return str;
}

/*还原对象数组转化String类型*/
function StringToObjectArray(str) {
  let array = str.split('/');
  array.forEach((object,index) =>{
    array[index] = JSON.parse(object)
  });
  return array;
}

module.exports = {
  md5,
  aesEncrypt,
  aesDecrypt,
  decoded,
  isObject,
  objectArrayToString,
  StringToObjectArray
};
