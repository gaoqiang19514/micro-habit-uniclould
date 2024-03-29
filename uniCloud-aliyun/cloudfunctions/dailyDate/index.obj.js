const db = require('db');
const tools = require('tools');
const dailyDateTable = db.collection('dailyDate');

/**
 * @typedef {Object} Daily
 * @property {string} _id
 * @property {string} date
 * @property {string} name
 * @property {string} username
 */

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {any} data
 */

/**
 * @typedef {Object} DailyApiResponse
 * @extends {ApiResponse}
 * @property {Daily[]} data
 */

/**
 * 新增
 * @param {Object} body
 * @param {string} body.date
 * @param {string} body.name
 * @returns {ApiResponse}
 */
function add() {
  const httpInfo = this.getHttpInfo();
  const { date, name } = JSON.parse(httpInfo.body)
  const { username } = tools.parseToken(httpInfo.headers.token)
  
  // TODO: 避免重名

  return dailyDateTable.add({
    date,
    name,
    username
  });
}

/**
 * 删除
 * @param {Object} params
 * @param {string} params.date
 * @param {string} params.name
 * @returns {ApiResponse}
 */
async function del(params) {
  const { token, date, name } = params;
  const { username } = tools.parseToken(token)
  
  if (!username) {
    return {
      code: -1,
      data: '缺少参数用户名'
    }
  }
  
  if (!name) {
    return {
      code: -1,
      data: '缺少参数'
    }
  }

  return dailyDateTable.where({ date, name, username }).remove();
}

/**
 * 列表
 * @param {Object} params
 * @param {string} params.token
 * @param {string} [params.date]
 * @returns {DailyApiResponse}
 */
function list(params) {
  const { token, date } = params;
  const { username } = tools.parseToken(token)

  return dailyDateTable.where({
    username,
    date,
  }).get();
}

module.exports = {
  add,
  del,
  list,
};