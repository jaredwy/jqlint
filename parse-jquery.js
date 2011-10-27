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
            rewrite = [],
            results = [];
        for(var i = stream.length - 1; i >= 0; i--) {
            var current = stream[i],
                lookAhead = getLookAhead(stream,i),
                lookAhead2 = getLookAhead(stream,i,2);
            
            if(current.identifier == "DESCENDENT") {
                continue;
            }
            
            if(current.type == "TAG" && lookAhead.type == "COMBINATOR" && lookAhead.identifier == "DESCENDENT") {
                results.push(current.identifier); 
                results.push(" ");
            }
            if(current.type == "TAG" && lookAhead.type == "COMBINATOR" && lookAhead.identifier != "DESCENDENT") {
               rewrite.push(".find('" + results.join("") + '")');
               results = [];
               results.push(lookAhead.identifier == "ADJECENT" ? "+" : ">");
               results.push(current.identifier);
            }
            if(current.type != "TAG") {
                if(lookAhead == null) {
                    rewrite.push(".find('" + results.join("") + '")');
                    rewrite.push("$('"+ current.identifier + "')");
                }
                else {
                    rewrite.push(".find('" + results.join("") + "')");
                    rewrite.push(".find('" + results.join(" ") + '")');
                }
            }

        }
        return rewrite.reverse().join("") + ";";
    }
}

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


var ast = parsejs.parse("$('p')\n$('div #test')\n$($('ul > li'))\n$('.class a a + a')", false, true)[1];
var nodes = findJQuerySelectors(ast);

for(var i = 0; i < nodes.length; i++) {
    var result;
    if(result = parseCSS(nodes[i].tokens)) {
        console.log(rewrite[result.type](nodes[i].tokens,nodes[i].statment));    
    }  else {
        //you did good
    }
    
}




function getLookAhead(stream, position,count) {
    var count = count || 1;
    if(stream[position-count]) {
        return stream[position-count];
    }
    return null;
}


function parseCSS(stream) {
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
