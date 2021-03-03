import sa from 'sa-sdk-javascript'
let Log = {}

/**
 * 发送 1 条统计事件，把这条统计事件分发到神策
 *
 */
Log.push = function (args) {
    // debug('log.push', args);
    // if (isBrowser === false) { return; }
    if (args[1] == '') {
        sa.track(args[0])
    } else {
        try {
            let paramObj = compileParam(args[1])
            sa.track(args[0], paramObj)
        } catch (e) {

        }
    }


    // sa.track(args[0], args[3])
};

let compileParam = function (param) {
    if (param == '' || param == null || param == undefined) return param;
    let arr = param.split("&");
    let obj = {}
    arr.forEach(function (v, i) {
        let arr1 = v.split("=");
        obj[arr1[0]] = arr1[1];
    })
    return obj;
}

/**
 * 生成1个统计事件监听函数，要么是focus、要么是click，更多的事件需要的时候再支持
 *
 * @param {String} _eventType 需要处理哪种类型的事件
 * @param {Boolean} isGaEnabled 透传的参数
 * @return Function
 */
var getEventHandler = function (_eventType) {
    return function (eventTarget) {
        // // 拿到事件发生的节点
        // var eventTarget = e.target,
        var eventType = eventTarget.getAttribute('vkshop-event-type') || 'click',
            eventParam = eventTarget.getAttribute('vkshop-event-param') || '',//:vkshop-event-param="'coursePackId=' + chooseCourse.coursePackId"
            eventName = eventTarget.getAttribute('vkshop-event-name').replace(/(^\s*)|(\s*$)/g, '');

        if (eventName && eventType === _eventType) { // 判断vkshop-event-name 是否为空，并且类型匹配
            // 获取页面层级属性
            var scopes = [eventName];
            var event = getParents(eventTarget, 'vkshop-event-scope')
            if (event !== undefined) {
                var scope = event.getAttribute('vkshop-event-scope').replace(/(^\s*)|(\s*$)/g, '')
                if (scope) { // 判断vkshop-event-scope 是否为空
                    scopes.push(scope);
                }
                scopes.reverse();
                // 最前面说明来源是h5
                Log.push(['$WebClick_员福项目_' + scopes.join('_'), eventParam]);
                
            }

        }
    };
};
/**
 * 原生获取父元素
 * @param {*} el 
 * @param {*} attr 属性，符合条件的属性
 */
function getParents(el, attr) {
    var parent = el.parentNode
    if (parent && parent.nodeName == 'BODY') {
        if (parent.hasAttribute(attr)) {
            return parent
        } else {
            return
        }
    } else {
        if (parent) {
            // list.push(parent)
            // 避免有多个vkshop-event-scope
            if (parent.hasAttribute(attr)) {
                return parent
            } else {
                return getParents(parent, attr)
            }
        } else {
            return
        }
    }
}

/**
 * 利用事件委托对所有需要自动发送统计事件的节点进行监听，只能初始化一次
 */
var isInitialized = false;
Log.init = function () {
    var ndBody = document.querySelector('body');
    var ndNoBubble = document.querySelectorAll('[vkshop-event-no-bubble]');
    // 处理可以冒泡的节点
    ndBody.addEventListener('click', function (e) {
        // 处理选择符(这样不好，如果一个a标签里面有图片和文字，点击到其他应该触发到a标签的)
        if (e.target.hasAttribute('vkshop-event-name')) {
            getEventHandler('click')(e.target)
        } else {
            var event = getParents(e.target, 'vkshop-event-name')
            if (event !== undefined) {
                getEventHandler('click')(event)
            }
        }
    });

    // 处理无法冒泡到顶层的结点点击
    if (ndNoBubble && ndNoBubble.length > 0) {
        ndNoBubble.addEventListener('click', getEventHandler('click'));
    }

    // }

};

export default Log