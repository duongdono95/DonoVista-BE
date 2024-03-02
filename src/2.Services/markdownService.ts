import { markdownModel } from '../3.Models/markdownModel';
import { MarkdownInterface } from '../zod/generalTypes';

const createNew = async (markdown: Omit<MarkdownInterface, '_id'>) => {
    try {
        const result = await markdownModel.createNew(markdown);
        return result;
    } catch (error) {
        throw error;
    }
};

const getMarkdown = async (id: string) => {
    try {
        const result = await markdownModel.getMarkdown(id);
        return result;
    } catch (error) {
        throw error;
    }
};

export const markdownService = {
    createNew,
    getMarkdown,
};
