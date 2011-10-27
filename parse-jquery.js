var parsejs = require('./parse-js');

function isJQueryCall(node) {
    return node.length > 2 && node[0] == 'call' && node[1][0] == 'name' && ['$', 'jQuery'].indexOf(node[1][1]) != -1 && node[2][0][0] == 'string';
}

function findJQuerySelectors(tree) {
    if(tree.constructor == Array) {
        if(isJQueryCall(tree)) {
            return tree[2][0][1];
        }
        return [].concat.apply([], tree.map(findJQuerySelectors));
    }
    return [];
}


var ast = parsejs.parse("$('p')\n$('#test')\n$($('test'))")[1];
var selectors = findJQuerySelectors(ast);

console.log(selectors);
