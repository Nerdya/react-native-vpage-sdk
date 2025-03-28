export const environment = {
  EKYC_SUBMIT: '/vekyc/submit',
  EKYC_HOOK: '/vekyc/hook',
  VERIFY_OTP: '/vekyc/submit/verify',
  RESEND_OTP: '/vekyc/otp/resend',
  EKYC_CLOSE_VIDEO: '/vekyc/close-video',

  SOCKET_CHAT: '/websocket-agent',

  VERIFY_CAPTCHA: '/vekyc/verify/captcha',
  CONFIRM_CONTRACT: '/vekyc/meeting/:id/confirm',
  OPENCC_DBS_CC: '/vekyc/dbs-cc/update',
  REJECT_CONTRACT: '/vekyc/info/:id/reject',

  RESEND_OTP_CONFIRM: '/vekyc/meeting/:id/confirm/otp/resend',
  VERIFY_OTP_CONFIRM: '/vekyc/meeting/:id/confirm/verify',
  REJECT_OTP_CONFIRM: '/vekyc/info/:id/reject/verify',
  GET_URL_CONTRACT: '/vekyc/info-ekyc/:id/url-contact',
  DOWNLOAD_FILE: '/file/download',
  GET_LIST_CONTRACT: '/vekyc/app/contracts',
  RATING: '/vekyc/rating/:id',
  LIST_COMPATIBLE_DEVICES: '/vekyc/device/allowed',
  INIT_CALL: '/vekyc/call/init',

  EKYC_MEETING: '/vekyc/meeting/:id/init',
  GET_JARVISCUSTOMERUPL_REDIRECT: '/vekyc/meeting/:id/generate-jarviscustomerupl-redirect',
  GET_CONTRACT_INFO_DBS: '/vekyc/meeting/:id/info-contract',
  SAVE_CONTRACT_ACTION: '/vekyc/contract-action-histories',
  CHECK_SELF_KYC: '/vekyc/campaign/config/cus-auth',
  GET_CONFIG_INFO: '/vekyc/campaign/config-agent',
  SELF_EKYC: '/vekyc/subscribe/self-call',
  UPLOAD_IMAGE_BY_FOLDER_CODE: '/file/upload-image-by-folder-code',
  CHECK_EKYC: '/vekyc/ekyc',
  GET_MEETING_BY_ID: '/vekyc/meeting/:id',
  UPDATE_KYC_AUTO: '/vekyc/ekyc-auto/:id/update',
  UPDATE_KYC: '/vekyc/meeting/:id/update',
  GET_FOLDER_DOC_TYPE_2: '/vekyc/app/type-identification',
  GET_DYNAMIC_REDIRECT: '/vekyc/meeting/:id/generate-redirect',
  SAVE_LOGS: '/vekyc/logs',
}

export enum ActionHistory {
  CUSTOMER_ACTIVED_LINK = 'CUSTOMER_ACTIVED_LINK',
  CUSTOMER_OTP_CONFIRMED = 'CUSTOMER_OTP_CONFIRMED',
  CUSTOMER_TEST_CAM_MIC = 'CUSTOMER_TEST_CAM_MIC',
  CUSTOMER_INCOMMING = 'CUSTOMER_INCOMMING',
}
