/* eslint-disable @typescript-eslint/no-explicit-any */
export default abstract class Tracker {
	public abstract track(tracking_no: string): Promise<any>;
}
