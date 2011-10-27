function flatten(args) {
    return [].concat.apply([], args);
}

function isJQueryCall(node) {
    return node.length > 2 && node[0] == 'call' && node[1][0] == 'name' && ['$', 'jQuery'].indexOf(node[1][1]) != -1 && node[2][0][0] == 'string';
}

function findJQuerySelectors(tree, statement) {
    if(tree && tree.constructor == Array) {
        // [ 'call', [ 'name', '$' ], [ [ 'string', 'p' ] ] ]
        if(isJQueryCall(tree)) {
            return flatten(parseSelector(tree[2][0][1]).map(function(tokens) {
                return {
                    tokens: tokens,
                    statement: statement
                };
            }));
        }
        return flatten(tree.map(function(n) {
            statement = tree.length && tree[0].name ? tree[0] : statement;
            return findJQuerySelectors(n, statement);
        }));
    }
    return [];
}
