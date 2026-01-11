export declare const registerUser: (payload: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    role: "customer" | "seller";
}) => Promise<{
    user: any;
    token: string;
}>;
export declare const loginUser: (payload: {
    email: string;
    password: string;
}) => Promise<{
    user: any;
    token: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map