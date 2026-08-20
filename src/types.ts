export  interface Customer {
    customer_id: number;
    customer_name: string;
    city: string;
    membership_level: string;

}

export interface Order { 
    order_id: number;
    customer_id: number;
    order_date: Date;
    shipping_city: string;
}

export interface Product {
    product_id: number;
    product_name: string;
    category: string;
    unit_price: number;
}

export interface OrderItem {
    order_item_id: number;
    product_id: number;
    quantity: number;
    discount: number;
}

export interface Vendor {
    vendor_id: number;  
    vendor_name: string;
    city: string;
}

export interface supplies {
    vendor_id: number;
    product_id: number;
    stock_quantity: number;
    
}