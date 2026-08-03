import { CheckCircle2, Circle, Clock, Package, Truck, Building2, Navigation, CheckCircle } from 'lucide-react';
import './OrderTimeline.css';

export const TIMELINE_STAGES = [
  { key: 'ordered', title: 'Ordered', icon: Clock, desc: 'Order confirmed & verified' },
  { key: 'packed', title: 'Packed', icon: Package, desc: 'Packed in secure AAAN box' },
  { key: 'dispatched', title: 'Dispatched', icon: Truck, desc: 'Air courier assigned' },
  { key: 'hub', title: 'Hub', icon: Building2, desc: 'Reached regional logistics hub' },
  { key: 'out_for_delivery', title: 'Out for Delivery', icon: Navigation, desc: 'Delivery agent en route' },
  { key: 'delivered', title: 'Delivered', icon: CheckCircle, desc: 'Delivered to customer' }
];

export default function OrderTimeline({ order }) {
  const currentStatus = (order?.status || 'ordered').toLowerCase().replace(/\s+/g, '_');

  // Compute completed stages index
  const getStageIndex = (status) => {
    switch (status) {
      case 'ordered':
      case 'pending':
        return 0;
      case 'packed':
      case 'processing':
        return 1;
      case 'dispatched':
      case 'shipped':
        return 2;
      case 'hub':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
      case 'completed':
        return 5;
      default:
        return 0;
    }
  };

  const currentIdx = getStageIndex(currentStatus);

  // Generate realistic timestamps based on order creation date
  const baseDate = order?.createdAt ? new Date(order.createdAt) : new Date();

  const formatTimestamp = (hoursOffset) => {
    const d = new Date(baseDate.getTime() + hoursOffset * 3600 * 1000);
    return d.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const stageOffsets = [0, 3, 14, 26, 38, 44];

  return (
    <div className="order-timeline-card">
      <div className="timeline-header-row">
        <h4 className="timeline-heading">📦 Step-by-Step Order Delivery Timeline</h4>
        <span className="courier-badge">⚡ BlueDart Express Air Courier</span>
      </div>

      <div className="timeline-stepper-track">
        {TIMELINE_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={stage.key} className={`timeline-step-node ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
              
              {/* Node Icon */}
              <div className="step-icon-circle">
                <Icon size={18} />
              </div>

              {/* Connecting Line */}
              {idx < TIMELINE_STAGES.length - 1 && (
                <div className={`step-line ${idx < currentIdx ? 'done' : ''}`} />
              )}

              {/* Label & Timestamps */}
              <div className="step-label-box">
                <strong className="step-title">{stage.title}</strong>
                <span className="step-desc">{stage.desc}</span>
                <span className="step-time">
                  {isDone ? formatTimestamp(stageOffsets[idx]) : 'Pending'}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
