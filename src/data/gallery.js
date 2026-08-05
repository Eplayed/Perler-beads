export const GALLERY_PATTERNS = [
  {
    id: 'chick',
    title: '小鸡挂件',
    subtitle: '适合入门挂件',
    size: '24x24',
    colors: 6,
    effectImage: '/static/patterns/chick-effect.png',
    patternImage: '/static/patterns/chick-pattern.png',
    source: '自制样例'
  },
  {
    id: 'frog',
    title: '青蛙头像',
    subtitle: '表情包风格',
    size: '24x24',
    colors: 5,
    effectImage: '/static/patterns/frog-effect.png',
    patternImage: '/static/patterns/frog-pattern.png',
    source: '自制样例'
  },
  {
    id: 'watermelon',
    title: '西瓜杯垫',
    subtitle: '夏日小物',
    size: '24x24',
    colors: 5,
    effectImage: '/static/patterns/watermelon-effect.png',
    patternImage: '/static/patterns/watermelon-pattern.png',
    source: '自制样例'
  },
  {
    id: 'cloud-lime',
    title: '云朵青柠',
    subtitle: '清爽挂件',
    size: '24x24',
    colors: 6,
    effectImage: '/static/patterns/cloud-lime-effect.png',
    patternImage: '/static/patterns/cloud-lime-pattern.png',
    source: '自制样例'
  },
  {
    id: 'flower',
    title: '彩色小花',
    subtitle: '小朋友友好',
    size: '24x24',
    colors: 8,
    effectImage: '/static/patterns/flower-effect.png',
    patternImage: '/static/patterns/flower-pattern.png',
    source: '自制样例'
  },
  {
    id: 'cat',
    title: '奶油小猫',
    subtitle: '萌系头像',
    size: '24x24',
    colors: 4,
    effectImage: '/static/patterns/cat-effect.png',
    patternImage: '/static/patterns/cat-pattern.png',
    source: '自制样例'
  },
  {
    id: 'strawberry',
    title: '草莓挂件',
    subtitle: '热门水果挂件',
    size: '24x24',
    colors: 5,
    effectImage: '/static/patterns/strawberry-effect.png',
    patternImage: '/static/patterns/strawberry-pattern.png',
    source: '原创热门风格'
  },
  {
    id: 'bow',
    title: '粉色蝴蝶结',
    subtitle: '甜酷装饰小物',
    size: '24x24',
    colors: 4,
    effectImage: '/static/patterns/bow-effect.png',
    patternImage: '/static/patterns/bow-pattern.png',
    source: '原创热门风格'
  },
  {
    id: 'bear',
    title: '小熊头像',
    subtitle: '萌宠头像',
    size: '24x24',
    colors: 4,
    effectImage: '/static/patterns/bear-effect.png',
    patternImage: '/static/patterns/bear-pattern.png',
    source: '原创热门风格'
  },
  {
    id: 'tulip',
    title: '郁金香',
    subtitle: '花束挂件',
    size: '24x24',
    colors: 5,
    effectImage: '/static/patterns/tulip-effect.png',
    patternImage: '/static/patterns/tulip-pattern.png',
    source: '原创热门风格'
  },
  {
    id: 'mushroom',
    title: '红蘑菇',
    subtitle: '复古小图案',
    size: '24x24',
    colors: 4,
    effectImage: '/static/patterns/mushroom-effect.png',
    patternImage: '/static/patterns/mushroom-pattern.png',
    source: '原创热门风格'
  },
  {
    id: 'coffee',
    title: '咖啡杯',
    subtitle: '生活方式小物',
    size: '24x24',
    colors: 5,
    effectImage: '/static/patterns/coffee-effect.png',
    patternImage: '/static/patterns/coffee-pattern.png',
    source: '原创热门风格'
  },
  {
    id: 'duck',
    title: '小鸭子',
    subtitle: '可爱动物挂件',
    size: '24x24',
    colors: 5,
    effectImage: '/static/patterns/duck-effect.png',
    patternImage: '/static/patterns/duck-pattern.png',
    source: '原创热门风格'
  },
  {
    id: 'whale',
    title: '小鲸鱼',
    subtitle: '海洋系头像',
    size: '24x24',
    colors: 5,
    effectImage: '/static/patterns/whale-effect.png',
    patternImage: '/static/patterns/whale-pattern.png',
    source: '原创热门风格'
  },
  {
    id: 'star',
    title: '微笑星星',
    subtitle: '表情挂件',
    size: '24x24',
    colors: 4,
    effectImage: '/static/patterns/star-effect.png',
    patternImage: '/static/patterns/star-pattern.png',
    source: '原创热门风格'
  },
  {
    id: 'heart',
    title: '爱心挂件',
    subtitle: '情侣手作小物',
    size: '24x24',
    colors: 4,
    effectImage: '/static/patterns/heart-effect.png',
    patternImage: '/static/patterns/heart-pattern.png',
    source: '原创热门风格'
  }
]

export function getGalleryPattern(patternId) {
  return GALLERY_PATTERNS.find((item) => item.id === patternId)
}
