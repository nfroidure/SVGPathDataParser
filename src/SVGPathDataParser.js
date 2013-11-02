// Parse SVG PathData
// http://www.w3.org/TR/SVG/paths.html#PathDataBNF

// Private consts : Char groups
var WSP = [' ', '\t', '\r', '\n']
  , DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  , SIGNS = ['-', '+']
  , EXPONENTS = ['e', 'E']
  , DECPOINT = ['.']
  , FLAGS = ['0', '1']
  , COMMA = [',']
;
  
function PathDataParser() {
  // Parsing vars
  this.state = PathDataParser.STATE_NONE;
  // Number
  this.curNumber = '';
  this.parse = function(str) {
    for(var i=0, j=str.length; i<j; i++) {
      // Numbers parsing : -125.25e-125
      if(this.state&PathDataParser.STATE_NUMBER) {
        // Reading the sign
        if(this.state === PathDataParser.STATE_NUMBER) {
          this.state |= PathDataParser.STATE_NUMBER_INT |
            PathDataParser.STATE_NUMBER_DIGITS;
          if(-1 !== SIGNS.indexOf(str[i])) {
            this.curNumber += str[i];
            continue;
          }
        }
        // Reading digits
        if(this.state&PathDataParser.STATE_NUMBER_DIGITS) {
          if(-1 !== DIGITS.indexOf(str[i])) {
            this.curNumber += str[i];
            continue;
          }
        }
        // Ended reading left side digits
        if(this.state&PathDataParser.STATE_NUMBER_DIGITS || i>=j-1) {
          this.state ^= PathDataParser.STATE_NUMBER_INT;
          // if got a point, reading right side digits
          if(-1 !== DECPOINT.indexOf(str[i])) {
            this.curNumber += str[i];
            this.state |= PathDataParser.STATE_NUMBER_FLOAT |
              PathDataParser.STATE_NUMBER_DIGITS;
            continue;
          }
          // if got e/E, reading the exponent
          if(-1 !== EXPONENTS.indexOf(str[i])) {
            this.curNumber += str[i];
            this.state |= PathDataParser.STATE_NUMBER_EXP |
              PathDataParser.STATE_NUMBER_DIGITS;
            continue;
          }
          // else we're done with that number
          this.state ^= PathDataParser.STATE_NUMBER;
        }
      }
    // Coordinates parsing
    
    }
  };
}

// Static consts
// Parsing states
PathDataParser.STATE_NONE = 0;
PathDataParser.STATE_NUMBER = 1;
PathDataParser.STATE_NUMBER_DIGITS = 2;
PathDataParser.STATE_NUMBER_INT = 4;
PathDataParser.STATE_NUMBER_EXP = 8;
PathDataParser.STATE_NUMBER_FLOAT = 16;
PathDataParser.STATE_NUMBER_MASK = PathDataParser.STATE_NUMBER |
  PathDataParser.STATE_NUMBER_DIGITS | PathDataParser.STATE_NUMBER_INT |
  PathDataParser.STATE_NUMBER_EXP | PathDataParser.STATE_NUMBER_FLOAT;

module.exports = PathDataParser;

