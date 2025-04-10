export const environment = {
  GET_CONFIG_INFO: '/vekyc/campaign/config-agent',
  CREATE_MEETING: '/vekyc/meeting/:id/init',
  SAVE_LOG: '/vekyc/contract-action-histories',
  SUBMIT: '/vekyc/submit',
  VERIFY_OTP: '/vekyc/submit/verify',
  RESEND_OTP: '/vekyc/otp/resend',
  CHECK_SELF_KYC: '/vekyc/campaign/config/cus-auth',
  HOOK: '/vekyc/hook',
  CLOSE_VIDEO: '/vekyc/close-video',
  RATING: '/vekyc/rating/:id',

  SOCKET_CHAT: '/websocket-agent',
}

export enum ActionHistory {
  CUSTOMER_ACTIVED_LINK = 'CUSTOMER_ACTIVED_LINK',
  CUSTOMER_OTP_CONFIRMED = 'CUSTOMER_OTP_CONFIRMED',
  CUSTOMER_TEST_CAM_MIC = 'CUSTOMER_TEST_CAM_MIC',
  CUSTOMER_INCOMMING = 'CUSTOMER_INCOMMING',
}
