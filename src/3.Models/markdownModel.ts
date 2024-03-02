import { ObjectId } from 'mongodb';
import { GET_DB } from '../config/mongodb';
import { z } from 'zod';
import { ColumnInterface, ColumnSchema, MarkdownInterface, markdownSchema } from '../zod/generalTypes';
import { BOARD_COLLECTION_NAME, boardModel } from './boardModel';
import { CARD_COLLECTION_NAME } from './cardModel';
import { columnModel } from './columnModel';

export const MARKDOWN_COLLECTION_NAME = 'markdowns';

export const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];

const createNew = async (markdown: Omit<MarkdownInterface, '_id'>) => {
    try {
        const isExist = await GET_DB().collection(MARKDOWN_COLLECTION_NAME).findOne({ id: markdown.id });
        if (!isExist) {
            const md = await GET_DB().collection(MARKDOWN_COLLECTION_NAME).insertOne(markdown);
            if (!md.insertedId) throw new Error('Create New Column Failed!');
            const card = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ id: markdown.cardId });
            const updateCard = await GET_DB()
                .collection(CARD_COLLECTION_NAME)
                .updateOne(
                    { id: markdown.cardId },
                    {
                        $set: {
                            markdown: markdown.id,
                        },
                    },
                );
            if (!card) throw new Error(' Card not found ');
            if (updateCard.modifiedCount === 0) throw new Error('Update Board Failed!');
            await columnModel.updateColumnCards(card.columnId);
            await boardModel.updateBoardColumns(card.boardId);
            return { ...markdown, _id: md.insertedId };
        } else {
            const update = await updateMarkdown(markdown);
            return update;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const updateMarkdown = async (markdown: MarkdownInterface) => {
    try {
        console.log('tetstasdasdasdas');
        const validateMD = markdownSchema.omit({ _id: true }).safeParse(markdown);
        if (!validateMD.success) throw new Error('Invalid Markdown');
        const updateMD = await GET_DB()
            .collection(MARKDOWN_COLLECTION_NAME)
            .updateOne({ id: markdown.id }, { $set: validateMD.data });
        if (updateMD.modifiedCount === 0) throw new Error('Update Markdown Failed!');
        return markdown;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getMarkdown = async (id: string) => {
    try {
        const md = await GET_DB().collection(MARKDOWN_COLLECTION_NAME).findOne({ id: id });
        if (!md) throw new Error('Markdown Not Found!');
        return md;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const markdownModel = {
    createNew,
    updateMarkdown,
    getMarkdown,
};
