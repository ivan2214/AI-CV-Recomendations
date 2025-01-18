declare module "pdf-parse-fork" {
	function parse(
		data: Buffer | ArrayBuffer | Uint8Array,
		options?: any,
	): Promise<{
		numpages: number;
		numrender: number;
		info: any;
		metadata: any;
		text: string;
	}>;

	export = parse;
}
