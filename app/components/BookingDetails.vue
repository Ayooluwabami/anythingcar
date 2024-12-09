<template>
  <Page>
    <ActionBar title="Booking Details">
      <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="goBack" />
    </ActionBar>

    <ScrollView>
      <StackLayout padding="20">
        <Label text="Booking Details" class="page-title" />

        <GridLayout columns="auto, *" rows="auto, auto, auto, auto, auto" class="details-grid">
          <Label col="0" row="0" text="Booking ID:" class="detail-label" />
          <Label col="1" row="0" :text="booking.id || 'N/A'" class="detail-value" />

          <Label col="0" row="1" text="Vehicle:" class="detail-label" />
          <Label col="1" row="1" :text="booking.vehicleName || 'N/A'" class="detail-value" />

          <Label col="0" row="2" text="Pickup Location:" class="detail-label" />
          <Label col="1" row="2" :text="booking.pickupLocation || 'N/A'" class="detail-value" />

          <Label col="0" row="3" text="Drop-off Location:" class="detail-label" />
          <Label col="1" row="3" :text="booking.dropoffLocation || 'N/A'" class="detail-value" />

          <Label col="0" row="4" text="Amount:" class="detail-label" />
          <Label col="1" row="4" :text="'₦' + booking.totalAmount?.toLocaleString() || 'N/A'" class="detail-value" />
        </GridLayout>

        <Button text="Contact Support" class="primary-button" @tap="contactSupport" />
        <Button text="Cancel Booking" class="secondary-button" @tap="cancelBooking" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    bookingId: {
      type: String,
      required: true
    }
  },
  data(): { booking: { id: string; vehicleName: string; pickupLocation: string; dropoffLocation: string; totalAmount: number } } {
    return {
      booking: {
        id: '',
        vehicleName: '',
        pickupLocation: '',
        dropoffLocation: '',
        totalAmount: 0
      }
    };
  },
  created() {
    this.fetchBookingDetails();
  },
  methods: {
    fetchBookingDetails() {
      // Simulated fetch. Replace with actual API call.
      const mockBooking = {
        id: this.bookingId,
        vehicleName: "Toyota Corolla 2021",
        pickupLocation: "Lagos",
        dropoffLocation: "Ibadan",
        totalAmount: 20000
      };
      this.booking = mockBooking;

      // Example of an API call:
      // this.$http.get(`/api/bookings/${this.bookingId}`).then(response => {
      //   this.booking = response.data;
      // }).catch(error => {
      //   console.error("Error fetching booking details:", error);
      // });
    },
    contactSupport() {
      console.log("Contacting support...");
      // Logic to contact support, e.g., open a chat or dial a phone number.
    },
    cancelBooking() {
      console.log("Canceling booking...");
      // Logic to cancel the booking, such as API call to mark it canceled.
    },
    goBack() {
      this.$navigateBack();
    }
  }
};
</script>

<style scoped>
.page-title {
  font-size: 24;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20;
}

.details-grid {
  margin: 20 0;
  row-gap: 15;
}

.detail-label {
  color: #666;
  font-size: 14;
}

.detail-value {
  font-size: 14;
  font-weight: bold;
}

.primary-button {
  background-color: #2563eb;
  color: white;
  margin: 10 0;
}

.secondary-button {
  background-color: transparent;
  color: #d32f2f;
  border-width: 1;
  border-color: #d32f2f;
  margin: 10 0;
}
</style>
