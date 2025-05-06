'use client';

import { useRef } from 'react';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { generatePdf } from '@/utils/pdfUtils';

interface InvoiceProps {
  orderItems: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  totalAmount: number;
  orderDate: string;
  orderNumber: string;
  onDownloadPdf?: () => void;
}

export default function Invoice({
  orderItems,
  shippingInfo,
  totalAmount,
  orderDate,
  orderNumber,
  onDownloadPdf
}: InvoiceProps) {
  const router = useRouter();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    try {
      if (onDownloadPdf) {
        onDownloadPdf();
      } else if (invoiceRef.current) {
        await generatePdf(invoiceRef.current, `invoice-${orderNumber}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to window print if PDF generation fails
      window.print();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => router.push('/orders')}
          className="flex items-center text-primary-600 hover:text-primary-800"
        >
          <FaArrowLeft className="mr-2" />
          Go to My Orders
        </button>
        <button
          onClick={handleDownloadPdf}
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          <FaDownload className="mr-2" />
          Download Invoice
        </button>
      </div>

      <div 
        ref={invoiceRef} 
        className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto"
        id="invoice-content"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold">INVOICE</h1>
            <p className="text-gray-600">#{orderNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-xl">Online Book Manager</h2>
            <p className="text-gray-600">123 Book Street</p>
            <p className="text-gray-600">Booktown, BK 12345</p>
            <p className="text-gray-600">support@onlinebookmanager.com</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
            <p>{shippingInfo.address}</p>
            <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}</p>
            <p>{shippingInfo.country}</p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-gray-700 mb-2">Invoice Details:</h3>
            <p><span className="font-medium">Invoice Date:</span> {new Date(orderDate).toLocaleDateString()}</p>
            <p><span className="font-medium">Order Date:</span> {new Date(orderDate).toLocaleDateString()}</p>
            <p><span className="font-medium">Payment Method:</span> Credit Card</p>
          </div>
        </div>

        <div className="border-t border-b py-4 mb-8">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-3">Item</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Price</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems && orderItems.length > 0 ? (
                orderItems.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3">{item.title}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3">${item.price.toFixed(2)}</td>
                    <td className="py-3 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td colSpan={4} className="py-3 text-center text-gray-500">
                    No items in order
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Thank you for your purchase!</p>
          <p>If you have any questions, please contact our customer support.</p>
        </div>
      </div>
    </div>
  );
} 