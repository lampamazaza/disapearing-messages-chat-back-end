import { injectable } from "inversify";
import { IPollingService } from "./polling.interface";
import { Response } from "express";
import "reflect-metadata";

@injectable()
export class PollingService implements IPollingService {
  readonly subscribersStorage;
  readonly missedPublishStorage;

  constructor() {
    this.subscribersStorage = {};
    this.missedPublishStorage = {};
  }

  subscribe(
    id: string,
    onSuccess: (...args: unknown[]) => void,
    onFail: () => void
  ): void {
    if (this.missedPublishStorage[id]) {
      clearInterval(this.missedPublishStorage[id].timeoutId);
      onSuccess(this.missedPublishStorage[id].data);
      delete this.missedPublishStorage[id];
      return;
    }
    if (this.subscribersStorage[id]) {
      return;
    }

    const timeoutId = setTimeout(() => {
      clearInterval(this.subscribersStorage[id].timeoutId);
      delete this.subscribersStorage[id];
      onFail();
    }, 120_000);

    this.subscribersStorage[id] = {};

    this.subscribersStorage[id].timeoutId = timeoutId;

    this.subscribersStorage[id].resolver = (payload) => {
      clearInterval(this.subscribersStorage[id].timeoutId);
      onSuccess(payload);
      delete this.subscribersStorage[id];
    };
  }

  publish(
    id: string,
    payload: any,
    missedDataMerger: (oldData: any) => any
  ): void {
    if (this.subscribersStorage[id]) {
      this.subscribersStorage[id].resolver(payload);
    } else {
      // has records
      if (this.missedPublishStorage[id]) {
        this.missedPublishStorage[id].data = missedDataMerger(
          this.missedPublishStorage[id].data
        );
        clearInterval(this.missedPublishStorage[id].timeoutId);
        const timeoutId = setTimeout(() => {
          clearInterval(this.missedPublishStorage[id].timeoutId);
          delete this.missedPublishStorage[id];
        }, 15_000);
        this.missedPublishStorage[id].timeoutId = timeoutId;
      } else {
        // no records
        const timeoutId = setTimeout(() => {
          clearInterval(this.missedPublishStorage[id].timeoutId);
          delete this.missedPublishStorage[id];
        }, 15_000);

        this.missedPublishStorage[id] = {
          data: payload,
          timeoutId: timeoutId,
        };
      }
    }
  }
}
