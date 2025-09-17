Page({
  data: {
    calendarDays: [],
    selectedEvent: null,
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
    // 民族节日数据，按月份分类
    ethnicFestivals: {
      1: [
        { day: 1, nation: '汉族', festival: '元旦' },
        { day: 15, nation: '汉族', festival: '元宵节' }
      ],
      2: [
        { day: 2, nation: '汉族', festival: '龙抬头' }
      ],
      3: [
        { day: 3, nation: '壮族', festival: '三月三歌节' }
      ],
      4: [
        { day: 10, nation: '傣族', festival: '泼水节' }
      ],
      5: [
        { day: 5, nation: '汉族', festival: '端午节' }
      ],
      6: [
        { day: 24, nation: '彝族', festival: '火把节' }
      ],
      7: [
        { day: 7, nation: '汉族', festival: '七夕节' }
      ],
      8: [
        { day: 15, nation: '汉族', festival: '中秋节' }
      ],
      9: [
        { day: 9, nation: '汉族', festival: '重阳节' }
      ],
      10: [
        { day: 1, nation: '汉族', festival: '国庆节' }
      ],
      11: [
        { day: 11, nation: '苗族', festival: '苗年节' }
      ],
      12: [
        { day: 25, nation: '汉族', festival: '圣诞节' }
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
      description: `这是${eventInfo.nation}的传统节日${eventInfo.festival}，体现了该民族独特的文化特色和传统习俗。`
    };
    
    this.setData({
      selectedEvent: eventDetail
    });
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