"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePart = exports.parsePartString = exports.enlaceApplicationPartItems = exports.EnlaceApplicationPart = void 0;
var EnlaceApplicationPart;
(function (EnlaceApplicationPart) {
    EnlaceApplicationPart["controller"] = "controller|co";
    EnlaceApplicationPart["middleware"] = "middleware|mi";
    EnlaceApplicationPart["endpoint"] = "endpoint|en";
    EnlaceApplicationPart["adaptor"] = "adaptor|ad";
})(EnlaceApplicationPart = exports.EnlaceApplicationPart || (exports.EnlaceApplicationPart = {}));
exports.enlaceApplicationPartItems = Object.keys(EnlaceApplicationPart).map(function (key) {
    var name = key;
    var value = EnlaceApplicationPart[key];
    return { name: name, value: value };
});
function parsePartString(string) {
    for (var key in EnlaceApplicationPart) {
        if (EnlaceApplicationPart.hasOwnProperty(key)) {
            var value = EnlaceApplicationPart[key];
            var apart = value.split('|');
            var full = apart[0];
            var abbreviation = apart[1];
            if (string === full || string === abbreviation) {
                return value;
            }
        }
    }
    return null;
}
exports.parsePartString = parsePartString;
function generatePart(type, name, relativePath) {
}
exports.generatePart = generatePart;
//# sourceMappingURL=generate_part.js.map