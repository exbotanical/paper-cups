/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access */
import { v4 as generateUuid } from 'uuid';

import { Logger } from './logger';
import { EphemeralListener } from './runtime';
import { isNumber } from './utils';

import type {
	Serialize,
	Deserialize,
	Subscriber,
	InboundMessage,
	TransactionId,
	LoggerContract,
	MaybeProps
} from './types';

/**
 * Remote procedure client for use over postMessage.
 * Instantiates a message listener by default i.e. it *will* listen for incoming messages once initialized.
 * Any event listeners are automatically finalized @see {@link EphemeralListener }
 *
 * @todo Adopt a SCA polyfill if we expect circular references in payloads. @see https://github.com/ungap/structured-clone
 * @todo allow any payload type via overloads
 */
export class RpcClient extends EphemeralListener {
	private readonly subscribersMap = new Map<string, Set<Subscriber>>();

	private readonly logger: Logger;

	constructor(
		private readonly parentOrigin = '*',
		private readonly serialize: Serialize = JSON.stringify,
		private readonly deserialize: Deserialize = JSON.parse,
		logger: LoggerContract = Logger,
		loggerLocale = 'paper-cups',
		shouldDisableLogger: () => boolean = () => process.env.NODE_ENV === 'test'
	) {
		super('message');

		this.logger = new logger(loggerLocale, shouldDisableLogger);
	}

	/**
	 * Execute a subscription once. Non-blocking.
	 */
	once<T = any>(opcode: string, handler: Subscriber<T>) {
		const subscriptions = this.getSubscriptions(opcode);

		const subscription: Subscriber<T> = (...args) => {
			handler(...args);
			subscriptions.delete(subscription);
		};

		subscriptions.add(subscription);
	}

	/**
	 * Wait for the next message of a given `opcode`. ***This will block the main thread***.
	 * @param opcode An opcode indicating the procedure being executed.
	 * @param timeout Duration in milliseconds after which the wait period times out unless a message is received.
	 * For an indefinite wait-period, set this to -1 (not recommended).
	 */
	async listenAndWait<ReturnData = any>(opcode: string, timeout = 5000) {
		return new Promise<MaybeProps<ReturnData>>((resolve, reject) => {
			let timeoutId: NodeJS.Timeout | null = null;

			const unsubscribe = this.subscribe<ReturnData>(opcode, ({ payload }) => {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}

				unsubscribe();
				resolve(payload);
			});

			if (timeout > -1) {
				timeoutId = setTimeout(() => {
					unsubscribe();
					this.logger.error(`listenAndWait timed out after ${timeout}ms`);
					reject(new Error(`listenAndWait timed out after ${timeout}ms`));
				}, timeout);
			}
		});
	}

	/**
	 * Execute a message exchange and *wait* for the response. ***This will block the main thread***.
	 * @param opcode An opcode indicating the procedure being executed.
	 * @param payload The request payload.
	 * @param timeout Duration in milliseconds after which the wait period times out unless a message is received.
	 * For an indefinite wait-period, set this to -1 (not recommended).
	 */
	async sendAndWait<ReturnData = any, SendData = any>(
		opcode: string,
		payload?: SendData,
		timeout = 5000
	) {
		return new Promise<MaybeProps<ReturnData>>((resolve, reject) => {
			const expectedTxId: TransactionId = generateUuid();

			let timeoutId: NodeJS.Timeout | null = null;

			const unsubscribe = this.subscribe<ReturnData>(
				opcode,
				({ payload, txId }) => {
					/* istanbul ignore if */
					if (txId !== expectedTxId) {
						return;
					}

					if (timeoutId) {
						clearTimeout(timeoutId);
					}

					unsubscribe();
					resolve(payload);
				}
			);

			if (timeout > -1) {
				timeoutId = setTimeout(() => {
					unsubscribe();
					this.logger.error(`sendAndWait timed out after ${timeout}ms`);
					reject(new Error(`sendAndWait timed out after ${timeout}ms`));
				}, timeout);
			}

			this.sendMessage({
				opcode,
				payload,
				txId: expectedTxId
			});
		});
	}

	/**
	 * Subscribe to messages of type opcode.
	 * @param opcode An opcode indicating the procedure being executed.
	 * @param handler - {@link Subscriber} A subscriber function that will be invoked when a response message is received.
	 * @returns unsubscribe handler
	 */
	subscribe<ReturnData = any>(opcode: string, handler: Subscriber<ReturnData>) {
		const subscriptions = this.getSubscriptions(opcode);

		subscriptions.add(handler);

		return () => {
			subscriptions.delete(handler);
		};
	}

	sendMessage<T>({
		opcode,
		txId,
		payload,
		delay
	}: {
		opcode: string;
		txId?: TransactionId;
		payload?: T;
		delay?: number;
	}) {
		this.logger.info(
			`Queued up a message with opcode ${opcode}`,
			delay ? `to send in ${delay}ms` : ''
		);

		const send = () => {
			this.env.postMessage(
				this.serialize({
					opcode,
					payload,
					sender: true,
					txId
				}),
				this.parentOrigin
			);

			this.logger.info(
				`Message with opcode ${opcode} ${
					txId ? `and transaction Id ${txId}` : ''
				}`,
				'sent'
			);
		};

		if (isNumber(delay)) {
			setTimeout(send, delay);
		} else {
			send();
		}
	}

	/**
	 * Message receiver.
	 */
	protected onMessage(event: MessageEvent) {
		let { data } = event;

		if (!data) {
			return;
		}

		if (typeof data === 'string') {
			try {
				data = this.deserialize(event.data);
			} catch (ex) {} // eslint-disable-line no-empty
		}

		if (!this.isInboundRpcMessage(data)) {
			return;
		}

		this.subscribersMap.get(data.opcode)?.forEach((handler) => {
			handler(data);
		});
	}

	/**
	 * Validate whether the inbound message is expected and valid.
	 */
	private isInboundRpcMessage(data: any): data is InboundMessage {
		if (!data) {
			return false;
		}

		if (data.sender) {
			return false;
		}

		// validate data.origin
		// check denylist

		if (!data?.opcode) {
			return false;
		}

		if (data?.payload == null) {
			return false;
		}

		return true;
	}

	/**
	 * Resolve subscriptions for a given opcode.
	 */
	private getSubscriptions(opcode: string) {
		let subscriptions = this.subscribersMap.get(opcode);

		if (!subscriptions) {
			this.subscribersMap.set(opcode, (subscriptions = new Set()));
		}

		return subscriptions;
	}
}
