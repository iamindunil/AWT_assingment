//import libraries
import express, {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//import endpoint routers
import authRouter from './auth-routes/user-auth-route.js';
import bookRouter from './routes/book-routes.js';
import checkoutHistoryRouter from './routes/checkout-history-routes.js';
import emailVerificationRouter from './routes/email-verification-routes.js';
import paymentRouter from './routes/payment-routes.js';
import shippingRouter from './routes/shipping-routes.js';
import shoppingCartRouter from './routes/shopping-cart-routes.js';
import userRouter from './routes/user-routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {credentials: true, origin: 'http://localhost:3000'};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

//configure routers to redirect to endpoints
app.use('/auth', authRouter);
app.use('/books',bookRouter);
app.use('/checkout-history', checkoutHistoryRouter);
app.use('/email-verification', emailVerificationRouter);
app.use('/payments', paymentRouter);
app.use('/shipping-info', shippingRouter);
app.use('/shopping-cart', shoppingCartRouter);
app.use('/user', userRouter);


app.listen(PORT, ()=>console.log(`Server listening on ${PORT}`));