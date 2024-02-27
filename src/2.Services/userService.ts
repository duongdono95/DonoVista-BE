import { userModel } from "../3.Models/userModel";
import { UserInterface } from '../zod/generalTypes'

const signIn = async (email: string, password: string) => {
    try {
        const result = await userModel.signIn(email, password);
        return result;
    } catch (error) {
        throw error;
    }
};
const signUp = async (form: UserInterface) => {
    try {
        const result = await userModel.signUp(form);
        return result;
    } catch (error) {
        throw error;
    }
};
export const userService = {
    signIn,
    signUp
};