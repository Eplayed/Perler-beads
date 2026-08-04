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
  }
]

export function getGalleryPattern(patternId) {
  return GALLERY_PATTERNS.find((item) => item.id === patternId)
}
