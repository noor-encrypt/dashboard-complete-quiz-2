# 📅 Complete Booking System Guide

## How to Book a Service or Home

### **Step-by-Step Booking Process:**

#### 1. **Browse Services/Homes**
   - Navigate to `/services` to view all services
   - Navigate to `/home` to view all homes
   - Click on any card to view detailed information

#### 2. **View Details Page**
   - Service Detail: `/service-detail/:serviceId`
   - Home Detail: `/home-detail/:homeId`
   - On the detail page, you'll see a booking card on the right side

#### 3. **Open Booking Modal**
   - Click the **"Book Now"** button (for services)
   - Click the **"Reserve"** button (for homes)
   - A booking modal will pop up with a booking form

#### 4. **Fill Booking Form**
   - **Check-in Date**: Select when you want to start
   - **Check-out Date**: Select when you want to end
   - **Guest Count**: Specify number of guests (1 to property max)
   - **Special Requests** (Optional): Add any special notes or requirements
   - **Review Price Summary**: See real-time price calculation

#### 5. **Submit Booking**
   - Click **"Book Now"** button in the modal
   - System validates:
     - Dates are valid (check-out after check-in)
     - No date conflicts with existing bookings
     - User is logged in
   - After successful booking → redirected to `/my-bookings`

#### 6. **Track Your Bookings**
   - Go to Dashboard
   - Click **"My Bookings"** card
   - View all your bookings with status badges:
     - 🟡 **Pending** - Waiting for host confirmation
     - 🟢 **Confirmed** - Host approved your booking
     - 🔵 **Completed** - Stay is over
     - 🔴 **Cancelled** - Booking was cancelled

---

## Why Service Detail Page Shows Correctly

### ✅ **Complete Integration:**

#### **Frontend Routes (App.jsx):**
```
/services                    → Services listing page
/service-detail/:serviceId  → Service detail page (with booking modal)
/home                       → Homes listing page  
/home-detail/:homeId        → Home detail page (with booking modal)
/my-bookings                → Your bookings page
/host-bookings              → Host booking requests page
```

#### **Backend API Endpoints:**
```
GET  /services/service/:serviceId        → Get single service details
GET  /services/all-services              → Get all services
POST /bookings/create-booking            → Create new booking
GET  /bookings/my-bookings               → Get user's bookings
GET  /bookings/host-bookings             → Get host's received bookings
PUT  /bookings/confirm-booking/:id       → Host confirms booking
PUT  /bookings/cancel-booking/:id        → Cancel booking
PUT  /bookings/complete-booking/:id      → Mark booking as completed
```

#### **Database Schema:**
```javascript
// BookingSchema
{
  userId, userName,          // Guest info
  hostId, hostName,         // Host info
  propertyId, propertyType, // home or service
  propertyTitle,
  checkInDate, checkOutDate,
  numberOfNights,
  guestCount,
  pricePerNight,
  totalPrice,
  specialRequests,
  status,                   // pending, confirmed, cancelled, completed
  paymentStatus,            // unpaid, paid, refunded
  cancellationReason,
  createdAt, confirmedAt, cancelledAt
}
```

---

## What Gets Displayed on Service Detail Page

### **Service Information:**
- 📷 Service images with image gallery
- 📝 Title and description
- 📍 Location
- 💰 Price per service/night
- ⭐ Host rating
- 📋 Amenities/features included

### **Booking Section (Right Side):**
- Price display
- **"Book Now" Button** → Opens BookingModal
- "Save" button (for favorites)
- "Share" button
- Host rating section

### **Host Information Card:**
- Host name
- Host email
- Host member since date
- "Contact Host" button

### **Amenities Section:**
- List of included amenities
- Special features

---

## Complete Booking Flow Diagram

```
User Flow:
┌─────────────────┐
│  Browse Home    │
├─────────────────┤
│  Click Service  │
├─────────────────┤
│  Detail Page    │
│  (Service Info) │
├─────────────────┤
│  Click "Book"   │
├─────────────────┤
│  Booking Modal  │
│  (Form)         │
├─────────────────┤
│  Submit Booking │
├─────────────────┤
│  Validation     │
│  - Dates OK?    │
│  - No conflict? │
│  - User logged? │
├─────────────────┤
│  Success ✓      │
├─────────────────┤
│  Redirect to    │
│  /my-bookings   │
├─────────────────┤
│  Booking shows  │
│  as "Pending"   │
└─────────────────┘

Host Receives Booking:
┌─────────────────────┐
│  Host Dashboard     │
├─────────────────────┤
│  Click "Booking     │
│   Requests"         │
├─────────────────────┤
│  View all pending   │
│  bookings from      │
│  guests             │
├─────────────────────┤
│  Click "Confirm"    │
│  or "Complete"      │
├─────────────────────┤
│  Booking Status     │
│  Updated            │
└─────────────────────┘
```

---

## Status Workflow

### **Booking Lifecycle:**

```
PENDING
  ↓
  ├─→ Host confirms → CONFIRMED
  │                       ↓
  │                   After stay ends
  │                       ↓
  │                   COMPLETED ✓
  │
  └─→ Guest/Host cancels → CANCELLED ✗
```

### **Payment Workflow:**

```
UNPAID (initial)
  ↓
Host confirms booking
  ↓
PAID (payment processed)
  ↓
If cancelled → REFUNDED
```

---

## Key Features

### ✅ **For Guests:**
- ✓ Browse and filter services/homes
- ✓ View detailed property information
- ✓ Make instant bookings with real-time price calculation
- ✓ Track all bookings on `/my-bookings`
- ✓ Cancel bookings with cancellation reason
- ✓ View booking status (pending, confirmed, completed)

### ✅ **For Hosts:**
- ✓ View all incoming booking requests
- ✓ Confirm bookings to receive payment
- ✓ Mark bookings as completed after stay
- ✓ See guest information and special requests
- ✓ Access booking details with full breakdown
- ✓ Track payment status

---

## Error Handling & Validation

### **Booking Validation Checks:**

1. **Date Validation:**
   - Check-out date must be after check-in date
   - Can't book in the past
   - No date conflicts with existing bookings

2. **User Validation:**
   - User must be logged in
   - Token must be valid

3. **Property Validation:**
   - Property must exist
   - Property type (home/service) must be correct
   - Price must be valid

4. **Guest Count Validation:**
   - Must be between 1 and property max guests

### **Error Messages:**

```
❌ "Check-out date must be after check-in date"
❌ "Please login to make a booking"
❌ "This property is not available for these dates"
❌ "Property not found"
❌ "Guest count exceeds maximum allowed"
```

---

## Example Bookings (CSV Data Provided)

You now have two CSV files in your root folder:

### **homes.csv** - 10 sample properties:
- Luxury Modern Apartment - $150/night
- Cozy Studio in Brooklyn - $95/night
- Spacious Family Home - $250/night
- Beach Villa with Ocean View - $300/night
- Mountain Cabin Retreat - $120/night
- Urban Loft with Terrace - $180/night
- Victorian House - $200/night
- Penthouse Suite - $400/night
- Beachfront Bungalow - $160/night
- Downtown Loft Conversion - $140/night

### **services.csv** - 10 sample services:
- Web Design Consultation - $50
- Photography Session - $75
- Personal Training Session - $60
- Digital Marketing Strategy - $100
- Graphic Design Service - $80
- Voice Over Service - $45
- Virtual Assistant Support - $40
- Language Tutoring - $55
- Social Media Management - $150
- Video Editing Service - $70

---

## Testing the Booking System

### **Test Scenario 1: Simple Booking**
1. Login to account
2. Go to `/services`
3. Click on "Professional Chef Service"
4. Fill in: Check-in (today), Check-out (tomorrow), Guests: 2
5. Review price: $150 × 1 night = $150
6. Click "Book Now"
7. Check `/my-bookings` - should show as "Pending"

### **Test Scenario 2: Host Workflow**
1. Login as host account
2. Go to Dashboard
3. Click "Booking Requests"
4. See pending bookings
5. Click "Confirm" on any booking
6. Booking status changes to "Confirmed"
7. After stay date passes, "Complete" button appears

### **Test Scenario 3: Cancel Booking**
1. Go to `/my-bookings`
2. Find a booking in "Pending" or "Confirmed" status
3. Click "Cancel" button
4. Enter cancellation reason
5. Click "Confirm Cancel"
6. Booking moves to "Cancelled" status

---

## Next Steps

### 🚀 **To Get Started:**

1. **Populate Database:**
   - Import homes.csv and services.csv into MongoDB
   - Or use the add-service/add-home API endpoints

2. **Start Backend:**
   ```bash
   cd Backend
   npm start
   ```

3. **Start Frontend:**
   ```bash
   cd FrontEnd
   npm run dev
   ```

4. **Create Test Account:**
   - Sign up at `/signup`
   - Set isHost to true to become a host
   - Create sample services/homes

5. **Test Booking Flow:**
   - Make a booking as guest
   - Switch to host account
   - Confirm the booking
   - Mark as completed

---

## Files Created/Modified

### **Frontend Files:**
- ✅ `MyBookings.jsx` - Guest bookings page
- ✅ `HostBookings.jsx` - Host booking requests page
- ✅ `BookingModal.jsx` - Booking form modal
- ✅ `ServiceDetailPage.jsx` - Service detail with booking
- ✅ `HomeDetailPage.jsx` - Home detail with booking
- ✅ `App.jsx` - Routes added

### **Backend Files:**
- ✅ `BookingSchema.js` - Booking database model
- ✅ `bookings.js` - All booking endpoints
- ✅ `Backend/index.js` - Routes integrated

---

## Support & Troubleshooting

### **Issue: "Booking Modal doesn't open"**
- Ensure you're logged in (token in localStorage)
- Check browser console for errors
- Verify BookingModal is imported in detail pages

### **Issue: "Can't confirm booking as host"**
- Ensure you're logged in as the host
- Booking must be in "Pending" status
- Check token is valid

### **Issue: "Price calculation is wrong"**
- Verify check-in and check-out dates are correct
- Calculate: (check-out date - check-in date) × price per night

### **Issue: "Services/Homes not loading"**
- Check MongoDB connection
- Verify CSV data was imported
- Check backend is running on port 5000

---

## Summary

✨ **Your booking system is now fully functional!**

- ✅ Create bookings with date validation
- ✅ Track booking status (pending → confirmed → completed)
- ✅ Cancel bookings with reasons
- ✅ Host management of incoming bookings
- ✅ Real-time price calculations
- ✅ Complete payment tracking

**Ready to book!** 🎉
