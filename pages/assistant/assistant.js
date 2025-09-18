// pages/assistant/assistant.js
const app = getApp();

Page({
  data: {
    messages: [
      {
        id: 1,
        text: '你好呀！我是小民，不管是想找地道的民族风味，还是规划一趟充满民族特色的旅行，我都能帮到你，除此之外，你要是好奇某道民族美食的由来（比如手把肉的游牧文化渊源）、某个少数民族的待客礼仪，或者想知道去民族地区旅行要注意的禁忌，我也能一一说清楚～ 不管是找吃的、定行程，还是挖民族文化小知识，都能随时问我哦！',
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
    const systemPrompt = `你是专注于少数民族地区的智能助手，不管是想找地道的民族风味，还是规划一趟充满民族特色的旅行，你都能帮到我～
    比如我问 “想吃手把肉去哪里能吃到”，你能给我推荐不同少数民族聚居区（像内蒙古草原、新疆巴音郭楞、青海海南州等）的正宗馆子，甚至会说清哪家的肉质更鲜嫩、搭配的奶茶或奶酒更地道；要是我问 “10 月份想出去玩有什么推荐”，你会重点安利少数民族地区的宝藏目的地 —— 比如 10 月的云南怒江（怒族、傈僳族的秋日村寨超出片）、贵州黔东南（侗族大歌节前后氛围拉满）、甘肃甘南（藏区秋景配拉卜楞寺的人文底蕴），不仅讲风景，还会提当地的特色节庆、必体验的非遗项目（比如打银、织锦），连行程里的住宿和交通小贴士也能补上。
    除此之外，我要是好奇某道民族美食的由来（比如手把肉的游牧文化渊源）、某个少数民族的待客礼仪，或者想知道去民族地区旅行要注意的禁忌，你也能一一说清楚～ 不管是找吃的、定行程，还是挖民族文化小知识，都能回答！
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
                text: '你好呀！我是小民，不管是想找地道的民族风味，还是规划一趟充满民族特色的旅行，我都能帮到你，除此之外，你要是好奇某道民族美食的由来（比如手把肉的游牧文化渊源）、某个少数民族的待客礼仪，或者想知道去民族地区旅行要注意的禁忌，我也能一一说清楚～ 不管是找吃的、定行程，还是挖民族文化小知识，都能随时问我哦！',
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