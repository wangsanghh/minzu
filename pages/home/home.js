Page({
  data: {
    searchValue: '',
    nations: [
      { id: 1, name: '汉族', icon: '../../images/nation/1.png' },
      { id: 2, name: '壮族', icon: '../../images/nation/2.png' },
      { id: 3, name: '满族', icon: '../../images/nation/3.png' },
      { id: 4, name: '回族', icon: '../../images/nation/4.png' },
      { id: 5, name: '苗族', icon: '../../images/nation/5.png' },
      { id: 6, name: '维吾尔族', icon: '../../images/nation/6.png' },
      { id: 7, name: '土家族', icon: '../../images/nation/7.png' },
      { id: 8, name: '彝族', icon: '../../images/nation/8.png' },
      { id: 9, name: '蒙古族', icon: '../../images/nation/9.png' },
      { id: 10, name: '藏族', icon: '../../images/nation/10.png' },
      { id: 11, name: '布依族', icon: '../../images/nation/11.png' },
      { id: 12, name: '侗族', icon: '../../images/nation/12.png' },
      { id: 13, name: '瑶族', icon: '../../images/nation/13.png' },
      { id: 14, name: '朝鲜族', icon: '../../images/nation/14.png' },
      { id: 15, name: '白族', icon: '../../images/nation/15.png' },
      { id: 16, name: '哈尼族', icon: '../../images/nation/16.png' },
      { id: 17, name: '哈萨克族', icon: '../../images/nation/17.png' },
      { id: 18, name: '黎族', icon: '../../images/nation/18.png' },
      { id: 19, name: '傣族', icon: '../../images/nation/19.png' },
      { id: 20, name: '畲族', icon: '../../images/nation/20.png' },
      { id: 21, name: '傈僳族', icon: '../../images/nation/21.png' },
      { id: 22, name: '仡佬族', icon: '../../images/nation/22.png' },
      { id: 23, name: '东乡族', icon: '../../images/nation/23.png' },
      { id: 24, name: '高山族', icon: '../../images/nation/24.png' },
      { id: 25, name: '拉祜族', icon: '../../images/nation/25.png' },
      { id: 26, name: '水族', icon: '../../images/nation/26.png' },
      { id: 27, name: '佤族', icon: '../../images/nation/27.png' },
      { id: 28, name: '纳西族', icon: '../../images/nation/28.png' },
      { id: 29, name: '羌族', icon: '../../images/nation/29.png' },
      { id: 30, name: '土族', icon: '../../images/nation/30.png' },
      { id: 31, name: '仫佬族', icon: '../../images/nation/31.png' },
      { id: 32, name: '锡伯族', icon: '../../images/nation/32.png' },
      { id: 33, name: '柯尔克孜族', icon: '../../images/nation/33.png' },
      { id: 34, name: '达斡尔族', icon: '../../images/nation/34.png' },
      { id: 35, name: '景颇族', icon: '../../images/nation/35.png' },
      { id: 36, name: '毛南族', icon: '../../images/nation/36.png' },
      { id: 37, name: '撒拉族', icon: '../../images/nation/37.png' },
      { id: 38, name: '布朗族', icon: '../../images/nation/38.png' },
      { id: 39, name: '塔吉克族', icon: '../../images/nation/39.png' },
      { id: 40, name: '阿昌族', icon: '../../images/nation/40.png' },
      { id: 41, name: '普米族', icon: '../../images/nation/41.png' },
      { id: 42, name: '鄂温克族', icon: '../../images/nation/42.png' },
      { id: 43, name: '怒族', icon: '../../images/nation/43.png' },
      { id: 44, name: '京族', icon: '../../images/nation/44.png' },
      { id: 45, name: '基诺族', icon: '../../images/nation/45.png' },
      { id: 46, name: '德昂族', icon: '../../images/nation/46.png' },
      { id: 47, name: '保安族', icon: '../../images/nation/47.png' },
      { id: 48, name: '俄罗斯族', icon: '../../images/nation/48.png' },
      { id: 49, name: '裕固族', icon: '../../images/nation/49.png' },
      { id: 50, name: '乌孜别克族', icon: '../../images/nation/50.png' },
      { id: 51, name: '门巴族', icon: '../../images/nation/51.png' },
      { id: 52, name: '鄂伦春族', icon: '../../images/nation/52.png' },
      { id: 53, name: '独龙族', icon: '../../images/nation/53.png' },
      { id: 54, name: '塔塔尔族', icon: '../../images/nation/54.png' },
      { id: 55, name: '赫哲族', icon: '../../images/nation/55.png' },
      { id: 56, name: '珞巴族', icon: '../../images/nation/56.png' }
    ]
  },

  onSearchInput: function(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  onSearchConfirm: function(e) {
    const searchValue = e.detail.value;
    if (searchValue) {
      wx.showToast({
        title: '搜索: ' + searchValue,
        icon: 'none'
      });
      // 这里可以添加实际的搜索逻辑
    }
  },

  onNationTap: function(e) {
    const nationId = e.currentTarget.dataset.id;
    // 跳转到民族详情页面
    wx.navigateTo({
      url: '../nationDetail/nationDetail?id=' + nationId
    });
  },

  onLoad: function() {
    // 页面加载时的初始化逻辑
  }
});