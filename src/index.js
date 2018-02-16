import YAML from "js-yaml";
const str = `json:
- rigid
# - better for data interchange
yaml:
- slim and flexible
# - better for configuration
object:
key: value
array:
- null_value:
# - boolean: true
- integer: 1
paragraph: >
Blank lines denote
paragraph breaks
content: |-
Or we
can auto
convert line breaks
to save space
# shtuty`;
const example = `
# my comment
value: 1 # the value is here!
`;
// STR => JSON
const LINES_DELIMITER = "\n";
const COMMENT_TOKEN = "$comment";
const MIDDLE_LINE_COMMENT_TOKEN = "$MLcomment";
const lines = str.split(LINES_DELIMITER);
const start_of_line_comment = /^([\s]*)(\#\s?)(-?\s?)(.*)/;
const middle_of_line_comment = /([^\#]+)(\#\s?)(.*)/;
const newLines = lines.map((line, index) => {
if (line.match(start_of_line_comment)) {
return line.replace(
start_of_line_comment,
`$1$3${COMMENT_TOKEN}${index}: "$4"`
);
}
if (line.match(middle_of_line_comment)) {
// Should we delete middle line comments?
return line.replace(
middle_of_line_comment,
`$1${MIDDLE_LINE_COMMENT_TOKEN} "$3"`
);
}
return line;
});
const strWithComments = newLines.join(LINES_DELIMITER);
const jsonObject = YAML.safeLoad(strWithComments, { json: true });
console.log(jsonObject);
// End STR => JSON
// JSON => STR
const yamlAsString = YAML.safeDump(jsonObject, { indent: 2 });
const MIDDLE_LINE_PATTERN = `(\\${MIDDLE_LINE_COMMENT_TOKEN})( ")(.*)(")`;
const middleLineRegex = new RegExp(MIDDLE_LINE_PATTERN, "g");
const COMMENT_KEY_VALUE_PATTERN = `(\\${COMMENT_TOKEN}.*:)( ')(.*)(')`;
const commentKeyValueRegex = new RegExp(COMMENT_KEY_VALUE_PATTERN, "g");
const SWITCH_SIGNS_PATTERN = `(- )?(\\${COMMENT_TOKEN}\\d*)(: )`;
const switchSignsRegex = new RegExp(SWITCH_SIGNS_PATTERN, "g");
const COMMENT_TOKEN_TO_SIGN = `\\${COMMENT_TOKEN}\\d*`;
const tokenToSignRegex = new RegExp(COMMENT_TOKEN_TO_SIGN, "g");
const newString = yamlAsString
.replace(commentKeyValueRegex, "$1 $3")
.replace(middleLineRegex, "# $3")
.replace(switchSignsRegex, "$2 $1")
.replace(tokenToSignRegex, "#");
console.log(newString);
// End JSON => STR

