import {SuDialog} from './index.js';

let $dialog = new SuDialog({
    el: '#app',
    style: {
        width: '500px',
        height: '500px'
    },
    buttons: [{
        text: '确定',
        handler() {
            console.log('确定', this);
        }
    }, {
        text: '取消',
        handler() {
            console.log('取消', this);
        }
    }]
});

console.log($dialog);