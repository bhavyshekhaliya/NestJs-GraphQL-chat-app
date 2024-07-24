import * as bcrypt from 'bcrypt';


// hashData with dynamically value
export async function hashData(data: string): Promise<string> {
    // 10 is the number of salt rounds. The higher the number, the more secure the hash.
    return bcrypt.hash(data, 10);
}