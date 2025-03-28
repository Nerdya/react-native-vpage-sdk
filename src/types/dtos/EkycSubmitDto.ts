export type EkycSubmitDto = {
  currentTime: number;
  expiredTime: number;
  numberLimit: number;
  count: number;
  transactionId: string;
  description: string;
  contractId: string;
  appointmentId: string;
};
