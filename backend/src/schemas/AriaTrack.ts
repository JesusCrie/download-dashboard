export interface AriaTrack {
    gid: string;
    status: 'active' | 'waiting' | 'paused' | 'error' | 'complete' | 'removed';
    dir: string;
    files: AriaFile[];
    size_total: bigint;
    size_completed: bigint;
    piece_amount: number;
    piece_size: bigint;
    bitfield: string;
    connection_amount: number;
    speed_down: bigint;
    elapsed_time: bigint;
    error?: {
        error_code: number;
        error_message: string;
    };
}

export function validateAriaTrack(val: any) {
    let isValid = val.gid
        && ['active', 'waiting', 'paused', 'error', 'complete', 'removed'].includes(val.status)
        && val.dir
        && val.files && val.files.every(validateAriaFile)
        && val.size_total
        && val.size_completed
        && val.piece_amount
        && val.piece_size
        && val.bitfield
        && val.connection_amount
        && val.speed_down
        && val.elapsed_time;

    if (val.error) {
        isValid = val.error.error_code
            && val.error.error_message;
    }

    return isValid;
}

export interface AriaFile {
    index: number;
    path: string;
    uris: AriaUri[];
}

export function validateAriaFile(val: any) {
    return val.index
        && val.path
        && val.uris && val.uris.every(validateAriaUri);
}

export interface AriaUri {
    uri: string;
    status: 'used' | 'waiting';
}

export function validateAriaUri(val: any) {
    return val.uri
        && ['used', 'waiting'].includes(val.status);
}
