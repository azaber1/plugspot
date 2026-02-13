# How to Leave a Review on Wattspot

## Overview
Users can leave reviews for chargers they've booked and completed. Reviews help other drivers make informed decisions and help hosts improve their service.

## Ways to Leave a Review

### 1. From Booking History Page
**Path:** `/bookings`

**Steps:**
1. Sign in to your account
2. Click your user menu in the navbar
3. Select "My Bookings"
4. Find a completed booking (status: "completed")
5. Click the **"Leave Review"** button on the booking card
6. You'll be taken to the review page for that charger

### 2. From Charger Detail Page
**Path:** `/charger/:id`

**Steps:**
1. Navigate to any charger detail page
2. Scroll down to the "Reviews" section
3. If you have a completed booking for this charger and haven't reviewed it yet, you'll see a **"Leave Review"** button at the top of the reviews section
4. Click the button to write your review

## Review Requirements

To leave a review, you must:
- ✅ Be signed in
- ✅ Have a completed booking for that charger
- ✅ Not have already reviewed that charger

## Review Process

1. **Select Rating**: Click on stars (1-5) to rate your experience
2. **Write Comment**: Share your experience in the text field (required)
3. **Submit**: Click "Submit Review"
4. **Confirmation**: You'll see a success toast and be redirected to the charger page
5. **Display**: Your review will appear in the reviews section immediately

## Review Features

- **Star Rating**: 1-5 stars
- **Text Comment**: Detailed feedback about your experience
- **Persistence**: Reviews are saved to localStorage and persist across sessions
- **Display**: Reviews show:
  - User avatar and name
  - Star rating
  - Review date
  - Full comment text

## Tips for Writing Reviews

- Be specific about your experience
- Mention helpful details (ease of access, charging speed, location, etc.)
- Be honest and constructive
- Help other drivers make informed decisions

## Technical Details

- Reviews are stored in localStorage (key: `wattspot_reviews`)
- Reviews are linked to:
  - Booking ID (if reviewed from booking)
  - Charger ID
  - User ID
- Reviews combine static reviews (from data.ts) with user-submitted reviews
- Each user can only review a charger once

## Future Enhancements

Potential improvements:
- Photo uploads in reviews
- Review editing
- Review helpfulness voting
- Host responses to reviews
- Review moderation system
