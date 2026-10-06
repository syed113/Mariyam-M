import React, { useState } from 'react';
import {
  X,
  Compass,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Search,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { api } from '../../services/api';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder?: Order | null;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  selectedOrder: propOrder
}) => {
  const { orders } = useStore();
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const currentOrder = searchedOrder || propOrder || orders[0];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderNumber.trim()) return;
    const found = orders.find(
      o =>
        o.orderNumber.toLowerCase() === searchOrderNumber.trim().toLowerCase() ||
        o.id === searchOrderNumber.trim() ||
        o.trackingNumber?.toLowerCase() === searchOrderNumber.trim().toLowerCase()
    );
    if (found) {
      setSearchedOrder(found);
    } else {
      try {
        const remoteOrder = await api.trackOrder(searchOrderNumber.trim());
        if (remoteOrder) {
          setSearchedOrder(remoteOrder);
        }
      } catch (err) {
        setSearchedOrder(null);
      }
    }
  };

  const getStepStatus = (stepName: string, orderStatus: string) => {
    const sequence = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIdx = sequence.indexOf(orderStatus);
    const stepIdx = sequence.indexOf(stepName);

    if (currentIdx >= stepIdx) return 'completed';
    if (currentIdx === stepIdx - 1) return 'current';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FCF9F5] border border-[#E8DAC2] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#4A0E17] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg">Live Consignment Tracking</h3>
              <p className="text-[10px] text-[#EADFCB]">Blue Dart Express & Shiprocket Air</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Search Order Number bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Track by Order # (e.g. MM-2026-9481) or AWB number"
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9C8AF] rounded-xl text-xs focus:outline-none focus:border-[#4A0E17]"
              />
              <Search className="w-4 h-4 text-[#8E7E73] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#4A0E17] text-white rounded-xl text-xs font-semibold hover:bg-[#621420] transition-colors"
            >
              Track
            </button>
          </form>

          {currentOrder ? (
            <div className="space-y-6">
              {/* Consignment Banner */}
              <div className="bg-white border border-[#E8DAC2] rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#A37B30] uppercase tracking-wider">
                      Order Reference
                    </span>
                    <h4 className="text-base font-bold text-[#351016]">
                      {currentOrder.orderNumber}
                    </h4>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Status</span>
                    <span className="inline-block px-3 py-1 bg-[#4A0E17] text-white rounded-full text-xs font-bold uppercase tracking-wider">
                      {currentOrder.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-700">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Courier Partner</span>
                    <span className="font-semibold text-gray-900">{currentOrder.courierName || 'Blue Dart Air'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">AWB Tracking No.</span>
                    <span className="font-mono font-semibold text-[#4A0E17]">{currentOrder.trackingNumber || 'BD-78912384IN'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Estimated Delivery</span>
                    <span className="font-semibold text-emerald-800">{currentOrder.estimatedDeliveryDate}</span>
                  </div>
                </div>
              </div>

              {/* Visual Stepper Timeline */}
              <div className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Delivery Progress
                </h4>

                <div className="relative pl-6 space-y-6 border-l-2 border-[#E8DAC2] ml-3">
                  {[
                    { title: 'Order Confirmed', desc: 'Payment received, sent to formulation laboratory.' },
                    { title: 'Packed & Sanitized', desc: 'Securely packaged in thermal insulated gift casing.' },
                    { title: 'Shipped', desc: 'Handed over to Blue Dart Express hub for priority transit.' },
                    { title: 'Out for Delivery', desc: 'Courier courier agent dispatched to recipient address.' },
                    { title: 'Delivered', desc: 'Delivered with signature receipt.' }
                  ].map((stepItem, i) => {
                    const status = getStepStatus(stepItem.title, currentOrder.status);
                    const isDone = status === 'completed';
                    const isCurrent = status === 'current';

                    return (
                      <div key={i} className="relative">
                        <span
                          className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                            isDone
                              ? 'bg-[#4A0E17]'
                              : isCurrent
                              ? 'bg-[#D4AF37] ring-4 ring-[#D4AF37]/20 animate-pulse'
                              : 'bg-gray-300'
                          }`}
                        >
                          {isDone ? '✓' : i + 1}
                        </span>
                        <div>
                          <p className={`text-xs font-bold ${isDone || isCurrent ? 'text-[#351016]' : 'text-gray-400'}`}>
                            {stepItem.title}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{stepItem.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Consignment Items ({currentOrder.items.length})
                </h4>

                <div className="space-y-2">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-[#FCF9F5] rounded-xl border border-[#E8DAC2]">
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-white"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                        {item.selectedShade && (
                          <p className="text-[11px] text-gray-500">Shade: {item.selectedShade.name}</p>
                        )}
                        <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-[#4A0E17]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex justify-between text-xs font-bold text-gray-800">
                  <span>Total Consignment Value:</span>
                  <span className="text-[#4A0E17]">₹{currentOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-500">
              No active orders found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
