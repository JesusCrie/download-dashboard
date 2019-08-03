export interface AuthHolder {
    password: string;
    infinite?: boolean;
}

export function validateAuthHolder(val: any) {
    return val.password !== undefined;
}
