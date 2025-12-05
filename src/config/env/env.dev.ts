export default () => (
    {
        //system
        Port: process.env.PORT,

        // database
        db: {
            url: process.env.DB_URL
        },
        email: {
            host: process.env.EMAIL_HOST,
            user: process.env.USER_EMAIL,
            password: process.env.PASSWORD_EMAIL,

        },
        encrypt: {
            key: process.env.ENCRYPTION_KEY_HASH,
            saltRounds: process.env.SALTROUNDS
        },
        token: {
            access: process.env.JWT_SECRET,
            refresh: process.env.JWT_REFRESH_SECRET,
            expiredAccess: process.env.JWT_EXPIRATION,
            expiredRefresh: process.env.JWT_REFRESH_EXPIRATION,

        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        cloudinary: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            apiSecret: process.env.CLOUDINARY_API_SECRET,
            folder: process.env.CLOUDINARY_FOLDER
        }

    });
