export const SAVE_SESSION = "SAVE_SESSION";

export function saveSession(session){
    return {
        type: SAVE_SESSION,
        session
    }
}