export declare enum UserRole {
    SELLER = "SELLER",
    BUYER = "BUYER"
}
export declare class User {
    id: string;
    username: string;
    password: string;
    role: UserRole;
}
