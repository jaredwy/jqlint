
function parseSelector(selector) {
    return selector.split(/\s*([ >+])\s*/);
}

function isJQueryCall(node) {
    return node.length > 2 && node[0] == 'call' && node[1][0] == 'name' && ['$', 'jQuery'].indexOf(node[1][1]) != -1 && node[2][0][0] == 'string';
}

function findJQuerySelectors(tree, statement) {
    if(tree && tree.constructor == Array) {
        // [ 'call', [ 'name', '$' ], [ [ 'string', 'p' ] ] ]
        if(isJQueryCall(tree)) {
            return {
                selector: parseSelector(tree[2][0][1]),
                statement: statement
            };
        }
        return [].concat.apply([], tree.map(function(n) {
            statement = tree.length && tree[0].name ? tree[0] : statement;
            return findJQuerySelectors(n, statement);
        }));
    }
    return [];
}


var ast = parsejs.parse("$('p')\n$('div #test')\n$($('ul > li'))", false, true)[1];
var nodes = findJQuerySelectors(ast);

console.log(JSON.stringify(nodes));
