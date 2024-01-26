"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBJECT_ID_RULE_MESSAGE = exports.OBJECT_ID_RULE = exports.BOARD_TYPES = exports.WHITELIST_DOMAINS = void 0;
exports.WHITELIST_DOMAINS = ['http://http://localhost:5173'];
exports.BOARD_TYPES = {
    PUBLIC: 'public',
    PRIVATE: 'private',
};
exports.OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
exports.OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!';
