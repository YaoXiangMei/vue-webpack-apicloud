# vue-webpack-apicloud

## 特性
```
1. 多页面
2. 支持vuex
3. 能在浏览器上预览开发
```

## 视频演示
##### 启动
<video src="http://ad.qiniu.huishimed.com/1597228263918.mp4" width="480px" height="320px" controls="controls"></video>
##### 演示
<video src="http://ad.qiniu.huishimed.com/1597228263918.mp4" width="480px" height="320px" controls="controls"></video>



## 使用步骤说明
```
这里使用vscode编辑器做为例子

1. 安装扩展APICloud，然后在该扩展的设置中将Apicloud: Subdirectories设置为"/dist"
2. yarn install
3. yarn run serve_before（生成dist目录，第一次才需要执行此命令）
4. yarn run serve 启动项目
5. 在生成dist目录中找到config.xml文·件修改content字段的src为你本地的服务的地址(如：http://192.168.1.123:8080/main_index.html,"http://192.168.1.123:8080"是我本地的服务，你要改成你自己的),或者你在执行步骤2之前在src/config/development.xml修改也是可以的
6. 启动wifi服务
```
## 目录结构说明
```
├── .editorconfig
├── .env.development - 开发环境配置
├── .env.production - 生成环境配置
├── .env.test - 测试环境配置
├── .eslintignore
├── .eslintrc.js
├── babel.config.js
├── dist - 开发目录
├── src
│   ├── api
│   │   ├── api.js - 接口（使用了https://cnodejs.org/的api接口）
│   │   └── http.js - 参照axios封装了api.ajax,axios怎么用这边就怎么用
│   ├── assets
│   │   └── images - 图片文件
│   ├── components
│   │   ├── mescroll.vue - 使用mescroll.js封装了下拉刷新和上拉加载更多组件
│   │   ├── native_scroll.vue - 封装了原生的下拉刷新和上拉加载更多组件
│   │   └── nav.vue
│   ├── config - config.xml配置文件
│   │   ├── development.xml - 开发环境
│   │   ├── production.xml - 生产环境
│   │   └── test.xml - 测试环境
│   ├── main.js - 公共的入口文件，每个页面都会引入
│   ├── plugins
│   │   ├── lib
│   │   │   ├── api.js  - apicloud提供分$api
│   │   │   └── native_api.js - native_api.js - 在浏览器上预览时模拟apicloud sdk的api对象
│   │   ├── tools.js - 一些工具函数
│   │   └── types
│   │       ├── event.js - 放一些全局的自定义事件的name
│   │       └── prefs.js - 放api.setPrefs的key
│   ├── store - vuex
│   │   ├── index.js
│   │   ├── modules
│   │   │   └── user.js
│   │   └── mutation-types.js
│   ├── styles  - 样式文件
│   │   └── common.scss
│   └── views - 页面
├── vue.config.js - vuecli配置
├── widget - 构建后的文件

```
