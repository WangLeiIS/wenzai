export function  getUUID(randomLength: number = 8) {
    let idStr = Date.now().toString(36);
    idStr += Math.random().toString(36).slice(2,2+randomLength);
    return idStr;
}