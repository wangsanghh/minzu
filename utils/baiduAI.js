// 百度AI工具函数
const baiduAIConfig = require('../config/baiduAI.js');

/**
 * 获取百度AI的access_token
 */
function getAccessToken() {
  return new Promise((resolve, reject) => {
    // 检查API Key和Secret Key是否配置
    if (!baiduAIConfig.apiKey || !baiduAIConfig.secretKey) {
      reject(new Error('请配置百度AI的API Key和Secret Key'));
      return;
    }
    
    const url = `${baiduAIConfig.authUrl}?grant_type=client_credentials&client_id=${baiduAIConfig.apiKey}&client_secret=${baiduAIConfig.secretKey}`;
    
    console.log('请求access_token的URL:', url);
    
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log('获取access_token响应:', res);
        if (res.data.access_token) {
          resolve(res.data.access_token);
        } else {
          reject(new Error('获取access_token失败: ' + JSON.stringify(res.data)));
        }
      },
      fail: function(err) {
        console.error('获取access_token失败:', err);
        reject(new Error('网络请求失败: ' + err.errMsg));
      }
    });
  });
}

/**
 * 调用百度AI高级通用物体识别API
 * @param {string} imageBase64 - 图片的base64编码
 */
function advancedGeneralRecognition(imageBase64) {
  return new Promise((resolve, reject) => {
    // 检查图片数据
    if (!imageBase64) {
      reject(new Error('图片数据为空'));
      return;
    }
    
    getAccessToken().then(accessToken => {
      const url = `${baiduAIConfig.advancedGeneralUrl}?access_token=${accessToken}`;
      
      console.log('请求识别API的URL:', url);
      
      wx.request({
        url: url,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          image: imageBase64,
          baike_num: 1 // 返回百科信息的结果数
        },
        success: function(res) {
          console.log('识别API响应:', res);
          // 检查响应状态码
          if (res.statusCode === 200) {
            // 处理流式响应
            if (res.data && typeof res.data === 'string' && res.data.includes('data:')) {
              try {
                // 尝试解析流式响应
                const lines = res.data.split('\n');
                const results = [];
                
                for (const line of lines) {
                  if (line.startsWith('data:')) {
                    const jsonData = JSON.parse(line.substring(5));
                    if (jsonData.result && jsonData.result.description) {
                      results.push(jsonData.result.description);
                    }
                  }
                }
                
                // 合并所有描述
                const fullDescription = results.join('');
                resolve({
                  result: [{
                    keyword: fullDescription,
                    score: 0.95 // 默认置信度
                  }]
                });
                return;
              } catch (parseError) {
                console.error('解析流式响应失败:', parseError);
                reject(new Error('解析流式响应失败: ' + parseError.message));
                return;
              }
            }
            
            // 处理正常的结构化响应
            if (res.data && res.data.result) {
              resolve(res.data);
            } else {
              reject(new Error('识别失败: ' + JSON.stringify(res.data)));
            }
          } else {
            reject(new Error(`API请求失败，状态码: ${res.statusCode}, 错误信息: ${JSON.stringify(res.data)}`));
          }
        },
        fail: function(err) {
          console.error('识别API请求失败:', err);
          reject(new Error('网络请求失败: ' + err.errMsg));
        }
      });
    }).catch(err => {
      console.error('获取access_token失败:', err);
      reject(new Error('获取access_token失败: ' + err.message));
    });
  });
}

module.exports = {
  getAccessToken,
  advancedGeneralRecognition
};