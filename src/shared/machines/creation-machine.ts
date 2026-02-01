export type CreationState =
  | 'IDLE'
  | 'UPLOADING_MEDIA'
  | 'CREATING_DB_RECORD'
  | 'ADDING_ALLOWLIST'
  | 'DEPLOYING_CONTRACT'
  | 'UPDATING_DB'
  | 'COMPLETED'
  | 'FAILED';

export type CreationEvent =
  | { type: 'START' }
  | { type: 'MEDIA_UPLOADED'; imageUrl: string; bannerUrl?: string }
  | { type: 'MEDIA_FAILED'; error: Error }
  | { type: 'DB_RECORD_CREATED'; collectionId: string }
  | { type: 'DB_RECORD_FAILED'; error: Error }
  | { type: 'ALLOWLIST_ADDED' }
  | { type: 'ALLOWLIST_FAILED'; error: Error }
  | { type: 'CONTRACT_DEPLOYED'; contractAddress: string; txHash: string }
  | { type: 'DEPLOYMENT_FAILED'; error: Error }
  | { type: 'DB_UPDATED' }
  | { type: 'DB_UPDATE_FAILED'; error: Error }
  | { type: 'RETRY' }
  | { type: 'RESET' };

interface StateContext {
  collectionId: string | null;
  imageUrl: string | null;
  bannerUrl: string | null;
  contractAddress: string | null;
  txHash: string | null;
  error: Error | null;
  failedAt: CreationState | null;
}

interface StateConfig {
  on: Partial<Record<CreationEvent['type'], CreationState | { target: CreationState; action?: string }>>;
}

const stateConfigs: Record<CreationState, StateConfig> = {
  IDLE: { on: { START: 'UPLOADING_MEDIA' } },
  UPLOADING_MEDIA: {
    on: { MEDIA_UPLOADED: 'CREATING_DB_RECORD', MEDIA_FAILED: 'FAILED' },
  },
  CREATING_DB_RECORD: {
    on: { DB_RECORD_CREATED: 'ADDING_ALLOWLIST', DB_RECORD_FAILED: 'FAILED' },
  },
  ADDING_ALLOWLIST: {
    on: { ALLOWLIST_ADDED: 'DEPLOYING_CONTRACT', ALLOWLIST_FAILED: 'FAILED' },
  },
  DEPLOYING_CONTRACT: {
    on: { CONTRACT_DEPLOYED: 'UPDATING_DB', DEPLOYMENT_FAILED: 'FAILED' },
  },
  UPDATING_DB: {
    on: { DB_UPDATED: 'COMPLETED', DB_UPDATE_FAILED: 'FAILED' },
  },
  COMPLETED: { on: { RESET: 'IDLE' } },
  FAILED: { on: { RETRY: 'UPLOADING_MEDIA', RESET: 'IDLE' } },
};

export class CreationMachine {
  private state: CreationState = 'IDLE';
  private context: StateContext = {
    collectionId: null,
    imageUrl: null,
    bannerUrl: null,
    contractAddress: null,
    txHash: null,
    error: null,
    failedAt: null,
  };
  private listeners = new Set<(state: CreationState, context: StateContext) => void>();

  get currentState(): CreationState { return this.state; }
  get currentContext(): Readonly<StateContext> { return { ...this.context }; }

  subscribe(listener: (state: CreationState, context: StateContext) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state, this.context));
  }

  transition(event: CreationEvent): boolean {
    const config = stateConfigs[this.state];
    const transition = config.on[event.type];

    if (!transition) {
      console.warn(`Invalid transition: ${this.state} -> ${event.type}`);
      return false;
    }

    this.updateContext(event);

    if (this.state !== 'FAILED' && event.type.endsWith('_FAILED')) {
      this.context.failedAt = this.state;
      this.context.error = (event as { error: Error }).error;
    }

    this.state = typeof transition === 'string' ? transition : transition.target;
    this.notify();
    return true;
  }

  private updateContext(event: CreationEvent): void {
    switch (event.type) {
      case 'MEDIA_UPLOADED':
        this.context.imageUrl = event.imageUrl;
        this.context.bannerUrl = event.bannerUrl ?? null;
        break;
      case 'DB_RECORD_CREATED':
        this.context.collectionId = event.collectionId;
        break;
      case 'CONTRACT_DEPLOYED':
        this.context.contractAddress = event.contractAddress;
        this.context.txHash = event.txHash;
        break;
      case 'RESET':
        this.context = {
          collectionId: null,
          imageUrl: null,
          bannerUrl: null,
          contractAddress: null,
          txHash: null,
          error: null,
          failedAt: null,
        };
        break;
    }
  }

  canTransition(eventType: CreationEvent['type']): boolean {
    const config = stateConfigs[this.state];
    return eventType in config.on;
  }

  get isTerminal(): boolean {
    return this.state === 'COMPLETED' || this.state === 'FAILED';
  }

  get isFailed(): boolean {
    return this.state === 'FAILED';
  }

  get canRetry(): boolean {
    return this.state === 'FAILED' && this.context.failedAt !== null;
  }
}
