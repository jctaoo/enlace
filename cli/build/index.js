"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var inquirer = __importStar(require("inquirer"));
var create_app_1 = require("./create_app");
var generate_part_1 = require("./generate_part");
var generate_part_2 = require("./generate_part");
var constant_1 = require("./constant");
var chalk_1 = require("chalk");
var os_1 = __importDefault(require("os"));
var child_process_1 = require("child_process");
var update_1 = require("./update");
child_process_1.exec('deno --version', function (error, stdout, stderr) {
    if (error || stderr) {
        // todo 更详尽的说明
        console.error(chalk_1.red('You have not installed deno, please check https://deno.land.'));
        process.exit(100);
    }
    else {
        // handle deno
        var parts = stdout.split(os_1.default.EOL);
        parts = parts.slice(0, parts.length - 1);
        // todo
        var deno = "";
        var v8 = "";
        var typescript = "";
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var item = parts_1[_i];
            var parts_2 = item.split(' ');
            var title = parts_2[0];
            var version = parts_2[1];
            switch (title) {
                case 'deno':
                    deno = version;
                    break;
                case 'v8':
                    v8 = version;
                    break;
                case 'typescript':
                    typescript = version;
                    break;
                default:
                    break;
            }
        }
        // handle package.json
        var cli = require('../package.json').version;
        main(process.argv, { deno: deno, v8: v8, typescript: typescript, cli: cli });
    }
});
function main(argv, _a) {
    var _this = this;
    var deno = _a.deno, v8 = _a.v8, typescript = _a.typescript, cli = _a.cli;
    var version = process.version;
    var program = new commander_1.Command();
    program.version(version);
    program
        .command('create [app_name] [relative_path]')
        .description('generate enlace application')
        .action(function (appName, relativePath) { return __awaiter(_this, void 0, void 0, function () {
        var name, answer, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = appName !== null && appName !== void 0 ? appName : "";
                    if (!!name) return [3 /*break*/, 2];
                    return [4 /*yield*/, inquirer.prompt({
                            type: 'input',
                            name: 'appName',
                            message: 'please input your app name:',
                            validate: function (input) {
                                var isOk = !!input;
                                return isOk ? isOk : "name is empty";
                            }
                        })];
                case 1:
                    answer = _a.sent();
                    name = answer.appName;
                    _a.label = 2;
                case 2:
                    path = relativePath !== null && relativePath !== void 0 ? relativePath : "./";
                    create_app_1.generateApp(name, path);
                    return [2 /*return*/];
            }
        });
    }); });
    program
        .command('generate [part_type] [part_name] [relative_path]')
        .description('generate a part of enlace app')
        .action(function (partType, partName, relativePath) { return __awaiter(_this, void 0, void 0, function () {
        var type, parsedType, answer, name, answer, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parsedType = generate_part_2.parsePartString(partType !== null && partType !== void 0 ? partType : "");
                    if (!!parsedType) return [3 /*break*/, 2];
                    return [4 /*yield*/, inquirer.prompt({
                            type: "list",
                            name: "type",
                            message: "please select the type of part you want to create:",
                            choices: generate_part_1.enlaceApplicationPartItems,
                        })];
                case 1:
                    answer = _a.sent();
                    type = answer.type;
                    return [3 /*break*/, 3];
                case 2:
                    type = parsedType;
                    _a.label = 3;
                case 3:
                    name = partName !== null && partName !== void 0 ? partName : "";
                    if (!!name) return [3 /*break*/, 5];
                    return [4 /*yield*/, inquirer.prompt({
                            type: 'input',
                            name: 'partName',
                            message: 'please input your part name:',
                            validate: function (input) {
                                var isOk = !!input;
                                return isOk ? isOk : "name is empty";
                            }
                        })];
                case 4:
                    answer = _a.sent();
                    name = answer.partName;
                    _a.label = 5;
                case 5:
                    path = relativePath !== null && relativePath !== void 0 ? relativePath : "./";
                    generate_part_1.generatePart(type, name, path);
                    return [2 /*return*/];
            }
        });
    }); });
    program
        .command('info')
        .description('display enlace cli details')
        .action(function () {
        console.log(constant_1.LOGO);
        console.log("\n");
        console.log(chalk_1.green("[system Information]"));
        console.log('OS Version: ', chalk_1.blue(os_1.default.platform() + " " + os_1.default.arch() + " " + os_1.default.release()));
        console.log('Deno Version: ', chalk_1.blue("" + deno));
        console.log('v8 Version: ', chalk_1.blue(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), v8));
        console.log('typescript Version: ', chalk_1.blue(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", ""], ["", ""])), typescript));
        console.log('NodeJS Version: ', chalk_1.blue("" + process.version));
        console.log(chalk_1.green("\n[" + constant_1.PROJECT_NAME + " Information]"));
        console.log('cli Version: ', chalk_1.blue(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", ""], ["", ""])), cli));
    });
    program
        .command('update')
        .description('update enlace_cli')
        .action(update_1.updateCLI);
    program.parse(argv);
}
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=index.js.map