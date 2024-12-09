<template>
    <Page>
      <ActionBar title="Booking Confirmed">
        <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="goToHome" />
      </ActionBar>

      <StackLayout padding="20">
        <Image src="~/assets/success.png" width="100" height="100" class="success-icon" />
        
        <Label text="Booking Confirmed!" class="success-title" />
        <Label text="Your vehicle has been successfully booked." class="success-message" textWrap="true" />

        <StackLayout class="booking-details">
          <Label text="Booking Details" class="section-title" />
          
          <GridLayout columns="auto, *" rows="auto, auto, auto, auto" class="details-grid">
            <Label col="0" row="0" text="Booking ID:" class="detail-label" />
            <Label col="1" row="0" :text="booking.id" class="detail-value" />
            
            <Label col="0" row="1" text="Vehicle:" class="detail-label" />
            <Label col="1" row="1" :text="booking.vehicleName" class="detail-value" />
            
            <Label col="0" row="2" text="Dates:" class="detail-label" />
            <Label col="1" row="2" :text="bookingDates" class="detail-value" />
            
            <Label col="0" row="3" text="Amount:" class="detail-label" />
            <Label col="1" row="3" :text="'₦' + booking.totalAmount.toLocaleString()" class="detail-value" />
          </GridLayout>
        </StackLayout>

        <Button text="View Booking" @tap="viewBooking" class="primary-button" />
        <Button text="Back to Home" @tap="goToHome" class="secondary-button" />
      </StackLayout>
    </Page>
  </template>

  <script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      booking: {
        type: Object,
        required: true
      }
    },
    computed: {
      bookingDates() {
        const start = new Date(this.booking.startDate).toLocaleDateString();
        const end = new Date(this.booking.endDate).toLocaleDateString();
        return `${start} - ${end}`;
      }
    },
    methods: {
      viewBooking() {
        this.$navigateTo(require('./BookingDetails').default, {
          props: { bookingId: this.booking.id }
        });
      },
      goToHome() {
        this.$navigateTo(require('./Home').default, {
          clearHistory: true
        });
      }
  });
  };
  </script>

  <style scoped>
  .success-icon {
      text-align: center;
      margin: 20 0;
  }
  .success-title {
    font-size: 24;
    font-weight: bold;
    text-align: center;
    color: #16a34a;
    margin-bottom: 10;
  }
  .success-message {
    text-align: center;
    color: #666;
    margin-bottom: 30;
  }
  .booking-details {
    background-color: #f8fafc;
    padding: 20;
    border-radius: 10;
    margin: 20 0;
  }
  .section-title {
    font-size: 18;
    font-weight: bold;
    margin-bottom: 15;
  }
  .details-grid {
    margin: 10 0;
  }
  .detail-label {
    color: #666;
    font-size: 14;
    margin: 5 0;
  }
  .detail-value {
    font-size: 14;
    margin: 5 0;
  }
  .primary-button {
    background-color: #2563eb;
    color: white;
    margin: 10 0;
  }
  .secondary-button {
    background-color: transparent;
    color: #2563eb;
    border-width: 1;
    border-color: #2563eb;
    margin: 10 0;
  }
  </style>
</style>