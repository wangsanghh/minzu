Page({
  data: {
    calendarDays: [],
    selectedEvent: null,
    festivalDetail: null,
    originContent: null,
    activityContent: null,
    isLoading: false,
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
    // 民族节日数据，按月份分类
    ethnicFestivals: {
      1: [
        { day: 1, nation: '汉族', festival: '元旦' },
        { day: 15, nation: '汉族', festival: '元宵节' },
        { day: 20, nation: '彝族', festival: '彝族年' }
      ],
      2: [
        { day: 2, nation: '汉族', festival: '龙抬头' },
        { day: 19, nation: '纳西族', festival: '棒棒会' }
      ],
      3: [
        { day: 3, nation: '壮族', festival: '三月三歌节' },
        { day: 15, nation: '白族', festival: '三月街' }
      ],
      4: [
        { day: 10, nation: '傣族', festival: '泼水节' },
        { day: 15, nation: '藏族', festival: '萨嘎达瓦节' },
        { day: 22, nation: '蒙古族', festival: '马奶节' }
      ],
      5: [
        { day: 5, nation: '汉族', festival: '端午节' },
        { day: 22, nation: '苗族', festival: '苗年节' }
      ],
      6: [
        { day: 6, nation: '汉族', festival: '天贶节' },
        { day: 24, nation: '彝族', festival: '火把节' },
        { day: 25, nation: '哈尼族', festival: '矻扎扎节' }
      ],
      7: [
        { day: 7, nation: '汉族', festival: '七夕节' },
        { day: 15, nation: '京族', festival: '唱哈节' }
      ],
      8: [
        { day: 15, nation: '汉族', festival: '中秋节' },
        { day: 20, nation: '傈僳族', festival: '刀杆节' }
      ],
      9: [
        { day: 9, nation: '汉族', festival: '重阳节' },
        { day: 19, nation: '仡佬族', festival: '仡佬节' }
      ],
      10: [
        { day: 1, nation: '汉族', festival: '国庆节' },
        { day: 15, nation: '德昂族', festival: '关门节' }
      ],
      11: [
        { day: 1, nation: '蒙古族', festival: '白节' },
        { day: 11, nation: '苗族', festival: '苗年节' },
        { day: 22, nation: '侗族', festival: '侗年' }
      ],
      12: [
        { day: 10, nation: '回族', festival: '古尔邦节' },
        { day: 25, nation: '汉族', festival: '圣诞节' },
        { day: 29, nation: '藏族', festival: '藏历新年' }
      ]
    }
  },

  onLoad: function() {
    this.generateCalendar();
  },

  generateCalendar: function() {
    // 生成日历数据
    const daysInMonth = new Date(this.data.currentYear, this.data.currentMonth, 0).getDate();
    const firstDay = new Date(this.data.currentYear, this.data.currentMonth - 1, 1).getDay();
    
    let calendarDays = [];
    
    // 添加空白日期
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({
        day: '',
        date: '',
        isToday: false,
        hasEvent: false,
        eventInfo: null
      });
    }
    
    // 添加实际日期
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${this.data.currentYear}-${this.data.currentMonth.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const today = new Date();
      const isToday = (i === today.getDate() && this.data.currentMonth === today.getMonth() + 1 && this.data.currentYear === today.getFullYear());
      const eventInfo = this.getEventInfo(i);
      
      calendarDays.push({
        day: i,
        date: dateStr,
        isToday: isToday,
        hasEvent: !!eventInfo,
        eventInfo: eventInfo
      });
    }
    
    this.setData({
      calendarDays: calendarDays
    });
  },

  getEventInfo: function(day) {
    // 获取指定日期的民族节日信息
    const festivals = this.data.ethnicFestivals[this.data.currentMonth];
    if (festivals) {
      const event = festivals.find(f => f.day === day);
      return event || null;
    }
    return null;
  },

  onDayTap: function(e) {
    const date = e.currentTarget.dataset.date;
    const eventInfo = e.currentTarget.dataset.event;
    if (!date || !eventInfo) return;
    
    // 设置节日详情
    const eventDetail = {
      title: `${eventInfo.nation} - ${eventInfo.festival}`,
      date: `${this.data.currentYear}年${this.data.currentMonth}月${eventInfo.day}日`,
      nation: eventInfo.nation,
      festival: eventInfo.festival
    };
    
    this.setData({
        selectedEvent: eventDetail,
        festivalDetail: null
      });
  },

  // 获取节日详细信息
  getFestivalDetails: function() {
    const that = this;
    const app = getApp();
    const apiKey = app.globalData.apiKey;
    const apiEndpoint = app.globalData.apiEndpoint;
    const model = app.globalData.model;
    
    // 显示加载状态
    this.setData({
      isLoading: true,
      festivalDetail: null
    });
    
    if (!apiKey) {
      wx.showToast({
        title: '请先设置API密钥',
        icon: 'none'
      });
      this.setData({
        isLoading: false
      });
      return;
    }
    
    const festival = this.data.selectedEvent;
    const prompt = `请详细介绍${festival.nation}的${festival.festival}节日，要求包含两个部分：1. 节日起源：介绍该节日的历史起源和文化背景；2. 节日活动：介绍该节日的主要庆祝活动和习俗。请将这两个部分分别标识清楚。`;
    
    wx.request({
      url: apiEndpoint,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: model,
        messages: [
          { role: "system", content: "你是一个了解中国各民族传统文化的专家。" },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      },
      success: function(res) {
        if (res.statusCode === 200 && res.data.choices && res.data.choices.length > 0) {
          const detail = res.data.choices[0].message.content;
          // 解析节日详情，分为起源和活动两个部分
          const parsedDetail = that.parseFestivalDetail(detail);
          
          that.setData({
            festivalDetail: detail,
            originContent: parsedDetail.origin,
            activityContent: parsedDetail.activity
          });
        } else {
          wx.showModal({
            title: '获取失败',
            content: '获取节日详情失败，请稍后重试',
            showCancel: false
          });
        }
      },
      fail: function(err) {
        console.error('API调用失败:', err);
        wx.showModal({
          title: '网络错误',
          content: '网络连接失败，请检查网络设置后重试',
          showCancel: false
        });
      },
      complete: function() {
        // 隐藏加载状态
        that.setData({
          isLoading: false
        });
      }
    });
  },

  // 解析节日详情，分为起源和活动两个部分
  parseFestivalDetail: function(detail) {
    // 尝试按标题分割内容
    let origin = '暂无详细信息';
    let activity = '暂无详细信息';
    
    // 查找"起源"相关关键词
    const originKeywords = ['起源', '由来', '历史', '来源'];
    const activityKeywords = ['活动', '庆祝', '习俗', '方式', '传统'];
    
    // 尝试按数字编号分割（1. 2.）
    const numberPattern = /\d+\.\s*/g;
    const sections = detail.split(numberPattern);
    
    if (sections.length >= 3) {
      // 如果能分割成至少3部分，假设第2部分是起源，第3部分是活动
      origin = sections[1].trim();
      activity = sections[2].trim();
    } else {
      // 尝试按关键词分割
      for (let keyword of originKeywords) {
        const originIndex = detail.indexOf(keyword);
        if (originIndex !== -1) {
          // 找到起源部分的开始位置
          const originStart = originIndex;
          // 尝试找到活动部分的开始位置
          for (let actKeyword of activityKeywords) {
            const activityIndex = detail.indexOf(actKeyword, originStart + keyword.length);
            if (activityIndex !== -1) {
              origin = detail.substring(originStart, activityIndex).trim();
              activity = detail.substring(activityIndex).trim();
              break;
            }
          }
          // 如果没有找到活动部分，将剩余内容作为活动部分
          if (activity === '暂无详细信息') {
            origin = detail.substring(originStart).trim();
          }
          break;
        }
      }
      
      // 如果还没找到起源部分，尝试直接按活动关键词查找
      if (origin === '暂无详细信息') {
        for (let actKeyword of activityKeywords) {
          const activityIndex = detail.indexOf(actKeyword);
          if (activityIndex !== -1) {
            activity = detail.substring(activityIndex).trim();
            origin = detail.substring(0, activityIndex).trim();
            break;
          }
        }
      }
    }
    
    // 如果还是没有找到，就将整个内容作为起源部分
    if (origin === '暂无详细信息' && activity === '暂无详细信息') {
      origin = detail;
    }
    
    return {
      origin: origin,
      activity: activity
    };
  },

  prevMonth: function() {
    let month = this.data.currentMonth - 1;
    let year = this.data.currentYear;
    
    if (month < 1) {
      month = 12;
      year--;
    }
    
    this.setData({
      currentMonth: month,
      currentYear: year
    }, () => {
      this.generateCalendar();
    });
  },

  nextMonth: function() {
    let month = this.data.currentMonth + 1;
    let year = this.data.currentYear;
    
    if (month > 12) {
      month = 1;
      year++;
    }
    
    this.setData({
      currentMonth: month,
      currentYear: year
    }, () => {
      this.generateCalendar();
    });
  }
});