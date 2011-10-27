function tokenize(stream) {

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
    '+' : 'ADJECENT'
    '' : 'UNKNOWN'
}

var tokens = example.split(stream);

for(var i = 0; i < tokens.length; i++) {
    var token = tokens[length];
    var temp = {},
        matches = token.match(typeIdentifier);
    if(matches.length > 1) {
        token.type = SelectorTypes[matches[0]];
        token.identifier = matches[0];
    } else {
        //we have  match like ' ' or > or TAG
        //
        if(token.length > 1) {
            token.type = "TAG";
            token.identifier = token;
        } else {
           token.type = "COMBINATOR";
           token.identifier = combinatorTypes[token];
        }
        
    }
    


    tokens[i] = temp;
}

return tokens;
}


