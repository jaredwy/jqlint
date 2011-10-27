function parseSelector(stream) {
    console.log(stream);
    var tokenSplit = /\s*([\s>+])\s*/;
    var typeIdentifier = /(([#.])(.*))/;
    var SelectorTypes = {
        '#':  'ID',
        '.': 'CLASS',
        '' : 'UNKNOWN'
    };
    var combinatorType = {
        ' ' : 'DESCENDENT',
        '>' : 'CHILD',
        '+' : 'ADJECENT',
        '' : 'UNKNOWN'
    }

    var selectors = stream.split(',');

    return selectors.map(function(selector) {
        var tokens = selector.trim().split(tokenSplit);

        for(var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var temp = {},
            matches = token.match(typeIdentifier);
            if(matches && matches.length > 1) {
                temp.type = SelectorTypes[matches[2]];
                temp.identifier = matches[1];
            } else {
                //we have  match like ' ' or > or TAG
                //
                if(/\w+/.exec(token)) {
                    temp.type = "TAG";
                    temp.identifier = token;
                } else {
                    temp.type = "COMBINATOR";
                    temp.identifier = combinatorType[token];
                }
            }

            tokens[i] = temp;
        }
        console.log(tokens);
        return tokens;
    });
}
