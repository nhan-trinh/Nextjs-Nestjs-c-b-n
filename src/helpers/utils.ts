import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPasswordHelpers = async (plainPassword: string) =>{
    try {
        const h = await bcrypt.hash(plainPassword, saltRounds)
        return h
    } catch (error) {
        console.log(error)
    }
}