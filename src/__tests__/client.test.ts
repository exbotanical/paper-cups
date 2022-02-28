import { RpcClient } from '../client';

import { TEST_OPCODE, TEST_OPCODE2, timeout, sendMessage } from './utils';
import type { TestPayload } from './types';

const txId = 'test';
jest.mock('uuid', () => ({
	v4: () => txId
}));

describe('rpc client', () => {
	const client = new RpcClient();

	it('`listenAndWait` throws an error if timeout is exceeded', async () => {
		const promise = client.listenAndWait(TEST_OPCODE, timeout);

		Promise.resolve().then(() => {
			jest.advanceTimersByTime(timeout * 2);
		});

		return promise.catch((ex) => {
			expect(ex.message).toBe(`listenAndWait timed out after ${timeout}ms`);
		});
	});

	it('`sendAndWait` throws an error if timeout is exceeded', async () => {
		const promise = client.sendAndWait(TEST_OPCODE, {}, timeout);

		Promise.resolve().then(() => {
			jest.advanceTimersByTime(timeout * 2);
		});

		return promise.catch((ex) => {
			expect(ex.message).toBe(`sendAndWait timed out after ${timeout}ms`);
		});
	});

	it('`once` subscribes to and receives a message only once', async () => {
		Promise.resolve().then(() => {
			sendMessage();
		});

		const data = await new Promise<TestPayload>((r) => {
			client.once(TEST_OPCODE, (data) => {
				r(data.payload);
			});
		});

		expect(data.x).toEqual(3);
		expect(data.y).toEqual(3);
	});

	it('`once` ignores messages to which it is not subscribed', async () => {
		const spy = jest.fn();

		Promise.resolve().then(() => {
			sendMessage({ opcode: TEST_OPCODE2 });
		});

		client.once(TEST_OPCODE, spy);

		expect(spy).not.toHaveBeenCalled();
	});

	it('`listenAndWait` waits for the next message of a given opcode', async () => {
		Promise.resolve().then(() => {
			sendMessage();
		});

		const { x, y } = await client.listenAndWait<TestPayload>(TEST_OPCODE);
		expect(x).toEqual(3);
		expect(y).toEqual(3);
	});

	it('`listenAndWait` ignores messages to which it is not subscribed', async () => {
		const promise = client.listenAndWait<TestPayload>(TEST_OPCODE, timeout);

		Promise.resolve().then(() => {
			sendMessage({ opcode: TEST_OPCODE2 });
		});

		Promise.resolve().then(() => {
			jest.advanceTimersByTime(timeout * 2);
		});

		return promise.catch(({ message }) => {
			expect(message).toBe(`listenAndWait timed out after ${timeout}ms`);
		});
	});

	it('`sendAndWait` waits for the next message of a given opcode and txId', async () => {
		Promise.resolve().then(() => {
			sendMessage({ opcode: TEST_OPCODE, txId });
		});

		const { x, y } = await client.sendAndWait<TestPayload>(
			TEST_OPCODE,
			{},
			timeout
		);

		expect(x).toEqual(3);
		expect(y).toEqual(3);
	});

	it('`sendAndWait` sends a postMessage', () => {
		const spy = jest.fn();
		const mock = jest.spyOn(window, 'postMessage').mockImplementation(spy);

		client.sendAndWait(TEST_OPCODE);

		expect(mock).toBeCalledTimes(1);
	});

	it('`sendAndWait` ignores messages to which it is not subscribed', () => {
		const promise = client.sendAndWait<TestPayload>(TEST_OPCODE, {}, timeout);

		Promise.resolve().then(() => {
			sendMessage({ opcode: TEST_OPCODE2, txId });
		});

		Promise.resolve().then(() => {
			jest.advanceTimersByTime(timeout * 2);
		});

		return promise.catch(({ message }) => {
			expect(message).toBe(`sendAndWait timed out after ${timeout}ms`);
		});
	});

	it('`sendAndWait` ignores messages which lack a matching txId', () => {
		const promise = client.sendAndWait<TestPayload>(TEST_OPCODE, {}, timeout);

		Promise.resolve().then(() => {
			sendMessage({ opcode: TEST_OPCODE, txId: 'test2' });
		});

		Promise.resolve().then(() => {
			jest.advanceTimersByTime(timeout * 2);
		});

		return promise.catch(({ message }) => {
			expect(message).toBe(`sendAndWait timed out after ${timeout}ms`);
		});
	});

	it('`sendMessage` sends a postMessage', () => {
		const spy = jest.fn();
		const mock = jest.spyOn(window, 'postMessage').mockImplementation(spy);

		client.sendMessage({
			opcode: TEST_OPCODE
		});

		expect(mock).toBeCalledTimes(1);
	});

	it('`sendMessage` sends after the specified delay', () => {
		const delay = 1000;
		const spy = jest.fn();
		const mock = jest.spyOn(window, 'postMessage').mockImplementation(spy);

		client.sendMessage({
			opcode: TEST_OPCODE,
			delay
		});

		expect(mock).toBeCalledTimes(0);

		jest.advanceTimersByTime(delay);
		expect(mock).toBeCalledTimes(1);
	});

	it('sets the parent origin', () => {
		const origin = 'test';
		const spy = jest.fn();
		const mock = jest.spyOn(window, 'postMessage').mockImplementation(spy);

		const localClient = new RpcClient(origin);
		localClient.sendMessage({
			opcode: TEST_OPCODE
		});

		expect(mock).toBeCalledTimes(1);
		expect(mock).toHaveBeenCalledWith(expect.any(String), origin);
	});
});
