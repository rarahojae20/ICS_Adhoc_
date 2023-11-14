export default class ApiError extends Error {
    public detail: object;

    public constructor(public code: number, message?: string, detail?: object) {
        super(message);
        this.code = code;
        this.detail = detail;
    }
}
