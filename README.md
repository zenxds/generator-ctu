# generator-ctu

ctu项目生成器

## install

```
npm install -g yo generator-ctu
```

## 使用

```
yo ctu
```

## 说明

目前支持以下几种项目类型

1. ES6
2. React
3. React SPA
4. NightKay App
5. H5运营
6. PC运营
7. Koa
8. Node Lib
9. React Lib
10. 组件库
11. 组件库组件

## 开发

配置说明
```
{
  name: "", // 模板名，非必填
  description: "", // 模板说明，必填
  mode: "", // 脚手架模式，非必填，目前只有 simple（简单模式，只下载解压模板）
  repository: "" // 外网可访问的模板压缩包地址地址，必填
}
```