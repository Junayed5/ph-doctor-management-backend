import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt: process.env.BCRYPT_SALT_ROUNDS,
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    },
    opeAiApiKey: process.env.OPENAI_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebHookSecret: process.env.STRIPE_WEBHOOK_SECRET
}