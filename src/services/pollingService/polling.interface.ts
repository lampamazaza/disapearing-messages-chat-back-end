export interface IPollingService {
  subscribersStorage: {
    [key: string]: {
      resolver: (payload: any) => void;
      timeoutId: NodeJS.Timeout;
    };
  };
  missedPublishStorage: {
    [key: string]: {
      data: { [key: string]: boolean };
      timeoutId: NodeJS.Timeout;
    };
  };
  subscribe: (...args: unknown[]) => void;
  publish: (...args: unknown[]) => void;
}
