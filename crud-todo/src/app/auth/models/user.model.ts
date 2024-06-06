export interface User {
    email: string, 
    password: string,
    token: string,
    username: string,
    user_id: number
}
export type userReq = Pick<User, 'email' | 'password'>;
export type userRes = Pick<User, 'token' | 'username' | 'user_id'>;