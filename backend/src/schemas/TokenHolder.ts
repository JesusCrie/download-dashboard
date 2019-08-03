export interface TokenHolder {
    token: string;
}

export function validateTokenHolder(val: any) {
    return val.token !== undefined;
}
