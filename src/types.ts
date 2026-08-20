export interface Customer {
    customer_id: string;
    customer_name: string;
    city?: string;
    membership_level?: string;
}

export interface Order {
    order_id: string;
    customer_id: string;
    order_date?: Date;
    shipping_city?: string;
}

export interface Product {
    product_id: string;
    product_name: string;
    category?: string;
    unit_price?: number;
}

export interface OrderItem {
    order_id: string;
    product_id: string;
    quantity?: number;
    discount?: number;
}

export interface Vendor {
    vendor_id: string;
    vendor_name: string;
    city?: string;
}

export interface Supply {
    vendor_id: string;
    product_id: string;
    stock_quantity?: number;
}