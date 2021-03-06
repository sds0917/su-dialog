import {SuDialog} from './index.js';

let $dialog = new SuDialog({
    el: '#dialog',
    title: '新轮子',
    content: '<img src="/static/ewm.png" width="200" style="position: absolute;top: calc((100% - 200px) / 2);left: calc((100% - 200px) / 2);" />',
    style: {
        width: '500px',
        height: '500px'
    },
    buttons: [{
        text: '确定',
        handler(event, $dialog) {
            console.log('确定', $dialog);
        }
    }, {
        text: '取消',
        handler() {
            console.log('取消', $dialog);
        }
    }],
    onBeforeClose() {
        console.log('onBeforeClose');
    },
    onClose() {
        console.log('onClose');
    }
});

document.querySelector('#button').onclick = function () {
    console.log($dialog);
    $dialog._open();
};