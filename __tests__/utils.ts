/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const TEST_OPCODE = 'TEST_OPCODE'
export const TEST_OPCODE2 = 'TEST_OPCODE2'
export const txId = 'test'
export const timeout = 100
export const testPayload = {
  x: 3,
  y: 3,
}

export function sendMessage({
  payload = testPayload,
  opcode = TEST_OPCODE,
  txId,
}: { opcode?: string; payload?: any; txId?: string } = {}) {
  window.postMessage(
    {
      opcode,
      payload,
      ...(txId ? { txId } : {}),
    },
    '*',
  )
}
