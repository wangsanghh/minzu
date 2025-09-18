Page({
  data: {
    nation: {},
    detailSections: [],
    loading: true
  },

  onLoad: function (options) {
    // 获取传递的民族ID和名称
    const nationId = options.id;
    const nationName = options.name;
    
    // 设置基本信息
    this.setData({
      nation: {
        id: nationId,
        name: nationName
      }
    });
    
    // 调用deepseekapi获取详细信息
    this.getDeepDetail(nationName);
  },

  // 调用deepseekapi获取详细信息
  getDeepDetail: function(nationName) {
    // 模拟调用deepseekapi的过程
    // 实际开发中这里会是真实的API调用
    setTimeout(() => {
      // 模拟API返回的数据
      const mockData = [
        {
          title: "历史渊源",
          content: `${nationName}有着悠久的历史，其起源可以追溯到古代。经过长期的发展和演变，形成了独特的民族特色和文化传统。`
        },
        {
          title: "地理分布",
          content: `${nationName}主要分布在中国的特定区域，这些地区具有独特的地理环境和气候条件，为民族的生存和发展提供了良好的自然条件。`
        },
        {
          title: "语言文字",
          content: `${nationName}拥有自己独特的语言系统，在某些情况下还有自己的文字。这些语言文字承载着丰富的文化内涵，是民族文化传承的重要载体。`
        },
        {
          title: "宗教信仰",
          content: `${nationName}的宗教信仰多种多样，包括传统宗教、佛教、道教等。这些信仰深刻影响着民族的生活方式和价值观念。`
        },
        {
          title: "文学艺术",
          content: `${nationName}拥有丰富的文学艺术传统，包括史诗、民间故事、音乐、舞蹈、绘画等。这些艺术形式反映了民族的审美观念和精神追求。`
        },
        {
          title: "传统医学",
          content: `${nationName}传统医学是中华医学宝库的重要组成部分，具有独特的理论体系和治疗方法，在某些疾病的治疗方面具有显著效果。`
        }
      ];
      
      this.setData({
        detailSections: mockData,
        loading: false
      });
    }, 2000); // 模拟2秒的加载时间
  }
});