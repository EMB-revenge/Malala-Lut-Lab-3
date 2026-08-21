import express from 'express';
import dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes';
import orderItemRoutes from './routes/orderItemRoutes';
import orderRoutes from './routes/orderRoutes';
import productRoutes from './routes/productRoutes';
import suppliesRoutes from './routes/suppliesRoutes';
import vendor from './routes/vendorRoutes';


dotenv.config();



const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/order-items', orderItemRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/supplies', suppliesRoutes);
app.use('/api/v1/vendors', vendor);


app.listen(PORT, () => {
  console.log(`E-commerce and Logistics server running on http://localhost:${PORT}`);
});
