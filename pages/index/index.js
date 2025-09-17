Page({
  data: {
    messages: [],
    inputValue: '',
    scrollTop: 0
  },

  onLoad: function () {
    // 初始化页面数据
    this.setData({
      messages: [
        {
          role: 'assistant',
          content: '您好！我是您的私人AI助手，有什么我可以帮您的吗？'
        }
      ]
    })
    
    // 从全局数据中获取历史记录
    const app = getApp()
    if (app.globalData.history && app.globalData.history.length > 0) {
      this.setData({
        messages: app.globalData.history
      })
    }
  },

  onInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onSend: function () {
    const inputValue = this.data.inputValue.trim()
    if (!inputValue) return

    // 添加用户消息到聊天记录
    const userMessage = {
      role: 'user',
      content: inputValue
    }

    const messages = [...this.data.messages, userMessage]
    
    this.setData({
      messages: messages,
      inputValue: ''
    })

    // 滚动到底部
    this.scrollToBottom()

    // 调用AI接口获取回复
    this.getAIResponse(messages)
  },

  getAIResponse: function (messages) {
    const app = getApp()
  
    // 显示加载提示
    wx.showLoading({
      title: 'AI思考中...'
    })

    // 调用DeepSeek API
    wx.request({
      url: app.globalData.apiEndpoint,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${app.globalData.apiKey}`
      },
      data: {
        model: app.globalData.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: false
      },
      success: (res) => {
        wx.hideLoading()
        
        if (res.statusCode === 200 && res.data.choices && res.data.choices.length > 0) {
          const aiMessage = {
            role: 'assistant',
            content: res.data.choices[0].message.content
          }
          
          // 更新聊天记录
          const updatedMessages = [...this.data.messages, aiMessage]
          this.setData({
            messages: updatedMessages
          })
          
          // 滚动到底部
          this.scrollToBottom()
          
          // 保存到全局数据和本地存储
          app.globalData.history = updatedMessages
          wx.setStorageSync('chatHistory', updatedMessages)
        } else {
          wx.showToast({
            title: 'AI回复失败，请重试',
            icon: 'none'
          })
          
          // 添加错误消息到聊天记录
          const errorMessage = {
            role: 'assistant',
            content: '抱歉，我暂时无法回答您的问题，请稍后重试。'
          }
          
          const updatedMessages = [...this.data.messages, errorMessage]
          this.setData({
            messages: updatedMessages
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        
        // 添加错误消息到聊天记录
        const errorMessage = {
          role: 'assistant',
          content: '网络连接失败，请检查网络设置后重试。'
        }
        
        const updatedMessages = [...this.data.messages, errorMessage]
        this.setData({
          messages: updatedMessages
        })
      }
    })
  },

  scrollToBottom: function () {
    // 延迟执行以确保视图更新
    wx.createSelectorQuery().select('.chat-history').boundingClientRect((rect) => {
      this.setData({
        scrollTop: rect.height
      })
    }).exec()
  },

  onClearHistory: function () {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.globalData.history = []
          wx.setStorageSync('chatHistory', [])
          
          this.setData({
            messages: [
              {
                role: 'assistant',
                content: '您好！我是您的私人AI助手，有什么我可以帮您的吗？'
              }
            ]
          })
        }
      }
    })
  }
})