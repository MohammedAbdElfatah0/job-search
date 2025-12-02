import * as bcrypt from "bcrypt"
const saltOrRounds: number = 12;
//hash
export const generatedHash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, saltOrRounds);
}
//verify password
export const compereHash = async (password: string, inputPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, inputPassword);
}