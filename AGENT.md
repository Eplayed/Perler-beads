# 拼豆图纸工坊 — Agent 开发规范

## 项目目标

做一个个人主体可上线、靠流量主变现的微信小程序：图片转拼豆图纸、色号统计、制作进度和本地作品库。

## 目录

```text
src/
  pages/
    home/       首页
    create/     图片转图纸
    editor/     编辑、制作、导出
    projects/   作品库
    palette/    色板
    mine/       我的与增长说明
  data/
    palettes.js 色板
  utils/
    beadPattern.js 核心算法
    projects.js    本地作品存储
    share.js       通用反馈
```

## 开发原则

- 保持离线可用，优先本地 canvas 和本地存储。
- 不加入支付、会员、商城、社区投稿等个人主体高风险能力。
- UI 要服务图纸制作，不做营销式落地页。
- 修改后至少运行 `npm run build:mp-weixin`。

## 构建

```bash
npm install --legacy-peer-deps
npm run build:mp-weixin
```

使用微信开发者工具打开 `dist/build/mp-weixin`。
