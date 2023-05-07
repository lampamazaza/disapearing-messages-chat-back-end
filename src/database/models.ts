/**
 * Model UserModel
 *
 */
export type UserModel = {
  id: number;
  publicKey: string;
  name: string;
  alias: string;
};

/**
 * Model ChatModel
 *
 */
export type ChatModel = {
  id: number;
  chatHash: string;
};

/**
 * Model UsersOnChats
 *
 */
export type UsersOnChats = {
  userPublicKey: string;
  chatId: number;
};

/**
 * Model MessageModel
 *
 */
export type MessageModel = {
  id: number;
  sender: string;
  text: string;
  sentAt: Date;
  chatId: number;
};
