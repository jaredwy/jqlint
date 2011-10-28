var rewrite = { 
    "ID": function(stream, statment) {
        var current = stream.pop()   
        while(current.type != "ID") {
            current = stream.pop();
        }
        return "$('" + current.identifier + "')";
    },
    "SPECIFIC" : function(stream,statment) {
        var lookAhead,
            lookAhead2,
            rewrite = [],
            results = [];
        for(var i = stream.length - 1; i >= 0; --i) {
            var current = stream[i],
                lookAhead = getLookAhead(stream,i),
                lookAhead2 = getLookAhead(stream,i,2);
            
            if(current.type == "TAG" && lookAhead && lookAhead.identifier == "DESCENDENT") {
                results.push(current.identifier); 
            }
            if(current.type == "TAG" && lookAhead && lookAhead.identifier != "DESCENDENT" && lookAhead2 && lookAhead2.type == "TAG") {
                if(results.length) rewrite.push(".find('" + results.join(" ") + "')");
                results = [];
                results.push(lookAhead2.identifier);
                results.push(lookAhead.identifier == "ADJECENT" ? "+" : ">");
                results.push(current.identifier);
                rewrite.push(".find('" + results.join(" ") + "')");
                results = [];
                i -= 2;
            }
            if(lookAhead == null) {
                if(results.length) rewrite.push(".find('" + results.join(" ") + "')");
                rewrite.push("$('"+ current.identifier + "')");
            } else if(results.length) {
                rewrite.push(".find('" + results.join(" ") + "')");
                results = [];
            }
        }
        return rewrite.reverse().join("") + ";";
    }
}
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
                var result = parseCSS(tokens);
                var error = null;
                if(result) {
                    error = rewrite[result.type](tokens,tree[2][0][1]);
                }
                return {
                    errors: error,
                    tokens: tokens,
                    statement: statement,
                    selector: tree[2][0][1]
                };
            }));
        }
        return flatten(tree.map(function(n) {
            while(!tree[0]) { tree = tree[1] }
            statement = tree.length && tree[0].name ? tree[0] : statement;
            return findJQuerySelectors(n, statement);
        }));
    }
    return [];
}


function getLookAhead(stream, position,count) {
    var count = count || 1;
    if(stream[position-count]) {
        return stream[position-count];
    }
    return null;
}


function parseCSS(stream) {
    if(stream.length && stream[0] && stream[0].type == "TAG" &&stream[0].identifier.indexOf("<") > -1) return null;
    var warning = [];
        var currentToken, lookAhead;
        for(var j = stream.length -1; j != 0; j--) {
            currentToken = stream[j];
            lookAhead = getLookAhead(stream,j);
            if(currentToken.type == "TAG") {
                if(lookAhead && lookAhead.type == "COMBINATOR" && lookAhead.identifier != "CHILD") {
                    return {type: "SPECIFIC", stream: stream };
                }
            }
            if(currentToken.type == "ID" && lookAhead != null) {
                return {type: "ID", stream: stream };
            }
        }
    return null;
}
