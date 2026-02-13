# Improved Scheduling System

## Overview
The scheduling system now calculates real-time availability based on actual bookings, showing accurate next available times when chargers are in use.

## Key Features

### 1. Real-Time Availability Calculation
- **Based on Actual Bookings**: Availability is calculated from real booking data, not random toggles
- **Automatic Status Updates**: Bookings automatically transition from "upcoming" → "active" → "completed" based on time
- **Accurate Next Available Times**: Shows exactly when a charger will be available next

### 2. Availability States

#### Available Now
- Charger is free and ready to use
- May show next booking time if one is scheduled

#### Currently In Use
- Charger has an active booking
- Shows when it will be available (e.g., "Available in 2h 30m")
- Displays exact time (e.g., "Available at: Jan 20, 2:30 PM")

#### Upcoming Bookings
- Shows next booking start time if charger is available but has future bookings
- Displays schedule of upcoming bookings

### 3. Visual Indicators

#### Browse Page
- **Available**: Green badge with "Available Now"
- **In Use**: Amber badge with "In Use" and time until available
- Shows next booking time if applicable

#### Charger Detail Page
- **Detailed Status**: Shows current status with formatted time
- **Schedule View**: Visual list of upcoming/active bookings with:
  - User avatars and names
  - Start and end times
  - Active/Upcoming badges
  - Time formatting (e.g., "2:30 PM - 4:30 PM")

### 4. Automatic Updates

- **Status Checks**: Every minute, bookings are checked and statuses updated
- **Availability Refresh**: Every 30 seconds, charger availability is recalculated
- **Real-Time Display**: Users see live updates without page refresh

## How It Works

### Availability Calculation Logic

1. **Check Active Bookings**: Looks for bookings that are currently active (startTime ≤ now < endTime)
2. **Find Next Booking**: If no active booking, finds the next upcoming booking
3. **Calculate Next Available**:
   - If active: Next available = endTime of current booking
   - If upcoming: Next available = startTime of next booking (charger available until then)
   - If none: Charger is fully available

### Time Formatting

- **Short Format**: "Available in 2h 30m" or "Available in 45 minutes"
- **Full Format**: "Jan 20, 2:30 PM" for exact times
- **Time Only**: "2:30 PM - 4:30 PM" for booking ranges

## User Experience

### For Drivers
- See exactly when chargers will be available
- Plan ahead with upcoming booking schedules
- Know if a charger is currently in use
- Make informed booking decisions

### For Hosts
- See when their charger is booked
- View upcoming schedule
- Understand availability patterns

## Technical Implementation

### Files Created/Updated

1. **`src/utils/scheduling.ts`**
   - `calculateAvailability()`: Main calculation function
   - `formatNextAvailableTime()`: Human-readable time formatting
   - `formatDateTime()`: Date and time formatting
   - `shouldBeActive()` / `shouldBeCompleted()`: Status transition helpers

2. **`src/hooks/useAvailability.ts`** (Updated)
   - Now uses real booking data
   - Automatically updates booking statuses
   - Recalculates availability every 30 seconds

3. **`src/components/ScheduleView.tsx`** (New)
   - Visual schedule component
   - Shows active and upcoming bookings
   - User-friendly time display

4. **`src/pages/BrowsePage.tsx`** (Updated)
   - Better availability display
   - Shows next booking times

5. **`src/pages/ChargerDetailPage.tsx`** (Updated)
   - Detailed availability information
   - Schedule view integration
   - Accurate booking button states

## Example Scenarios

### Scenario 1: Charger In Use
- Current time: 2:00 PM
- Active booking: 1:00 PM - 3:00 PM
- Display: "In Use" / "Available in 1 hour" / "Available at: 3:00 PM"

### Scenario 2: Available with Upcoming Booking
- Current time: 2:00 PM
- Next booking: 4:00 PM - 6:00 PM
- Display: "Available Now" / "Next booking starts: 4:00 PM"

### Scenario 3: Fully Available
- Current time: 2:00 PM
- No bookings
- Display: "Available"

## Future Enhancements

Potential improvements:
- Calendar view for bookings
- Booking conflict prevention
- Recurring bookings
- Booking notifications
- Time zone support
- Buffer time between bookings
