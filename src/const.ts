import path from 'path';
import process from 'process';

const BASE_DIR: string = path.resolve('.').toString();
const PORT: number = parseInt(process.env.PORT!) || 3000;
const SECRET: string = process.env.SECRET || '#sl_@*kvc&=!&dfujo8x0%$m(2)3b#ukrg#yg&ogtf_*8jkj%h';

export { BASE_DIR, PORT, SECRET };