//otp -> {code, type, expiresIn}
export const generateOtp = () => {
    const n = Math.floor(100000 + Math.random() * 900000);
    return String(n);//6 digit otp
}

export const generateExpiryTime = (time: number = 10) => {
    return new Date(Date.now() + 1000 * 60 * time);//10 min
}
