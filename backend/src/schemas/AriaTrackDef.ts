export interface AriaTrackDef {
    uris: string[];
    options?: AriaTrackOptions;
    position?: number;
}

export function validateAriaTrackDef(val: any) {
    let isValid = val.uris !== undefined;

    if (val.options) {
        isValid = validateAriaTrackOptions(val.options);
    }

    return isValid;
}

export interface AriaTrackOptions {
    dir?: string;
    out?: string;
    auto_file_renaming?: boolean;
    max_conn_per_server?: number;
    max_speed?: string;
    max_tries?: number;
    piece_length?: string;
    pause?: boolean;
    integrity?: {
        type: string;
        digest: string;
    };
    user_agent?: string;
    headers?: object;
    ftp?: {
        user: string;
        passwd: string;
    };
    http?: {
        user: string;
        passwd: string;
    };
    bt_trackers?: string[];
}

export function validateAriaTrackOptions(val: any) {
    let isValid = true;

    if (val.integrity) {
        isValid = val.integrity.type
            && val.integrity.digest;
    }

    if (val.ftp) {
        isValid = val.ftp.user
            && val.ftp.passwd;
    }

    if (val.http) {
        isValid = val.http.user
            && val.http.passwd;
    }

    return isValid;
}
