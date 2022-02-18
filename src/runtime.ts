type WindowEventName = keyof WindowEventHandlersEventMap;
type WindowEvent = WindowEventHandlersEventMap[WindowEventName];

/**
 * Register event listeners with automatic cleanup.
 *
 * Note: We utilize a finalization registry because we cannot guarantee when in the consumer's lifecycle
 * these listeners may be instantiated. If the consumer environment is using React of Vue,
 * this may be any time prior to the respective instance creation, or long after its disposal.
 * Similarly, we cannot assume the window object is wholly finalized as we cannot make assumptions about the process in which it is running.
 * Said process' address space may or may not be persistent; in the former scenario, event listeners may accumulate and captivate memory.
 */
export abstract class EphemeralListener {
	// run noop as IIFE so we don't bother creating it unless it's needed
	protected runtime = window || (() => buildNoopRuntime())();

	constructor(public eventType: WindowEventName) {
		const onFinalized = (handler: (event: WindowEvent) => void) => {
			this.runtime.removeEventListener(eventType, handler);
		};

		let finalizer: FinalizationRegistry<any> | null = new FinalizationRegistry(
			onFinalized
		);

		// weak references i.e. will be captured by v8's mark and sweep algorithm
		// so long as nothing references them
		const weakRef = new WeakRef(this);

		const handler = (event: WindowEvent) => {
			finalizer = null;

			// invoke the real handler, which the subclass consumer must implement
			weakRef.deref()?.onMessage(event);
		};

		finalizer.register(this, handler);

		this.runtime.addEventListener(eventType, handler);
	}

	protected abstract onMessage(
		event: WindowEventHandlersEventMap[keyof WindowEventHandlersEventMap]
	): void;
}

function buildNoopRuntime() {
	/**
	 * Noop object that can chain function invocations without throwing an exception.
	 */
	const noop: any = new Proxy(
		{},
		{
			get(target, prop, receiver) {
				// if (prop === known intermediates here) {
				// 	return receiver;
				// }
				return () => receiver;
			},
			apply(target, thisArg) {
				return () => thisArg;
			}
		}
	);

	return noop as unknown as Window;
}
