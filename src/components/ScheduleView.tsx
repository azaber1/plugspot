import { Booking } from '../types';
import { formatDateTime, formatTime } from '../utils/scheduling';

interface ScheduleViewProps {
  bookings: Booking[];
  currentTime: Date;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ bookings, currentTime }) => {
  // Get upcoming and active bookings
  const relevantBookings = bookings
    .filter((b) => {
      const endTime = new Date(b.endTime);
      return endTime > currentTime && (b.status === 'upcoming' || b.status === 'active');
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5); // Show next 5 bookings

  if (relevantBookings.length === 0) {
    return (
      <div className="p-4 bg-gray-800/50 rounded-lg text-center">
        <p className="text-sm text-gray-400">No upcoming bookings</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {relevantBookings.map((booking) => {
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);
        const isActive = booking.status === 'active' && startTime <= currentTime && endTime > currentTime;
        const isUpcoming = startTime > currentTime;

        return (
          <div
            key={booking.id}
            className={`p-3 rounded-lg border ${
              isActive
                ? 'bg-electric-green/10 border-electric-green/30'
                : 'bg-gray-800/50 border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <img
                  src={booking.userAvatar}
                  alt={booking.userName}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium text-gray-200">{booking.userName}</span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  isActive
                    ? 'bg-electric-green/20 text-electric-green'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {isActive ? 'Active' : 'Upcoming'}
              </span>
            </div>
            <div className="text-xs text-gray-400 space-y-0.5">
              <p>
                {formatTime(startTime)} - {formatTime(endTime)}
              </p>
              <p>{formatDateTime(startTime)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleView;
