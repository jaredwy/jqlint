

function isJQueryCall(node) {
    return node.length > 2 && node[0] == 'call' && node[1][0] == 'name' && ['$', 'jQuery'].indexOf(node[1][1]) != -1 && node[2][0][0] == 'string';
}

function findJQuerySelectors(tree, statement) {
    if(tree && tree.constructor == Array) {
        // [ 'call', [ 'name', '$' ], [ [ 'string', 'p' ] ] ]
        if(isJQueryCall(tree)) {
            return {
                tokens: parseSelector(tree[2][0][1]),
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

for(var i = 0; i < nodes.length; i++) {
    var result;
    if(result = parseCSS(nodes[i].tokens)) {
        console.log(result);    
    }  else {
        //you did good
    }
    
}




function getLookAhead(stream, position) {
    if(stream[position-1]) {
        return stream[position-1];
    }
    return null;
}


function parseCSS(stream) {
    var warning = [];
        var currentToken, lookAhead;
        for(var j = stream.length -1; j != 0; j--) {
            currentToken = stream[j];
            lookAhead = getLookAhead(stream,j);
            if(currentToken == "TAG") {
                if(!lookahead && lookAhead.type == "COMBINATOR" && lookAhead.identifier != "CHILD") {
                    return {type: "SPECIFIC", stream: stream };
                }
            }
            if(currentToken.type == "ID" && lookAhead != null) {
                return {type: "ID", stream: stream };

            }
        }
    return null;
}
