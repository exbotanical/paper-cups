/* eslint-disable @typescript-eslint/no-unsafe-argument */
export class Logger {
	#transport = console;

	#baseFormat = `font-weight:bold;padding:6px;border:solid 1px white;border-radius:3px;`;

	constructor(
		protected locale: string,
		protected shouldDisable: () => boolean
	) {}

	#log(method: 'error' | 'info' | 'log', hex: string, ...args: any[]) {
		const callable = this.#transport[method];

		callable(
			`%c[${this.locale}]`,
			`${this.#baseFormat}background:${hex}`,
			'\n\n',
			...args
		);
	}

	info(...args: any[]) {
		if (this.shouldDisable()) return;

		this.#log('info', '#326fab', ...args);
	}

	success(...args: any[]) {
		if (this.shouldDisable()) return;

		this.#log('info', '#8ac24a', ...args);
	}

	warn(...args: any[]) {
		if (this.shouldDisable()) return;

		this.#log('info', '#ffb143', ...args);
	}

	error(...args: any[]) {
		if (this.shouldDisable()) return;

		this.#log('error', '#e61e50', ...args);
	}
}
