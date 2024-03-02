"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownService = void 0;
const markdownModel_1 = require("../3.Models/markdownModel");
const createNew = (markdown) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield markdownModel_1.markdownModel.createNew(markdown);
        return result;
    }
    catch (error) {
        throw error;
    }
});
const getMarkdown = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield markdownModel_1.markdownModel.getMarkdown(id);
        return result;
    }
    catch (error) {
        throw error;
    }
});
exports.markdownService = {
    createNew,
    getMarkdown,
};
