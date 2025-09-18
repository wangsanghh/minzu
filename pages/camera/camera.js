Page({
  data: {
    result: null,
    uploadedImage: null, // 添加上传图片的路径
    historyRecords: [], // 历史记录
    showHistory: false // 是否显示历史记录
  },

  chooseImage: function() {
    // 从相册选择图片
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
      sourceType: ['album'], // 可以指定来源是相册
      success: (res) => {
        // 显示正在识别的提示
        wx.showToast({
          title: '正在识别中...',
          icon: 'loading',
          duration: 10000 // 设置较长的持续时间，直到识别完成
        });
        
        // 获取选择的图片路径
        const tempFilePath = res.tempFilePaths[0];
        
        // 保存上传的图片路径
        this.setData({
          uploadedImage: tempFilePath
        });
        
        // 将图片转换为base64
        wx.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: (res) => {
            // 调用百度AI图像识别API
            this.callBaiduAI(res.data);
          },
          fail: (err) => {
            wx.hideToast();
            wx.showToast({
              title: '图片处理失败',
              icon: 'none'
            });
            console.error('图片处理失败', err);
          }
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
        console.error('选择图片失败', err);
      }
    });
  },

  callBaiduAI: function(imageBase64) {
    // 引入百度AI工具函数
    const baiduAI = require('../../utils/baiduAI.js');
    
    // 调用百度AI高级通用物体识别API
    baiduAI.advancedGeneralRecognition(imageBase64)
      .then(res => {
        wx.hideToast();
        
        // 处理识别结果
        this.processRecognitionResult(res);
      })
      .catch(err => {
        wx.hideToast();
        wx.showToast({
          title: '识别失败',
          icon: 'none'
        });
        console.error('百度AI识别失败', err);
        // 显示更详细的错误信息
        wx.showModal({
          title: '识别失败',
          content: err.message || '未知错误',
          showCancel: false
        });
        // 重置处理状态
        this.setData({
          isProcessing: false
        });
      });
  },

  processRecognitionResult: function(data) {
    // 检查数据有效性
    if (!data || !data.result) {
      wx.showToast({
        title: '识别结果为空',
        icon: 'none'
      });
      console.error('识别结果为空:', data);
      // 重置处理状态
      this.setData({
        isProcessing: false
      });
      return;
    }
    
    // 解析识别结果，查找民族服饰相关信息
    let nationInfo = this.extractNationInfo(data.result);
    
    // 设置识别结果
    this.setData({
      result: nationInfo
    });
    
    // 保存到历史记录
    this.saveToHistory(nationInfo);
    
    // 只显示识别的民族名称
    wx.showToast({
      title: nationInfo.nation,
      icon: 'success'
    });
    
    // 重置处理状态
    this.setData({
      isProcessing: false
    });
  },

  extractNationInfo: function(results) {
    // 简化处理：只查找民族名称
    let nationName = '未知民族';
    let confidence = 0;
    let image = '../../images/nation/10.png'; // 默认图片
    
    // 民族名称映射
    const nationMap = {
      '藏族': { name: '藏族', image: '../../images/nation/10.png' },
      '蒙古族': { name: '蒙古族', image: '../../images/nation/9.png' },
      '维吾尔族': { name: '维吾尔族', image: '../../images/nation/6.png' },
      '壮族': { name: '壮族', image: '../../images/nation/2.png' },
      '彝族': { name: '彝族', image: '../../images/nation/8.png' },
      '布依族': { name: '布依族', image: '../../images/nation/11.png' },
      '朝鲜族': { name: '朝鲜族', image: '../../images/nation/14.png' },
      '满族': { name: '满族', image: '../../images/nation/3.png' },
      '侗族': { name: '侗族', image: '../../images/nation/12.png' },
      '瑶族': { name: '瑶族', image: '../../images/nation/13.png' },
      '白族': { name: '白族', image: '../../images/nation/15.png' },
      '哈尼族': { name: '哈尼族', image: '../../images/nation/16.png' },
      '哈萨克族': { name: '哈萨克族', image: '../../images/nation/17.png' },
      '傣族': { name: '傣族', image: '../../images/nation/19.png' },
      '黎族': { name: '黎族', image: '../../images/nation/18.png' },
      '僳僳族': { name: '僳僳族', image: '../../images/nation/20.png' },
      '佤族': { name: '佤族', image: '../../images/nation/21.png' },
      '畲族': { name: '畲族', image: '../../images/nation/22.png' },
      '高山族': { name: '高山族', image: '../../images/nation/23.png' },
      '拉祜族': { name: '拉祜族', image: '../../images/nation/24.png' }
    };
    
    // 如果results是一个对象而不是数组，尝试提取描述信息
    if (!Array.isArray(results) && results && typeof results === 'object') {
      // 检查是否有keyword字段
      if (results.keyword) {
        // 将单个对象转换为数组进行处理
        results = [results];
      } else {
        // 如果没有keyword字段，返回默认信息
        return {
          image: image,
          nation: nationName,
          confidence: confidence
        };
      }
    }
    
    // 遍历识别结果，查找民族信息
    for (let i = 0; i < (Array.isArray(results) ? Math.min(results.length, 5) : 0); i++) {
      const item = results[i];
      const keyword = item.keyword || item.root || item.description || '';
      
      if (keyword) {
        // 查找匹配的民族
        for (let nation in nationMap) {
          if (keyword.includes(nation) || keyword.includes(nationMap[nation].name)) {
            nationName = nationMap[nation].name;
            image = nationMap[nation].image;
            confidence = Math.round((item.score || 0.95) * 100);
            break;
          }
        }
        
        // 如果找到了民族信息，跳出循环
        if (nationName !== '未知民族') {
          break;
        }
      }
    }
    
    // 如果没有找到具体的民族信息，使用置信度最高的结果
    if (nationName === '未知民族' && Array.isArray(results) && results.length > 0) {
      const firstResult = results[0];
      const keyword = firstResult.keyword || firstResult.root || firstResult.description || '未知民族';
      nationName = keyword;
      confidence = Math.round((firstResult.score || 0.95) * 100);
    }
    
    return {
      image: image,
      nation: nationName,
      confidence: confidence
    };
  },

  onLoad: function() {
    // 页面加载时的初始化操作
    console.log('Camera page loaded');
    // 加载历史记录
    this.loadHistoryRecords();
  },

  // 保存识别结果到历史记录
  saveToHistory: function(nationInfo) {
    const currentTime = new Date();
    const historyItem = {
      id: Date.now(), // 使用时间戳作为ID
      image: this.data.uploadedImage, // 保存上传的图片路径
      nation: nationInfo.nation,
      confidence: nationInfo.confidence,
      time: currentTime.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // 获取现有历史记录
    let historyRecords = wx.getStorageSync('recognitionHistory') || [];
    
    // 将新记录添加到数组开头（最新的在前面）
    historyRecords.unshift(historyItem);
    
    // 限制历史记录数量，最多保存20条
    if (historyRecords.length > 20) {
      historyRecords = historyRecords.slice(0, 20);
    }
    
    // 保存到本地存储
    try {
      wx.setStorageSync('recognitionHistory', historyRecords);
      // 更新页面数据
      this.setData({
        historyRecords: historyRecords
      });
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  },

  // 加载历史记录
  loadHistoryRecords: function() {
    try {
      const historyRecords = wx.getStorageSync('recognitionHistory') || [];
      this.setData({
        historyRecords: historyRecords
      });
    } catch (error) {
      console.error('加载历史记录失败:', error);
    }
  },

  // 切换历史记录显示状态
  toggleHistory: function() {
    this.setData({
      showHistory: !this.data.showHistory
    });
  },

  // 点击历史记录项
  onHistoryItemTap: function(e) {
    const index = e.currentTarget.dataset.index;
    const historyItem = this.data.historyRecords[index];
    
    // 设置为当前显示的结果
    this.setData({
      uploadedImage: historyItem.image,
      result: {
        nation: historyItem.nation,
        confidence: historyItem.confidence
      },
      showHistory: false // 关闭历史记录面板
    });
  },

  // 清除所有历史记录
  clearHistory: function() {
    wx.showModal({
      title: '确认清除',
      content: '是否清除所有历史记录？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('recognitionHistory');
            this.setData({
              historyRecords: [],
              showHistory: false
            });
            wx.showToast({
              title: '已清除历史记录',
              icon: 'success'
            });
          } catch (error) {
            console.error('清除历史记录失败:', error);
            wx.showToast({
              title: '清除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
});