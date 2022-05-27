export interface IMessagesRepository {
  create: (message: any) => Promise<any>;
}
