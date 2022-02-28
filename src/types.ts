import type { Logger } from './logger';

export type TransactionId = string;

export type MaybeProps<T> = T extends Record<string, any>
	? {
			[K in keyof T]?: T[K];
	  }
	: T | undefined;

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

export interface InboundMessage<T = any> {
	// the operation type e.g. command code
	opcode: string;
	// transaction id -> should correspond to request if there was one
	txId?: TransactionId;
	// payload data
	payload: T;
}

export interface Subscriber<Data = any> {
	(data: InboundMessage<MaybeProps<Data>>): void;
}

export interface LoggerContract {
	new (locale: string, shouldDisable: () => boolean): Logger;
}
