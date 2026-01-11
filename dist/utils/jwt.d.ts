interface JwtPayload {
    userId: string;
    role: string;
}
export declare const signToken: (payload: JwtPayload) => string;
export declare const verifyToken: (token: string) => JwtPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map