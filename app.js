App({
  globalData: {
    apiKey: 'sk-524e75e3fea340959e1ba98799c70a1d',
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    history: []
  },
  
  onLaunch: function () {
    // 从本地存储读取API密钥
    const savedApiKey = wx.getStorageSync('apiKey')
    if (savedApiKey) {
      this.globalData.apiKey = savedApiKey
    }
    
    // 从本地存储读取对话历史
    const savedHistory = wx.getStorageSync('chatHistory')
    if (savedHistory) {
      this.globalData.history = savedHistory
    }
  }
})