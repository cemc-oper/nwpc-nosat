export const SAVE_SESSION = "SAVE_SESSION";

export function saveSession(session){
    return {
        type: SAVE_SESSION,
        session
    }
}

export const LOAD_SESSION = "LOAD_SESSION";

export function loadSession(session){
    return {
        type: LOAD_SESSION,
        session
    }
}


export const REQUEST_TEST_SESSION = "REQUEST_TEST_SESSION";
export function requestTestSession(session){
    return {
        type: REQUEST_TEST_SESSION,
        session
    }
}

export const RECEIVE_TEST_SESSION_RESPONSE = "RECEIVE_TEST_SESSION_RESPONSE";
export function receiveTestSessionResponse(test_result){
    return {
        type: RECEIVE_TEST_SESSION_RESPONSE,
        test_result
    }
}