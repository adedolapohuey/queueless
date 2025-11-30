export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const defaults: {
  page: number;
  perPage: number;
} = {
  page: 1,
  perPage: 20,
};
