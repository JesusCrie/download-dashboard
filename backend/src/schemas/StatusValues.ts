export interface StatusValues {
    distro?: string;
    uptime?: number;
    cpu?: number;
    memory?: number;
    netspeed?: number;
    disk?: number;
    aria?: string;
    aria_active?: number;
}

export function validateStatusValues(val: any) {
    return true;
}
