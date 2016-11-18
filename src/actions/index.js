export const RESPONSE_ANALYTICS_RESULT = "RESPONSE_ANALYTICS_RESULT";

export function receiveAnalyticsResult(analytics_result) {
    return {
        type: RESPONSE_ANALYTICS_RESULT,
        analytics_result
    }
}