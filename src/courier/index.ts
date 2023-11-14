export abstract class Courier {
	public abstract track(tracking_no: string): Promise<any>;
}
