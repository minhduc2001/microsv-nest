export interface IFirebaseSendNotificationGroupDevices {
  notification: {
    title: string;
    body: string;
    icon?: string;
    click_action?: string;
  };
  data?: {
    message_id?: string;
    sender_name?: string;
    sender_avatar?: string;
    message_content?: string;
  };
  registrationTokens: string[];
  notification_key: string;
  notification_key_name: string;
  userId?: number;
}

export interface IAddGroupDevices {
  registerIds: string[];
  notification_key_name: string;
}

export interface IUpdateGroupDevices {
  registrationTokens: string[];
  notification_key: string;
  notification_key_name: string;
}

export interface IFirebaseSendNotification {
  body?: string;
  title: string;
  token: string;
}

export interface IResponseFirebase {
  notification_key: string;
}
