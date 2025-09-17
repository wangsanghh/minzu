Page({
  data: {
    calendarDays: [],
    selectedEvent: null,
    currentMonth: 9,
    currentYear: 2025
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
        hasEvent: false
      });
    }
    
    // 添加实际日期
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${this.data.currentYear}-${this.data.currentMonth.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const isToday = (i === 17 && this.data.currentMonth === 9 && this.data.currentYear === 2025); // 假设今天是2025年9月17日
      
      calendarDays.push({
        day: i,
        date: dateStr,
        isToday: isToday,
        hasEvent: this.hasEvent(i)
      });
    }
    
    this.setData({
      calendarDays: calendarDays
    });
  },

  hasEvent: function(day) {
    // 模拟某些日期有民族节日
    const eventDays = [10, 15, 22, 28];
    return eventDays.includes(day);
  },

  onDayTap: function(e) {
    const date = e.currentTarget.dataset.date;
    if (!date) return;
    
    // 模拟节日详情
    const events = {
      '2025-09-10': {
        title: '教师节',
        date: '2025年9月10日',
        description: '教师节是为教师设立的节日，旨在肯定教师为教育事业所做的贡献。'
      },
      '2025-09-15': {
        title: '白露',
        date: '2025年9月15日',
        description: '白露是二十四节气中的第十五个节气，表示孟秋时节的结束和仲秋时节的开始。'
      },
      '2025-09-22': {
        title: '秋分',
        date: '2025年9月22日',
        description: '秋分是二十四节气中的第十六个节气，昼夜平分，此后北半球昼短夜长。'
      },
      '2025-09-28': {
        title: '孔子诞辰',
        date: '2025年9月28日',
        description: '孔子诞辰纪念日，纪念伟大的思想家、教育家孔子的诞生。'
      }
    };
    
    if (events[date]) {
      this.setData({
        selectedEvent: events[date]
      });
    }
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