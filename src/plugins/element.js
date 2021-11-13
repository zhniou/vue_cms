import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
// 导入消息提示
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 挂载消息提示到全局
Vue.prototype.$message = Message
