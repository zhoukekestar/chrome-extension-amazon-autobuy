## Amazon自动刷单插件
* V1版本视频：[查看视频](https://zhoukekestar.github.io/chrome-extension-amazon-autobuy/v1/index.html)
* [以issue 1为要求](https://github.com/zhoukekestar/chrome-extension-amazon-autobuy/issues/1)的Demo版本[视频](http://pan.baidu.com/s/1o8Ncz7k)

# V2
## 优化点
* 采用Excel + 拖拽 配置，数据处理和配置更方便。
* 采用ES6/ES7 特性，代码更简洁，维护更方便。
* （可选）集成IP代理，无需额外的程序或插件，一个就搞定, 避免使用外部VPN和脚本精灵。
* 设置代理IP后，需判断可用性，和检测网页网络的联通性。
* 输入目标关键字前，可以先浏览网页给出的推荐关键字。

右击图片打开，查看大图~ 并已开源[部分源码](./v2/tasks.js).

| 打开设置页面 | 设置页面|
| -- | -- |
| ![step-1](./v2/images/step%20(1).png) | ![step-2](./v2/images/step%20(2).png) |
| 拖动Excel到配置页面 | 显示并保存配置 |
| ![step-3](./v2/images/step%20(3).png) |![step-4](./v2/images/step%20(4).png) |
|  开启刷单开关 | 登陆测试 |
|  ![step-5](./v2/images/step%20(5).png) | ![demo.gif](./v2/images/demo.gif) |


## V1版本视频部分截图

| 配置参数 | 登陆 | 搜索指定商品 |
| -- | -- | -- |
| ![step-1](./v1/images/step%20(1).png) | ![step-2](./v1/images/step%20(2).png) | ![step-3](./v1/images/step%20(3).png) |
| 添加到购物车 | 填写收货地址 | 支付（礼品卡加信用卡） |
| ![step-4](./v1/images/step%20(4).png) | ![step-5](./v1/images/step%20(5).png) | ![step-6](./v1/images/step%20(6).png) |
| 支付成功并保持id |
| ![step-7](./v1/images/step%20(7).png) |

## 注意事项
* `免责声明`: 该插件仅供技术交流，请勿用于商业及非法用途，如产生法律纠纷与本人无关。
* 流程中，若处理不当或过于频繁等原因，极有可能无法通过人机验证（包括但不限于数字图形验证、语音验证等等）而导致插件无法工作。因人机验证导致插件无法工作的，暂无能力予以解决，望理解。
* 个人态度：个人不是很喜欢以这种方式去经营一家店。原则上，可以自己阅读源码（写得虽然不好，但掌握了核心思想，问题不大。ps: 毕竟很久以前了）实现自己需要的功能。如有其他疑问，可以做其他`技术上`的交流。

## 合作
如果有兴趣的话，可以在[猪八戒网站](http://www.zbj.com/)开一个`类似的需求`，然后通知我，走猪八戒的外包流程。

这样需求可以更明确，流程也会相对正规，如果有可能的话，也可以让其他人也参与你的需求，合理公平竞争，也节约各方的时间成本。
