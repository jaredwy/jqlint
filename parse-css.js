function parseSelector(stream) {
console.log(stream);
var tokenSplit = /\s*([\s>+])\s*/;
var typeIdentifier = /([#.])(.*)/;
var SelectorTypes = {
    '#':  'ID',
    '.': 'CLASS',
    '' : 'UNKNOWN'
};
var combinatorTypes = {
    ' ' : 'DESCENDENT',
    '>' : 'CHILD',
    '+' : 'ADJECENT',
    '' : 'UNKNOWN'
}

var tokens = stream.split(tokenSplit);

for(var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var temp = {},
        matches = token.match(typeIdentifier);
    if(matches && matches.length > 1) {
        temp.type = SelectorTypes[matches[1]];
        temp.identifier = matches[2];
    } else {
        //we have  match like ' ' or > or TAG
        //
        if(/\w+/.exec(token)) {
            temp.type = "TAG";
            temp.identifier = token;
        } else {
           temp.type = "COMBINATOR";
           temp.identifier = combinatorTypes[token];
        }
        
    }
    

    
    tokens[i] = temp;
}
console.log(tokens);
return tokens;
}


