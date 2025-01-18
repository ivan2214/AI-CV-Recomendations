declare module "pdf-parse-fork" {
	interface PDFParseOptions {
		max?: number;
		pagerender?: (pageData: {
			pageIndex: number;
			pageNumber: number;
			getTextContent: () => Promise<string>;
		}) => Promise<string>;
		normalizeWhitespace?: boolean;
		disableCombineTextItems?: boolean;
	}

	interface PDFParseResult {
		numpages: number;
		numrender: number;
		info: {
			[key: string]: string | number;
		};
		metadata: {
			[key: string]: string | number;
		};
		text: string;
	}

	function parse(
		data: Buffer | ArrayBuffer | Uint8Array,
		options?: PDFParseOptions,
	): Promise<PDFParseResult>;

	export = parse;
}
