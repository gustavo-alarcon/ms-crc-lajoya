export interface User {
    area?: string,
    supervisor?: {
        displayName?: string,
        uid?: string
    },
    numberId?: string,
    jobTitle?: string,
    uid?: string,
    name?: string,
    lastname?: string,
    displayName?: string,
    phone?: string,
    email?: string,
    photoURL?: string,
    permit?: {
        id?: string,
        name?: string,
        reg?: number
    },
    regDate?: Date,
}