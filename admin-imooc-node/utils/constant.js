const {env} = require('./env');
const UPLOAD_PATH = env === 'dev' ? 'C:\\Users\\Administrator\\Desktop\\vue-element-admin-master\\admin-imooc-node\\file' : '../file';
const UPLOAD_URL = env === 'dev' ? 'http://localhost:9999/file':'';
module.exports = {
  CODE_ERROR: -1,
  CODE_SUCCESS: 0,
  CODE_TOKEN_EXPIRED: -2,
  debug: true,
  PWD_SALT: 'admin_imooc_node',
  PRIVATE_KEY: 'Password',
  JWT_EXPIRED: 60 * 60,
  MIME_TYPE_EPUB: 'application/txt+zip',
  UPLOAD_PATH,
  UPLOAD_URL,
  md5Key:'Password'
};
