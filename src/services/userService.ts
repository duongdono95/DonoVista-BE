import { userModel } from '../models/userModel';
import { userInterface } from '../zod/generalTypes';

const createNew = async (validatedRequest: userInterface) => {
    try {
        const result = await userModel.createNew(validatedRequest);
        return result;
    } catch (error) {
        throw error;
    }
};
const getUserDetails = async (userId: string) => {
    try {
        const result = await userModel.getUserDetails(userId);
        return result;
    } catch (error) {
        throw error;
    }
};
const signIn = async (email: string, password: string) => {
    try {
        const result = await userModel.signIn(email, password);
        return result;
    } catch (error) {
        throw error;
    }
};
export const userService = {
    createNew,
    getUserDetails,
    signIn,
};
