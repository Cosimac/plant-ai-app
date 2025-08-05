import { Component } from 'react'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

interface AppProps {
  children: React.ReactNode;
}

class App extends Component<AppProps> {
  componentDidMount (): void {}

  componentDidShow (): void {}

  componentDidHide (): void {}

  componentDidCatchError (): void {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render (): React.ReactNode {
    return this.props.children
  }
}

export default App 