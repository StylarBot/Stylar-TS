import dotenv from 'dotenv';
import StylarClient from './utils/StylarClient';

dotenv.config();

new StylarClient().init({
    token: process.env.TOKEN
});
