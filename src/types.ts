export const TYPES = {
  Application: Symbol.for("Application"),
  ILogger: Symbol.for("ILogger"),
  UserController: Symbol.for("UserController"),
  UsersRepository: Symbol.for("UsersRepository"),
  UserService: Symbol.for("UserService"),
  ChatController: Symbol.for("ChatController"),
  ChatsRepository: Symbol.for("ChatsRepository"),
  ChatService: Symbol.for("ChatService"),
  ExeptionFilter: Symbol.for("ExeptionFilter"),
  ConfigService: Symbol.for("ConfigService"),
  SqliteService: Symbol.for("SqliteService"),

  MessageController: Symbol.for("MessageController"),
  MessagesRepository: Symbol.for("MessagesRepository"),
  MessageService: Symbol.for("MessageService"),

  PollingSerivce: Symbol.for("PollingService"),
  AuthenticationService: Symbol.for("AuthenticationService"),
  MessageDeletionService: Symbol.for("MessageDeletionService"),
};
