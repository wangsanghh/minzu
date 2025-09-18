// pages/assistant/assistant.js
const app = getApp();

Page({
  data: {
    messages: [
      {
        id: 1,
        text: '您好！我是民族智能小助手，您可以询问我关于中国各民族的文化、历史、服饰、节日等相关问题。',
        isUser: false,
        time: new Date().toLocaleTimeString()
      }
    ],
    inputValue: '',
    isSending: false
  },

  onLoad() {
    // 页面加载时的初始化操作
    console.log('Assistant page loaded');
  },

  // 发送消息
  sendMessage() {
    const text = this.data.inputValue.trim();
    if (!text || this.data.isSending) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      text: text,
      isUser: true,
      time: new Date().toLocaleTimeString()
    };

    this.setData({
      messages: [...this.data.messages, userMessage],
      inputValue: '',
      isSending: true
    });

    // 调用DeepSeek API获取回复
    this.getAIResponse(text);
  },

  // 调用DeepSeek API获取回复
  getAIResponse(userText) {
    // 构建系统提示词，专注于民族文化相关问题
    const systemPrompt = `你是一个专业的民族文化智能助手，专门回答关于中国56个民族的相关问题。请提供准确、详细且有帮助的回答。回答应该包括：
1. 相关民族的基本信息
2. 文化特色
3. 传统习俗
4. 历史背景（如果相关）
5. 其他有趣的事实

请以友好、专业的语调回答问题，并确保内容准确无误。如果问题与民族文化无关，请礼貌地引导用户提问相关问题。`;

    // 准备聊天历史记录
    const chatHistory = this.data.messages.filter(msg => !msg.isUser || (msg.isUser && msg.text)).map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }));

    wx.request({
      url: app.globalData.apiEndpoint,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${app.globalData.apiKey}`
      },
      data: {
        model: app.globalData.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...chatHistory.slice(1), // 排除第一条系统消息
          {
            role: 'user',
            content: userText
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      success: (res) => {
        console.log('API Response:', res);
        if (res.statusCode === 200 && res.data.choices && res.data.choices.length > 0) {
          const responseText = res.data.choices[0].message.content;
          
          // 添加AI回复
          const aiMessage = {
            id: Date.now() + 1,
            text: responseText,
            isUser: false,
            time: new Date().toLocaleTimeString()
          };

          this.setData({
            messages: [...this.data.messages, aiMessage],
            isSending: false
          });
        } else {
          // API调用失败，使用默认回复
          this.handleAPIError();
        }
      },
      fail: (err) => {
        console.error('API调用失败:', err);
        // 网络错误，使用默认回复
        this.handleAPIError();
      }
    });
  },

  // 处理API错误
  handleAPIError() {
    const errorMessage = {
      id: Date.now() + 1,
      text: '抱歉，我现在无法回答您的问题。请稍后再试，或者检查网络连接是否正常。',
      isUser: false,
      time: new Date().toLocaleTimeString()
    };

    this.setData({
      messages: [...this.data.messages, errorMessage],
      isSending: false
    });
  },

  // 滚动到底部
  scrollToBottom() {
    // 延迟执行以确保DOM更新完成
    setTimeout(() => {
      wx.createSelectorQuery()
        .select('.chat-container')
        .boundingClientRect((rect) => {
          if (rect) {
            wx.pageScrollTo({
              scrollTop: rect.bottom,
              duration: 300
            });
          }
        })
        .exec();
    }, 100);
  },

  // 输入框内容变化
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 清空聊天记录
  clearChat() {
    wx.showModal({
      title: '确认清空',
      content: '是否清空聊天记录？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: [
              {
                id: 1,
                text: '您好！我是民族智能小助手，您可以询问我关于中国各民族的文化、历史、服饰、节日等相关问题。',
                isUser: false,
                time: new Date().toLocaleTimeString()
              }
            ]
          });
        }
      }
    });
  }
});