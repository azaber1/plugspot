import { useState, useEffect } from 'react';
import { Charger, Booking } from '../types';
import { getAvailableTimeSlots, formatTime, formatDateTime } from '../utils/scheduling';

interface TimeSlotPickerProps {
  charger: Charger;
  allBookings: Booking[];
  duration: number;
  selectedDate: Date;
  selectedTime: Date | null;
  onDateChange: (date: Date) => void;
  onTimeSelect: (time: Date) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  charger,
  allBookings,
  duration,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeSelect,
}) => {
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);

  useEffect(() => {
    const slots = getAvailableTimeSlots(charger, allBookings, selectedDate, duration);
    setAvailableSlots(slots);
  }, [charger, allBookings, selectedDate, duration]);

  // Get next 7 days for date selection
  const getDateOptions = () => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dateOptions = getDateOptions();

  return (
    <div className="space-y-4">
      {/* Date Selection */}
      <div>
        <label className="block text-gray-300 mb-2 text-sm">Select Date</label>
        <div className="grid grid-cols-7 gap-2">
          {dateOptions.map((date) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => onDateChange(date)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-electric-green text-gray-900 shadow-glow-green-sm'
                    : isToday
                    ? 'glass-card text-gray-300 border-electric-green/30'
                    : 'glass-card text-gray-300 hover:border-electric-green/50'
                }`}
              >
                <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-base font-semibold">{date.getDate()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div>
        <label className="block text-gray-300 mb-2 text-sm">Select Time</label>
        {availableSlots.length === 0 ? (
          <div className="p-4 bg-gray-800/50 rounded-lg text-center">
            <p className="text-sm text-gray-400">No available slots for this date</p>
            <p className="text-xs text-gray-500 mt-1">Try selecting a different date</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {availableSlots.map((slot) => {
              const isSelected = selectedTime?.getTime() === slot.getTime();
              const endTime = new Date(slot);
              endTime.setHours(slot.getHours() + duration);
              
              return (
                <button
                  key={slot.toISOString()}
                  type="button"
                  onClick={() => onTimeSelect(slot)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-electric-green text-gray-900 shadow-glow-green-sm'
                      : 'glass-card text-gray-300 hover:border-electric-green/50'
                  }`}
                >
                  <div>{formatTime(slot)}</div>
                  <div className="text-xs text-gray-500">- {formatTime(endTime)}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedTime && (
        <div className="p-3 bg-electric-green/10 border border-electric-green/30 rounded-lg">
          <p className="text-sm text-gray-300">
            <span className="font-semibold">Selected:</span> {formatDateTime(selectedTime)} -{' '}
            {formatTime(new Date(selectedTime.getTime() + duration * 60 * 60 * 1000))}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
