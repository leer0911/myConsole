# Ts + React + Mobx 实现移动端浏览器控制台

自从使用 Typescript 写 H5 小游戏后，就对 Ts 产生了依赖（智能提示以及友好的重构提示），但对于其 **Type System** 还需要更多的实践。

最近开发 H5 小游戏，在移动端调试方面，为求方便没有采用 inspect 的模式。用的是粗暴的 [vConsole](https://github.com/Tencent/vConsole)，用人家东西要学会感恩，所以决定去了解它的原理，最后用 Ts + React 码一个**移动端浏览器控制台**，算是 **Ts + React 实战**。

通过该教程可以学习：

- **Ts + React + Mobx 开发流程**
- 基本的 Type System
- 一些 JavaScript 基础概念
- 浏览器控制台相关知识
  - Console
  - NetWork、XHR
  - Storage
  - **DevTool 核心渲染代码**

[项目源码](https://github.com/leer0911/myConsole) 供上， 第一次用 Typescript + React 码项目，**记录迭代的过程，有兴趣入坑的可 star 一下** 期待 CodeReview。

## 开始

本着快速开发的理念（本人要带娃），于是基于 [Create React App](https://github.com/facebookincubator/create-react-app) 脚手架搭建项目，UI 框架使用了同样采用
Ts 编写的 [AntMobile](https://github.com/ant-design/ant-design-mobile/)。 开始项目讲解前，显然需要对这两个有一定的了解 ( 建议可作为进一步学习 Ts + React 的参考 )

下面，先来看下预览图片

<img src="https://raw.githubusercontent.com/leer0911/myConsole/release/doc/imgs/preview1.png" width = "300px" />

UI 很简单，按功能划分为

- Log 、 System
- Network
- Elemnet
- Storage

**主要从以上这几个功能模块展开**

<small> PS: 教程会略过一些，诸如如何支持 stylus （ 项目执行过 yarn run eject ），interface 要不要加 I，render 要不要 Public， 如何去除一些 Tslint 等。（ 跟踪文件 git history 可略知一二 ）PWA 等</small>

## 基本代码风格

通篇会按这种风格 ( 并不是最佳实践 ) 去编写组件，（ 比较少无状态组件，也没有高阶组件的应用 ）。

```ts
import React, { Component } from 'react';

interface Props {
  // props type here
}

interface State {
  // state type here
}

export default class ClassName extends Component<Props, State> {
  // state: State = {...}; 我更喜欢将 state 写在这。

  constructor(props: Props) {
    super(props);
    this.state = {
      // some state
    };
  }

  // some methods...

  render() {
    // return
  }
}
```

## Log

调试控制台最常用是 Log，与之不可分割的 API 就是 `window.console` 。常用的方法有`['log', 'info', 'warn', 'debug', 'error']`。UI 表现上可分为 Log，Warn，Error 三类。

**如何自己实现一个控制台 `console` 面板呢？** 其实很简单，只需要 “重写” `window.console` 对应的这些方法，然后再调用系统自带的 `console` 方法即可。这样你就可以实现在原有方法基础上附加一些你想要的操作。（ 可惜这么做会有一些副作用，后面会讲到。 ）

代码逻辑如下：

```ts
const methodList = ['log', 'info', 'warn', 'debug', 'error'];

methodList.map(method => {
  // 1. 保存 window 自带 console 方法。
  this.console[method] = window.console[method];
});

methodList.map(method => {
  window.console[method] = (...args: any[]) => {
    // 2. 做一些保存数据及展示的操作。

    // 3. 调用原生 console 方法。
    this.console[method].apply(window.console, infos);
  };
});
```

由于项目我们用的是 React ，由于是数据驱动，所以只需要关心数据即可。

在 Log 中的数据，其实就是 `console.log(参数)` 中的参数，再将这些参数用 mobx 以数组的形式统一管理后交由 List 组件渲染。

```ts
import { observable, action, computed } from 'mobx';

export interface LogType {
  logType: string;
  infos: any[]; // 来自 console 方法的参数。
}

export class LogStore {
  @observable logList: LogType[] = [];
  @observable logType: string = 'All';

  // some action...
}

export default new LogStore();
```

数据和列表展示都有了，那么 **如何用树形结构展示基本数据类型与引用类型**

基本类型 ( undefined，null，string，number，boolean，symbol )展示比较简单，这边讲一下引用类型 （ Array，Object ）的展示实现。对应项目中就是 `logView` 组件。

### logView 组件

从之前的预览图片可以大致看到整个数据展示结构，都是 `key-value` 的形式。

<img src="https://raw.githubusercontent.com/leer0911/myConsole/release/doc/imgs/logview0.png" width = "300px" />

这里跟 Pc 端浏览器控制台不一样的是，没有展示 `__proto__` 相关的东西。然后，`function` 只是以方法名加括号的形式展示，如 `log()`。

接下来我们看下这个 UI 对应的 html 结构。

<img src="https://raw.githubusercontent.com/leer0911/myConsole/release/doc/imgs/logview.png" width = "300px" />

我们需要展示的就只是 key 和 value 以及父子缩进，典型的树形结构，递归可以搞定。

对于 `Object` 直接就是 `key-value` 而 `Array` 其实也是索引和值的对应关系。

基本逻辑：

```jsx
<li className="my-code-wrap">
  <div className="my-code-box">
    // 1. 判断是否需要显示展开图标
    {opener}
    <div className="my-code-key">
      // 2. 显示 key
      {name}
    </div>
    <div className="my-code-val">
      // 3. 根据值类型，选择其展示方式
      {preview}
    </div>
  </div>
  // 4. 如果是 Object 或 Array，则重复 1.
  {children}
</li>
```

至此一个简单的 log 展示逻辑就完成了。接下来说一下控制台里面的 JS 命令行执行。

```js
  sendCMD() {
    return (cmd: string) => {
      let result = void 0;
      try {
        result = eval.call(window, '(' + cmd + ')');
      } catch (e) {
        try {
          result = eval.call(window, cmd);
        } catch (e) {
          ;
        }
      }
      // mobx中的 action
      logStore.addLog({ logType: 'log', infos: [result] })
    }
  }
```

`eval()` 函数会将传入的字符串当做 JavaScript 代码进行执行。但他是一个危险的函数，他执行的代码拥有着执行者的权利。这里直接让用户传参，意味着用户可以决定执行什么样的代码(包括恶意代码)，所以**这种浏览器控制台是绝对不能出现在生产环境的**。

### 小结

log 的实现不难，就在原有 `winodw.console` 方法的基础上，添加参数收集功能，并交由 mobx 管理。再将参数通过树形结构的方式展示给用户。但是，这种方式可能造成非常多不必要的渲染，每次调用 console 方法 ( 包括 error 和 warning)，都会触发相应的 render ，如果在 log 组件的 render 方法里面调用 console 就会造成栈溢出 (相当于在 render 调用 setState)，不过好在这只是用于开发中的调试阶段，另外，对于线上 bug 排查，我们可以用 charles 代理的方式注入代码而无需影响原有代码。即便如此，前端自己实现的浏览器控制台还是无法跟原生控制台媲美的 (最多用来看下有没有报错，又不想使用麻烦的 [inspect 模式](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/?hl=zh-cn)) ，比如追踪调用栈，以及 `script error`。所以，**为什么要使用 Typescript**，很重要的一点是尽可能地在开发阶段规避一些 bug。但面对海量级用户，手机千奇百怪，这时就只能通过前端异常监控，专业的有 `fundebug` 或者自己[简单处理一下](http://www.alloyteam.com/2017/03/jserror1/)。扯远了，还是回到我们走马观花的下一部分 system 吧。

## System

system 主要用于展示浏览器端不太容易查看的信息，比如当前浏览器的用户代理（user agent）字符串或者当前真实的 URL (由于某些原因，URL 可能被修改)。当然这些要展示的信息跟业务以及需要调试的内容关联比较大，因此这个面板还是自定义比较。需要注意的是：**通过检测 `userAgent` 的值来判断浏览器类型是不可靠的**，也是不推荐的，因为用户可以修改 userAgent 的值。( 好在我们只是用来调试，面向的是开发者，而不是提供给其他白菜用户使用 )

PS: 作为扩展，可以使用 [特征检测](https://modernizr.com/) 来检测 web 特性的在手机浏览器上的 ( 包括某些客户端的 webview ) 支持情况，从而在开发阶段提早做一些降级处理！另外，如果需要的话，可以在 system 展示一些调用**客户端协议 (JSbridge) 相关的信息**。我们就此跳过吧，进入更为关心的下一部分 `network`。

## Network

接着来实现 `network`，开始前先来了解下 [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) ：

> 使用 XMLHttpRequest (XHR)对象可以与服务器交互。您可以从 URL 获取数据，而无需让整个的页面刷新。这使得 Web 页面可以只更新页面的局部，而不影响用户的操作。XMLHttpRequest 在 Ajax 编程中被大量使用。

比较重要的方法 `open`， `send`，`getAllResponseHeaders`，还有一些需要了解的属性 `onreadystatechange`，`readyState`，`status`，`response` 等，不了解的读者自行补习下。

我们如果要捕获用户发送请求并用于前端展示，需要用到 open 和 send 方法，监听变换需要用到 `onreadystatechange`

另外，`XMLHttpRequest.readyState` 属性返回的是一个 `XMLHttpRequest` 代理当前所处的状态。一个 XHR 代理总是处于下列状态中的一个：

| 值  | 状态             | 描述                                              |
| --- | :--------------: | ------------------------------------------------- |
| 0   | UNSENT           | 代理被创建，但尚未调用 open() 方法。              |
| 1   | OPENED           | open() 方法已经被调用。                           |
| 2   | HEADERS_RECEIVED | send() 方法已经被调用，并且头部和状态已经可获得。 |
| 3   | LOADING          | 下载中； responseText 属性已经包含部分数据。      |
| 4   | DONE             | 下载操作已完成。                                  |

了解这些基础知识后，来看下代码实现逻辑：

```ts
  mockAjax() {
    // 这里的 (window as any).XMLHttpRequest 我用的很虚。太粗暴了
    const XMLHttpRequest = (window as any).XMLHttpRequest;
    if (!XMLHttpRequest) {
      return;
    }
    const that = this;
    // 1、备份原生 XMLHttpRequest 的 open 和 send 方法
    const XHRnativeOpen = XMLHttpRequest.prototype.open;
    const XHRnativeSend = XMLHttpRequest.prototype.send;

    // 2、重写 open 方法
    XMLHttpRequest.prototype.open = function (...args: any) {
      // 3、获取 open 方法传入的参数
      const [method, url] = args;

      // 4、保存原有  onreadystatechange
      const userOnreadystatechange = this.onreadystatechange;

      this.onreadystatechange = function (...stateArgs: any) {
        // do something

        // 5、根据 readyState 做相应处理，主要是保存需要展示的数据，比如 response 和 header

        // 6、调用原有 onreadystatechange
        return (
          userOnreadystatechange &&
          userOnreadystatechange.apply(this, stateArgs)
        );
      };

      // 7、调用原生 XMLHttpRequest.open 方法
      return XHRnativeOpen.apply(this, args);
    };
    XMLHttpRequest.prototype.send = function (...args: any) {
      // 8、重写 XMLHttpRequest.send 方法并保存数据
      return XHRnativeSend.apply(this, args);
    };
  }
```

这样基本上就完成了 network 数据的收集，接下来就是表格展示的事了。但，撸完还是觉得过于粗暴，我码项目以来还是第一次修改 `prototype`，而且是 `XMLHttpRequest` 的，生怕对基础掌握的不够引发了更多的 bug。于是准备去看下 [axios](https://github.com/axios/axios) 的源码，看人家是怎么玩弄 ``XMLHttpRequest`` ，后看能不能优化一下。(后话了...) 这边需要说的是，如果使用 [fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch) 发送请求，就 GG 了。给了自己迭代足够的理由，( 当然前提是否有必要，万一我又去做 PC端了呢 !)

## Element

在用 vconsole 的时候，我就特别关心 element 面板究竟是怎么实现的。下面就让我们来撩一下：

回顾下 UI 界面

<img src="https://raw.githubusercontent.com/leer0911/myConsole/release/doc/imgs/element.png" width = "300px" />

如果数据来源是 `document.documentElement`，那不就是下图么!

<img src="https://raw.githubusercontent.com/leer0911/myConsole/release/doc/imgs/code.png" width = "500px" />

有必要的话，先熟悉下 [HTML5 标签](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5/HTML5_element_list)，和 [DOM Node](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)

这边我们只需要关心，三个类型的节点：元素, 文本 和 注释 ( 了解 [nodeType](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType))。

对于元素 (标签) 我们只需要知道两种不同的展示方式，自闭合标签以及非自闭合 (对于UI来说，仅仅是缩进的区别)，以及它们都是由标签名和属性组成，如：`<body style="background:#000"></body>` 或 `<img src="...">`。下面看下要实现这样一个 elemnt 的 html 结构是怎么样的：

<img src="https://raw.githubusercontent.com/leer0911/myConsole/release/doc/imgs/htmlcode.png" width = "500px" />

对应实现就是项目里的 `htmlView` 组件，主要的代码逻辑如下：

```ts

import { parseDOM } from 'htmlparser2';

// 1. 将 HTML 文本，解析为 JSON 格式
const tree = parseDOM(document.documentElement.outerHTML);


// 2. 转换为易于展示的 JSON 格式，并转换为 Immutable 数据

  getRoot() {
    const { tree, defaultExpandedTags } = this.props;

    transformNodes(tree, [], true);
    return Immutable.fromJS(tree[0]);

    function transformNodes(trees: any[], keyPath: any, initial?: boolean) {
      trees.forEach((node: any, i: number) => {
        // 3. 数据转换逻辑
      });
    }
  }

// 3. 根据 type 来区分渲染 UI

if (type === 'text' || type === 'comment') {

}

```

对于 `htmlparser2` 的转换规则可以看这个 [demo](https://astexplorer.net/#/2AmVrGuGVJ)，`htmlparser2`得到的数据可能并不适用于渲染，经过处理后最终用于渲染数据的结构如下：

<img src="https://raw.githubusercontent.com/leer0911/myConsole/release/doc/imgs/tree.png" />

依然是数据驱动的思路，剩下的就只是渲染的逻辑处理。

## Storage

Storage 实现也比较简单。前端比较关心的一般是 `localstorage` 和 `cookies`。它们都有自己的获取，修改，和清除方法。我们只需要拿到数据给表格渲染即可。

## 关于 Typescript

到目前为止，讲得更多的是控制台的实现思路。有点对不起标题党 `Ts + React + Mobx`，说实话，码玩这个项目发现并没有太多的技巧。在这聊一下我用 Typescript 的感受。正如文章一开是说的，最大的感受就是开发体验的改善。另外就是：

组件 props 和 state 的定义

```ts
// Ts 让代码更加易于阅读，只需要看组件这部分代码即可知道，
// 组件接受哪些属性以及其内部状态，并且可以知道他们都接受什么样的类型。

interface Props {
  togglePane: () => void;
  logList: LogType[]
}

interface State {
  searchVal: string
}

// 组件泛型
export default class ClassName extends PureComponent<Props, State> {
  // ...
}
```

其他常用 type，如果想了解 React 相关的 type 可以看[这里](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)
高质量的 [Type definitions](http://definitelytyped.org/)

```json
  "devDependencies": {
    "@types/jest": "^23.3.9",
    "@types/node": "^10.12.5",
    "@types/react": "^16.7.2",
    "@types/react-dom": "^16.0.9",
    "typescript": "^3.1.6"
  }
```

```tsx
// 获取 ref 上有所不同
export default class Log extends Component<Props, State> {
  private searchBarRef = createRef<SearchBar>()
  sendCMD = ()=> {
      this.searchBarRef.current!.focus()
  }
  render() {
    return (
      <Flex>
        <SearchBar
          ref={this.searchBarRef}
          onclic={this.sendCMD}
        />
      </Flex>
    );
  }
}
```

能总结的确实很少，对 Ts 中 type system 的感受就是少用 any。大概了解下常用的 React 和 window 的 type 即可。(在vscode 编辑器下。直接F12跳转到 window 或 React 定义处就可以看到所有的类型声明)

<img src="https://raw.githubusercontent.com/leer0911/myConsole/release/doc/imgs/type2.png" />

另外在不知道类型的时候，可以利用类型推断来获取类型。

<img src="https://raw.githubusercontent.com/leer0911/myConsole/release/doc/imgs/type.png" />

我也是刚开始用 Typescript ，说多错多!不误人子弟了，就总结到这吧。

## yarn run eject

使用 Create React App 脚手架创建完项目后，在 `package.json` 里面提供了这样一个命令

```json
{
  "scripts": {
    "eject": "react-scripts eject"
  }
}
```

执行完这个命令后，会将封装的配置全部反编译到当前项目，这样用户就可以完全取得webpack文件的控制权。出于学习目的，还是放出来比较好!

Create React App 水好深，适合单独拎出来研究!

## 总结

不得不承认，这是一个练手的项目。可能都完全不适合用 Ts + React 来做，只是希望自己跨出这一步，拥抱 Ts。教程通篇围绕 **前端如何实现浏览器控制台** 展开，比较少介绍 TS + React 技巧方面。可以说是一种比较保守的实现方式 ( 因为不确定是不是最佳实践 )，
希望抛砖引玉，有人可以 codeReview 下，不胜感激!另外，希望这篇教程有给大家带来一些知识扩展的作用。


## 参考

- [create-react-app](https://github.com/facebookincubator/create-react-app)
- [vConsole](https://github.com/Tencent/vConsole)
- [react-devtools](https://github.com/facebook/react-devtools)


