import { queryById, User, updateUser as update } from '../../database/db';


export function getUsers() {

}

export function getUserById(userId: string) {
    return queryById('Users', userId) as Promise<User>;
}

export function updateUser(userId: string, fields: {
    name: string;
    value: any;
}[]) {
    return update(userId, fields) as Promise<any>; // TODO this should return User or partial user
}
