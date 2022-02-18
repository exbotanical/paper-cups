export enum Opcode {
	TEST_COMMAND = 'TEST_COMMAND'
}

export type TransactionId = string;

export interface InboundMessage<T> {
	// the operation type e.g. command code
	opcode: Opcode;
	// transaction id -> should correspond to request if there was one
	txId?: TransactionId;
	// payload data
	payload: T;
}

export interface Subscriber<Data = any> {
	(data: InboundMessage<Data>): void;
}

/**
 * Serializer function.
 */
export type Serialize = <T>(
	value: T,
	replacer?: ((this: any, key: string, value: any) => any) | undefined,
	space?: number | string | undefined
) => string;

/**
 * Deserializer function. Should accord to the serializer.
 */
export type Deserialize = <T>(
	text: string,
	reviver?: ((this: any, key: string, value: any) => any) | undefined
) => T;

interface LogFunction {
	(...args: any[]): void;
}

export interface LoggerContract {
	new (locale: string, shouldDisable: () => boolean): any;
	info: LogFunction;
	success: LogFunction;
	warn: LogFunction;
	error: LogFunction;
}
