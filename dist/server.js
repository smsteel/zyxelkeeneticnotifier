/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./main.ts":
/*!*****************!*\
  !*** ./main.ts ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst syslog_server_1 = __importDefault(__webpack_require__(/*! syslog-server */ \"syslog-server\"));\r\nconst router_message_1 = __webpack_require__(/*! ./router-message */ \"./router-message.ts\");\r\nconst node_notifier_1 = __webpack_require__(/*! node-notifier */ \"node-notifier\");\r\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\r\nconst moment_1 = __importDefault(__webpack_require__(/*! moment */ \"moment\"));\r\nconst opn_1 = __importDefault(__webpack_require__(/*! opn */ \"opn\"));\r\nconst dedent_js_1 = __importDefault(__webpack_require__(/*! dedent-js */ \"dedent-js\"));\r\n// import './install-as-service'\r\nconst syslogServer = new syslog_server_1.default();\r\nconst notifier = new node_notifier_1.WindowsToaster();\r\nlet previousMessage = null;\r\nlet lastDisconnectNotificationDate = null;\r\nlet useSound = true;\r\nfunction notify(title, message) {\r\n    notifier.notify({\r\n        title,\r\n        message,\r\n        icon: path_1.default.join(__dirname, 'zyxel.png'),\r\n        sound: useSound\r\n    }, (error, message) => {\r\n        if (error) {\r\n            console.error(error);\r\n            return;\r\n        }\r\n        switch (message) {\r\n            case undefined:\r\n                opn_1.default('http://192.168.1.1/#tools.log');\r\n                break;\r\n            case 'timeout':\r\n                break;\r\n            case 'dismissed':\r\n                useSound = false;\r\n                break;\r\n        }\r\n    });\r\n}\r\nsyslogServer.on('message', (data) => {\r\n    const message = new router_message_1.RouterMessage(data.date, data.host, data.message, data.protocol, previousMessage);\r\n    if (message.isPPPD &&\r\n        message.isExit &&\r\n        message.exitReason &&\r\n        (lastDisconnectNotificationDate === null || moment_1.default().diff(lastDisconnectNotificationDate, 'minutes') > 30)) {\r\n        notify('Router PPPD exited', message.exitReason);\r\n        lastDisconnectNotificationDate = moment_1.default();\r\n    }\r\n    else if (message.isNDM &&\r\n        message.isPPPoE &&\r\n        message.isDefaultRoutePPPOE) {\r\n        lastDisconnectNotificationDate = null;\r\n        notify('PPPoE connected', dedent_js_1.default `\r\n      Local IP: ${message.pppdInfo.localIp}\r\n      Remote IP: ${message.pppdInfo.remoteIp}\r\n      Primary DNS: ${message.pppdInfo.primaryDNS}\r\n      Secondary DNS: ${message.pppdInfo.secondaryDNS}`);\r\n    }\r\n    else {\r\n        previousMessage = message;\r\n    }\r\n});\r\nsyslogServer.start();\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tYWluLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbWFpbi50cz84MjY5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTeXNMb2dTZXJ2ZXIgZnJvbSAnc3lzbG9nLXNlcnZlcidcclxuaW1wb3J0IHsgUm91dGVyTWVzc2FnZSB9IGZyb20gJy4vcm91dGVyLW1lc3NhZ2UnXHJcbmltcG9ydCB7IFdpbmRvd3NUb2FzdGVyIH0gZnJvbSAnbm9kZS1ub3RpZmllcidcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IG1vbWVudCwgeyBNb21lbnQgfSBmcm9tICdtb21lbnQnXHJcbmltcG9ydCBvcG4gZnJvbSAnb3BuJ1xyXG5pbXBvcnQgZGVkZW50IGZyb20gJ2RlZGVudC1qcydcclxuLy8gaW1wb3J0ICcuL2luc3RhbGwtYXMtc2VydmljZSdcclxuXHJcbmNvbnN0IHN5c2xvZ1NlcnZlcjogU3lzTG9nU2VydmVyID0gbmV3IFN5c0xvZ1NlcnZlcigpXHJcblxyXG5pbnRlcmZhY2UgU3lzTG9nRGF0YSB7XHJcbiAgZGF0ZTogRGF0ZVxyXG4gIGhvc3Q6IHN0cmluZ1xyXG4gIG1lc3NhZ2U6IHN0cmluZ1xyXG4gIHByb3RvY29sOiBzdHJpbmdcclxufVxyXG5cclxuY29uc3Qgbm90aWZpZXIgPSBuZXcgV2luZG93c1RvYXN0ZXIoKVxyXG5sZXQgcHJldmlvdXNNZXNzYWdlOiBSb3V0ZXJNZXNzYWdlfG51bGwgPSBudWxsXHJcbmxldCBsYXN0RGlzY29ubmVjdE5vdGlmaWNhdGlvbkRhdGU6IE1vbWVudHxudWxsID0gbnVsbFxyXG5sZXQgdXNlU291bmQgPSB0cnVlXHJcblxyXG5mdW5jdGlvbiBub3RpZnkgKHRpdGxlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gIG5vdGlmaWVyLm5vdGlmeSh7XHJcbiAgICB0aXRsZSxcclxuICAgIG1lc3NhZ2UsXHJcbiAgICBpY29uOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnenl4ZWwucG5nJyksXHJcbiAgICBzb3VuZDogdXNlU291bmRcclxuICB9LCAoZXJyb3IsIG1lc3NhZ2UpID0+IHtcclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHN3aXRjaCAobWVzc2FnZSkge1xyXG4gICAgICBjYXNlIHVuZGVmaW5lZDpcclxuICAgICAgICBvcG4oJ2h0dHA6Ly8xOTIuMTY4LjEuMS8jdG9vbHMubG9nJylcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICd0aW1lb3V0JzpcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdkaXNtaXNzZWQnOlxyXG4gICAgICAgIHVzZVNvdW5kID0gZmFsc2VcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbnN5c2xvZ1NlcnZlci5vbignbWVzc2FnZScsIChkYXRhOiBTeXNMb2dEYXRhKSA9PiB7XHJcbiAgY29uc3QgbWVzc2FnZSA9IG5ldyBSb3V0ZXJNZXNzYWdlKGRhdGEuZGF0ZSwgZGF0YS5ob3N0LCBkYXRhLm1lc3NhZ2UsIGRhdGEucHJvdG9jb2wsIHByZXZpb3VzTWVzc2FnZSlcclxuICBpZiAobWVzc2FnZS5pc1BQUEQgJiZcclxuICAgIG1lc3NhZ2UuaXNFeGl0ICYmXHJcbiAgICBtZXNzYWdlLmV4aXRSZWFzb24gJiZcclxuICAgIChsYXN0RGlzY29ubmVjdE5vdGlmaWNhdGlvbkRhdGUgPT09IG51bGwgfHwgbW9tZW50KCkuZGlmZihsYXN0RGlzY29ubmVjdE5vdGlmaWNhdGlvbkRhdGUsICdtaW51dGVzJykgPiAzMClcclxuICApIHtcclxuICAgIG5vdGlmeSgnUm91dGVyIFBQUEQgZXhpdGVkJywgbWVzc2FnZS5leGl0UmVhc29uKVxyXG4gICAgbGFzdERpc2Nvbm5lY3ROb3RpZmljYXRpb25EYXRlID0gbW9tZW50KClcclxuICB9IGVsc2UgaWYgKFxyXG4gICAgbWVzc2FnZS5pc05ETSAmJlxyXG4gICAgbWVzc2FnZS5pc1BQUG9FICYmXHJcbiAgICBtZXNzYWdlLmlzRGVmYXVsdFJvdXRlUFBQT0VcclxuICApIHtcclxuICAgIGxhc3REaXNjb25uZWN0Tm90aWZpY2F0aW9uRGF0ZSA9IG51bGxcclxuICAgIG5vdGlmeShcclxuICAgICAgJ1BQUG9FIGNvbm5lY3RlZCcsXHJcbiAgICAgIGRlZGVudGBcclxuICAgICAgTG9jYWwgSVA6ICR7bWVzc2FnZS5wcHBkSW5mby5sb2NhbElwfVxyXG4gICAgICBSZW1vdGUgSVA6ICR7bWVzc2FnZS5wcHBkSW5mby5yZW1vdGVJcH1cclxuICAgICAgUHJpbWFyeSBETlM6ICR7bWVzc2FnZS5wcHBkSW5mby5wcmltYXJ5RE5TfVxyXG4gICAgICBTZWNvbmRhcnkgRE5TOiAke21lc3NhZ2UucHBwZEluZm8uc2Vjb25kYXJ5RE5TfWBcclxuICAgIClcclxuICB9IGVsc2Uge1xyXG4gICAgcHJldmlvdXNNZXNzYWdlID0gbWVzc2FnZVxyXG4gIH1cclxufSlcclxuXHJcbnN5c2xvZ1NlcnZlci5zdGFydCgpXHJcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./main.ts\n");

/***/ }),

/***/ "./router-message.ts":
/*!***************************!*\
  !*** ./router-message.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.RouterMessage = void 0;\r\nclass RouterMessage {\r\n    constructor(date, host, message, protocol, previousMessage) {\r\n        this.date = date;\r\n        this.host = host;\r\n        this.message = message;\r\n        this.protocol = protocol;\r\n        this.previousMessage = previousMessage;\r\n        this.id = null;\r\n        this.service = null;\r\n        this.description = '';\r\n        this.procssId = null;\r\n        this.pppdInfoLazy = null;\r\n        const matches = this.message.match(/<(\\d+)>\\w{3} \\d* \\d{2}:\\d{2}:\\d{2} (\\w+)(\\[(\\d+)\\])?: (.+)/);\r\n        if (matches) {\r\n            const [, id, service, , processId, description] = matches;\r\n            this.id = parseInt(id);\r\n            this.service = service;\r\n            this.description = description;\r\n            this.procssId = parseInt(processId);\r\n        }\r\n    }\r\n    get isPPPD() {\r\n        var _a;\r\n        return ((_a = this.service) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'pppd';\r\n    }\r\n    get isNDM() {\r\n        var _a;\r\n        return ((_a = this.service) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'ndm';\r\n    }\r\n    get isPPPoE() {\r\n        return this.description.toLowerCase().includes('pppoe');\r\n    }\r\n    get isInterfaceUp() {\r\n        return this.description.toLowerCase().includes('interface is up');\r\n    }\r\n    get isDefaultRoutePPPOE() {\r\n        return this.description.toLowerCase().includes('adding default route via pppoe');\r\n    }\r\n    get isExit() {\r\n        return this.description.toLowerCase().includes('exit');\r\n    }\r\n    get isDNS() {\r\n        return this.description.toLowerCase().includes('dns address');\r\n    }\r\n    get isIP() {\r\n        return this.description.toLowerCase().includes('ip address');\r\n    }\r\n    get isLocal() {\r\n        return this.description.toLowerCase().includes('local');\r\n    }\r\n    get isRemote() {\r\n        return this.description.toLowerCase().includes('remote');\r\n    }\r\n    get isPrimary() {\r\n        return this.description.toLowerCase().includes('primary');\r\n    }\r\n    get isSecondary() {\r\n        return this.description.toLowerCase().includes('secondary');\r\n    }\r\n    get ip() {\r\n        const matches = this.description.match(/\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}/);\r\n        if (!matches) {\r\n            return;\r\n        }\r\n        return matches[0];\r\n    }\r\n    get pppdInfo() {\r\n        if (this.pppdInfoLazy) {\r\n            return this.pppdInfoLazy;\r\n        }\r\n        let previousMessage = this.previousMessage;\r\n        const info = {};\r\n        while (previousMessage) {\r\n            if (previousMessage.isIP && previousMessage.isLocal) {\r\n                info.localIp = previousMessage.ip;\r\n            }\r\n            else if (previousMessage.isIP && previousMessage.isRemote) {\r\n                info.remoteIp = previousMessage.ip;\r\n            }\r\n            else if (previousMessage.isDNS && previousMessage.isPrimary) {\r\n                info.primaryDNS = previousMessage.ip;\r\n            }\r\n            else if (previousMessage.isDNS && previousMessage.isSecondary) {\r\n                info.secondaryDNS = previousMessage.ip;\r\n            }\r\n            previousMessage = previousMessage.previousMessage;\r\n        }\r\n        this.pppdInfoLazy = info;\r\n        return info;\r\n    }\r\n    get exitReason() {\r\n        if (!this.isExit || !this.previousMessage) {\r\n            return null;\r\n        }\r\n        return this.previousMessage.description;\r\n    }\r\n}\r\nexports.RouterMessage = RouterMessage;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9yb3V0ZXItbWVzc2FnZS50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3JvdXRlci1tZXNzYWdlLnRzP2I1ODAiXSwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIFBQUERJbmZvIHtcclxuICBsb2NhbElwPzogc3RyaW5nXHJcbiAgcmVtb3RlSXA/OiBzdHJpbmdcclxuICBwcmltYXJ5RE5TPzogc3RyaW5nXHJcbiAgc2Vjb25kYXJ5RE5TPzogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSb3V0ZXJNZXNzYWdlIHtcclxuICBwcml2YXRlIGlkOiBudW1iZXJ8bnVsbCA9IG51bGxcclxuICBwcml2YXRlIHNlcnZpY2U6IHN0cmluZ3xudWxsID0gbnVsbFxyXG4gIHByaXZhdGUgZGVzY3JpcHRpb246IHN0cmluZyA9ICcnXHJcbiAgcHJpdmF0ZSBwcm9jc3NJZDogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgcHJpdmF0ZSBwcHBkSW5mb0xhenk6IFBQUERJbmZvfG51bGwgPSBudWxsXHJcblxyXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgZGF0ZTogRGF0ZSwgcHJpdmF0ZSBob3N0OiBzdHJpbmcsIHByaXZhdGUgbWVzc2FnZTogc3RyaW5nLCBwcml2YXRlIHByb3RvY29sOiBzdHJpbmcsIHB1YmxpYyBwcmV2aW91c01lc3NhZ2U6IFJvdXRlck1lc3NhZ2V8bnVsbCkge1xyXG4gICAgY29uc3QgbWF0Y2hlcyA9IHRoaXMubWVzc2FnZS5tYXRjaCgvPChcXGQrKT5cXHd7M30gXFxkKiBcXGR7Mn06XFxkezJ9OlxcZHsyfSAoXFx3KykoXFxbKFxcZCspXFxdKT86ICguKykvKVxyXG4gICAgaWYgKG1hdGNoZXMpIHtcclxuICAgICAgY29uc3QgWywgaWQsIHNlcnZpY2UsICwgcHJvY2Vzc0lkLCBkZXNjcmlwdGlvbl0gPSBtYXRjaGVzXHJcbiAgICAgIHRoaXMuaWQgPSBwYXJzZUludChpZClcclxuICAgICAgdGhpcy5zZXJ2aWNlID0gc2VydmljZVxyXG4gICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cclxuICAgICAgdGhpcy5wcm9jc3NJZCA9IHBhcnNlSW50KHByb2Nlc3NJZClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgaXNQUFBEICgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnNlcnZpY2U/LnRvTG93ZXJDYXNlKCkgPT09ICdwcHBkJ1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBpc05ETSAoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlPy50b0xvd2VyQ2FzZSgpID09PSAnbmRtJ1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBpc1BQUG9FICgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3BwcG9lJylcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgaXNJbnRlcmZhY2VVcCAoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdpbnRlcmZhY2UgaXMgdXAnKVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBpc0RlZmF1bHRSb3V0ZVBQUE9FICgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2FkZGluZyBkZWZhdWx0IHJvdXRlIHZpYSBwcHBvZScpXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IGlzRXhpdCAoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdleGl0JylcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgaXNETlMgKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnZG5zIGFkZHJlc3MnKVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBpc0lQICgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2lwIGFkZHJlc3MnKVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBpc0xvY2FsICgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2xvY2FsJylcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgaXNSZW1vdGUgKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcygncmVtb3RlJylcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgaXNQcmltYXJ5ICgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3ByaW1hcnknKVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBpc1NlY29uZGFyeSAoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdzZWNvbmRhcnknKVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBpcCAoKTogc3RyaW5nfHVuZGVmaW5lZCB7XHJcbiAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5kZXNjcmlwdGlvbi5tYXRjaCgvXFxkezEsM31cXC5cXGR7MSwzfVxcLlxcZHsxLDN9XFwuXFxkezEsM30vKVxyXG4gICAgaWYgKCFtYXRjaGVzKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1hdGNoZXNbMF1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgcHBwZEluZm8gKCk6IFBQUERJbmZvIHtcclxuICAgIGlmICh0aGlzLnBwcGRJbmZvTGF6eSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wcHBkSW5mb0xhenlcclxuICAgIH1cclxuICAgIGxldCBwcmV2aW91c01lc3NhZ2UgPSB0aGlzLnByZXZpb3VzTWVzc2FnZVxyXG4gICAgY29uc3QgaW5mbzogUFBQREluZm8gPSB7fVxyXG4gICAgd2hpbGUgKHByZXZpb3VzTWVzc2FnZSkge1xyXG4gICAgICBpZiAocHJldmlvdXNNZXNzYWdlLmlzSVAgJiYgcHJldmlvdXNNZXNzYWdlLmlzTG9jYWwpIHtcclxuICAgICAgICBpbmZvLmxvY2FsSXAgPSBwcmV2aW91c01lc3NhZ2UuaXBcclxuICAgICAgfSBlbHNlIGlmIChwcmV2aW91c01lc3NhZ2UuaXNJUCAmJiBwcmV2aW91c01lc3NhZ2UuaXNSZW1vdGUpIHtcclxuICAgICAgICBpbmZvLnJlbW90ZUlwID0gcHJldmlvdXNNZXNzYWdlLmlwXHJcbiAgICAgIH0gZWxzZSBpZiAocHJldmlvdXNNZXNzYWdlLmlzRE5TICYmIHByZXZpb3VzTWVzc2FnZS5pc1ByaW1hcnkpIHtcclxuICAgICAgICBpbmZvLnByaW1hcnlETlMgPSBwcmV2aW91c01lc3NhZ2UuaXBcclxuICAgICAgfSBlbHNlIGlmIChwcmV2aW91c01lc3NhZ2UuaXNETlMgJiYgcHJldmlvdXNNZXNzYWdlLmlzU2Vjb25kYXJ5KSB7XHJcbiAgICAgICAgaW5mby5zZWNvbmRhcnlETlMgPSBwcmV2aW91c01lc3NhZ2UuaXBcclxuICAgICAgfVxyXG4gICAgICBwcmV2aW91c01lc3NhZ2UgPSBwcmV2aW91c01lc3NhZ2UucHJldmlvdXNNZXNzYWdlXHJcbiAgICB9XHJcbiAgICB0aGlzLnBwcGRJbmZvTGF6eSA9IGluZm9cclxuICAgIHJldHVybiBpbmZvXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IGV4aXRSZWFzb24gKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgaWYgKCF0aGlzLmlzRXhpdCB8fCAhdGhpcy5wcmV2aW91c01lc3NhZ2UpIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnByZXZpb3VzTWVzc2FnZS5kZXNjcmlwdGlvblxyXG4gIH1cclxufVxyXG4iXSwibWFwcGluZ3MiOiI7OztBQU9BO0FBT0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUNBO0FBQ0E7QUFFQTs7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXRHQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./router-message.ts\n");

/***/ }),

/***/ "dedent-js":
/*!****************************!*\
  !*** external "dedent-js" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dedent-js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVkZW50LWpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZGVkZW50LWpzXCI/NGI3ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkZWRlbnQtanNcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///dedent-js\n");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"moment\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9tZW50LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9tZW50XCI/YmQ3NiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb21lbnRcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///moment\n");

/***/ }),

/***/ "node-notifier":
/*!********************************!*\
  !*** external "node-notifier" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"node-notifier\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1ub3RpZmllci5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcIm5vZGUtbm90aWZpZXJcIj8wZjYyIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtbm90aWZpZXJcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///node-notifier\n");

/***/ }),

/***/ "opn":
/*!**********************!*\
  !*** external "opn" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"opn\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BuLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwib3BuXCI/NDZhYiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvcG5cIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///opn\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIj83NGJiIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "syslog-server":
/*!********************************!*\
  !*** external "syslog-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"syslog-server\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLXNlcnZlci5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcInN5c2xvZy1zZXJ2ZXJcIj81Yjc5Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN5c2xvZy1zZXJ2ZXJcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///syslog-server\n");

/***/ })

/******/ });