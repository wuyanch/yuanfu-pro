/* eslint-disable */
import { Message } from 'element-ui'

const showMessage = Symbol('showMessage')
/**
 * 封装element-ui message方法，只有在页面没有message或者没有相同message的情况下才弹出该message
 */
 export default class domMessage  {
    success (options, single = true) {
		this[showMessage]('success', options, single)
	}
	warning(options, single = true) {
		this[showMessage]('warning', options, single)
	}
	info(options, single = true) {
		this[showMessage]('info', options, single)
	}
	error(options, single = true) {
		this[showMessage]('error', options, single)
	}
	[showMessage] (type, options, single) {
		if (single) {
			// 关键代码，判断当前页是否有el-message标签，如果没有则执行弹窗操作
			if (document.getElementsByClassName('el-message').length === 0) {
				Message[type](options)
			}
		} else {
			Message[type](options)
		}
	}
}
