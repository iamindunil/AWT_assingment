'use client';

import { useCheckout } from './CheckoutContext';
import { useCart } from '@/context/CartContext';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import OrderReview from './OrderReview';
import { FaShoppingCart, FaTruck, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const steps = [
  { id: 1, name: 'Cart', icon: FaShoppingCart },
  { id: 2, name: 'Shipping', icon: FaTruck },
  { id: 3, name: 'Payment', icon: FaCreditCard },
  { id: 4, name: 'Review', icon: FaCheckCircle },
];

export default function CheckoutForm() {
  const { step, nextStep, prevStep, placeOrder, isSubmitting } = useCheckout();
  const { cartItems, totalItems } = useCart();

  if (totalItems === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600">
          You don't have any items in your cart to checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Checkout Steps Progress */}
          <div className="hidden md:flex items-center mb-8">
            {steps.map((s, i) => (
              <div key={s.id} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <s.icon size={16} />
                </div>
                <div
                  className={`text-sm mt-2 ${
                    step >= s.id ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {s.name}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-1 w-full mt-3 ${
                      step > s.id ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden mb-6 text-center">
            <h2 className="text-lg font-medium">
              Step {step} of {steps.length}: {steps.find(s => s.id === step)?.name}
            </h2>
          </div>

          {/* Current Step Content */}
          {step === 1 && (
            <div className="text-center py-8">
              <button onClick={nextStep} className="btn-primary px-8">
                Begin Checkout
              </button>
            </div>
          )}

          {step === 2 && <ShippingForm />}
          {step === 3 && <PaymentForm />}
          {step === 4 && (
            <OrderReview
              onPlaceOrder={placeOrder}
              onPrevStep={prevStep}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Navigation Buttons - Only show for steps 2 and 3 */}
        {(step === 2 || step === 3) && (
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="btn-primary"
              disabled={isSubmitting}
            >
              {step === 3 ? 'Review Order' : 'Continue'}
            </button>
          </div>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <OrderSummary />
      </div>
    </div>
  );
} 