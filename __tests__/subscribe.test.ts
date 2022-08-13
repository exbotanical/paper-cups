 
import { RpcClient } from '../src/client';

import { TEST_OPCODE, TEST_OPCODE2, testPayload, sendMessage } from './utils';

describe('rpc client subscriptions', () => {
	const client = new RpcClient();
	it('`subscribe` subscribes to message events of a given opcode', (done) => {
		client.subscribe(TEST_OPCODE, (data) => {
			expect(data.payload).toStrictEqual(testPayload);
			done();
		});

		sendMessage();
	});

	it('`subscribe` returns an unsubscribe handler', (done) => {
		const spy = jest.fn();

		function assert() {
			expect(spy).toHaveBeenCalledTimes(0);
			done();
		}

		const unsubscribe = client.subscribe(TEST_OPCODE, (data) => {
			spy(data);
		});

		unsubscribe();

		// Recall, Zito - we need a second handler; we need it to be placed last in the message queue in order to invoke `assert`.
		// We cannot manually flush the microtask queue of message events because said events have not happened yet;
		// they're placed in one of the many separate task queues maintained by the event loop. JSDOM creates a task per listener.
		// Microtasks scheduled in event listeners are invoked before those of the next listener -
		// however, if the event is dispatched manually, the microtasks run after *all* listeners are finished.
		// Potentially, the stack never empties.
		// ugh what a pain
		client.subscribe(TEST_OPCODE2, () => {
			assert();
		});

		sendMessage();
		sendMessage({ opcode: TEST_OPCODE2 });
	});

	it('`subscribe` ignores opcodes to which it is not subscribed', (done) => {
		const spy = jest.fn();

		function assert() {
			expect(spy).toHaveBeenCalledTimes(1);
			u();
			u2();
			done();
		}

		const u = client.subscribe(TEST_OPCODE, (data) => {
			spy(data);
		});

		const u2 = client.subscribe(TEST_OPCODE2, () => {
			assert();
		});

		sendMessage();
		sendMessage({ opcode: TEST_OPCODE2 });
	});

	it('ignores messages which contain a nullish payload', (done) => {
		const spy = jest.fn();

		function assert() {
			expect(spy).toHaveBeenCalledTimes(1);
			u();
			u2();
			done();
		}

		const u = client.subscribe(TEST_OPCODE, (data) => {
			spy(data);
		});

		const u2 = client.subscribe(TEST_OPCODE2, () => {
			assert();
		});

		sendMessage();

		sendMessage({ payload: null });
		sendMessage({ opcode: TEST_OPCODE2 });
	});

	it('ignores messages which contain no opcode', (done) => {
		const spy = jest.fn();

		function assert() {
			expect(spy).toHaveBeenCalledTimes(0);
			u();
			u2();
			done();
		}

		const u = client.subscribe(TEST_OPCODE, (data) => {
			spy(data);
		});

		const u2 = client.subscribe(TEST_OPCODE2, () => {
			assert();
		});

		// @ts-expect-error
		sendMessage({ opcode: null });
		sendMessage({ opcode: TEST_OPCODE2 });
	});

	it('ignores messages which contain no data', (done) => {
		const spy = jest.fn();

		function assert() {
			expect(spy).toHaveBeenCalledTimes(0);

			done();
		}

		client.subscribe(TEST_OPCODE, (data) => {
			spy(data);
		});

		client.subscribe(TEST_OPCODE2, () => {
			assert();
		});

		window.dispatchEvent(
			new MessageEvent('message', {
				data: null
			})
		);

		sendMessage({ opcode: TEST_OPCODE2 });
	});
});
