import type { Logger } from './logger';

export enum Opcode {
	TEST_COMMAND = 'TEST_COMMAND'
}

export type TransactionId = string;

export type BasePayload = Record<string, unknown>;

export interface InboundMessage<T extends BasePayload> {
	// the operation type e.g. command code
	opcode: Opcode;
	// transaction id -> should correspond to request if there was one
	txId?: TransactionId;
	// payload data
	payload: T;
}

export type MaybeProps<T extends BasePayload> = {
	[K in keyof T]?: T[K];
};

export interface Subscriber<Data extends BasePayload> {
	(data: InboundMessage<MaybeProps<Data>>): void;
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

export interface ValidatorFunction<T> {
	(data: unknown): data is T;
}

export interface LoggerContract {
	new (locale: string, shouldDisable: () => boolean): Logger;
}
