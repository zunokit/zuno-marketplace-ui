import { describe, it, expect, vi } from 'vitest';
import { CreationMachine } from './creation-machine';

describe('CreationMachine', () => {
  it('should start in IDLE state', () => {
    const machine = new CreationMachine();
    expect(machine.currentState).toBe('IDLE');
    expect(machine.isTerminal).toBe(false);
    expect(machine.canRetry).toBe(false);
  });

  it('should transition through all states', () => {
    const machine = new CreationMachine();
    const listener = vi.fn();
    machine.subscribe(listener);

    // Start -> UPLOADING_MEDIA
    expect(machine.transition({ type: 'START' })).toBe(true);
    expect(machine.currentState).toBe('UPLOADING_MEDIA');
    expect(listener).toHaveBeenCalledWith('UPLOADING_MEDIA', expect.any(Object));

    // UPLOADING_MEDIA -> CREATING_DB_RECORD
    machine.transition({ type: 'MEDIA_UPLOADED', imageUrl: 'http://test.com/image.png' });
    expect(machine.currentState).toBe('CREATING_DB_RECORD');

    // CREATING_DB_RECORD -> ADDING_ALLOWLIST
    machine.transition({ type: 'DB_RECORD_CREATED', collectionId: '123' });
    expect(machine.currentState).toBe('ADDING_ALLOWLIST');

    // ADDING_ALLOWLIST -> DEPLOYING_CONTRACT
    machine.transition({ type: 'ALLOWLIST_ADDED' });
    expect(machine.currentState).toBe('DEPLOYING_CONTRACT');

    // DEPLOYING_CONTRACT -> UPDATING_DB
    machine.transition({ type: 'CONTRACT_DEPLOYED', contractAddress: '0x123', txHash: '0xabc' });
    expect(machine.currentState).toBe('UPDATING_DB');

    // UPDATING_DB -> COMPLETED
    machine.transition({ type: 'DB_UPDATED' });
    expect(machine.currentState).toBe('COMPLETED');
    expect(machine.isTerminal).toBe(true);
  });

  it('should handle failures and retries', () => {
    const machine = new CreationMachine();
    machine.transition({ type: 'START' });
    machine.transition({ type: 'MEDIA_UPLOADED', imageUrl: 'test' });

    // Simulate failure
    const error = new Error('DB failed');
    machine.transition({ type: 'DB_RECORD_FAILED', error });

    expect(machine.currentState).toBe('FAILED');
    expect(machine.isFailed).toBe(true);
    expect(machine.canRetry).toBe(true);
    expect(machine.currentContext.error).toBe(error);
    expect(machine.currentContext.failedAt).toBe('CREATING_DB_RECORD');

    // Retry
    machine.transition({ type: 'RETRY' });
    expect(machine.currentState).toBe('UPLOADING_MEDIA');
  });

  it('should reset to IDLE from COMPLETED', () => {
    const machine = new CreationMachine();
    machine.transition({ type: 'START' });
    machine.transition({ type: 'MEDIA_UPLOADED', imageUrl: 'test' });
    machine.transition({ type: 'DB_RECORD_CREATED', collectionId: '123' });
    machine.transition({ type: 'ALLOWLIST_ADDED' });
    machine.transition({ type: 'CONTRACT_DEPLOYED', contractAddress: '0x123', txHash: '0xabc' });
    machine.transition({ type: 'DB_UPDATED' });
    expect(machine.currentState).toBe('COMPLETED');

    machine.transition({ type: 'RESET' });
    expect(machine.currentState).toBe('IDLE');
    expect(machine.currentContext.collectionId).toBeNull();
    expect(machine.currentContext.imageUrl).toBeNull();
    expect(machine.currentContext.contractAddress).toBeNull();
    expect(machine.currentContext.txHash).toBeNull();
  });

  it('should not allow invalid transitions', () => {
    const machine = new CreationMachine();
    expect(machine.transition({ type: 'MEDIA_UPLOADED', imageUrl: 'test' })).toBe(false);
    expect(machine.currentState).toBe('IDLE');
  });

  it('should update context correctly', () => {
    const machine = new CreationMachine();
    machine.transition({ type: 'START' });
    machine.transition({ type: 'MEDIA_UPLOADED', imageUrl: 'http://image.png', bannerUrl: 'http://banner.png' });

    expect(machine.currentContext.imageUrl).toBe('http://image.png');
    expect(machine.currentContext.bannerUrl).toBe('http://banner.png');

    machine.transition({ type: 'DB_RECORD_CREATED', collectionId: 'col-123' });
    expect(machine.currentContext.collectionId).toBe('col-123');

    machine.transition({ type: 'ALLOWLIST_ADDED' });
    machine.transition({ type: 'CONTRACT_DEPLOYED', contractAddress: '0xabc', txHash: '0xdef' });
    expect(machine.currentContext.contractAddress).toBe('0xabc');
    expect(machine.currentContext.txHash).toBe('0xdef');
  });
});
