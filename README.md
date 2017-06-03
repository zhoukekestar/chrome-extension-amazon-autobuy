## Amazon自动刷单插件
* V1版本视频：[查看视频](https://zhoukekestar.github.io/chrome-extension-amazon-autobuy/v1/index.html)
* [以issue 1为要求](https://github.com/zhoukekestar/chrome-extension-amazon-autobuy/issues/1)的Demo版本[视频](http://pan.baidu.com/s/1o8Ncz7k)

## 注意事项
* `免责声明`: 该插件仅供技术交流，请勿用于商业及非法用途，如产生法律纠纷与本人无关。
* 流程中，若处理不当或过于频繁等原因，极有可能无法通过人机验证（包括但不限于数字图形验证、语音验证等等）而导致插件无法工作。因人机验证导致插件无法工作的，暂无能力予以解决，望理解。
* 个人态度：个人不是很喜欢以这种方式去经营一家店。原则上，可以自己阅读源码（写得虽然不好，但掌握了核心思想，问题不大。ps: 毕竟很久以前了）实现自己需要的功能。如有其他疑问，可以做其他`技术上`的交流。

## 可优化方案
* 获取代理IP地址，然后设置代理IP。这样，可以避免使用VPN和脚本精灵。
* 设置代理IP后，需判断可用性，和检测网页网络的联通性。
* 输入目标关键字前，可以先浏览网页给出的推荐关键字。
* 使用ES6/ES7语法，简化异步输入关键词，优化项目结构和减少异步控制代码。


## V1版本视频部分截图

| 配置参数 | 登陆 | 搜索指定商品 |
| -- | -- | -- |
| ![step-1](./v1/images/step%20(1).png) | ![step-2](./v1/images/step%20(2).png) | ![step-3](./v1/images/step%20(3).png) |
| 添加到购物车 | 填写收货地址 | 支付（礼品卡加信用卡） |
| ![step-4](./v1/images/step%20(4).png) | ![step-5](./v1/images/step%20(5).png) | ![step-6](./v1/images/step%20(6).png) |
| 支付成功并保持id |
| ![step-7](./v1/images/step%20(7).png) |
