import { queryById, User } from '../../database/db';


export function getUsers() {

}

export function getUserById(userId: string) {
    return queryById('Users', userId) as Promise<User>;
}
