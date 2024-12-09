{
  <template>
    <Page>
      <ActionBar :title="vehicle.name">
        <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
      </ActionBar>

      <ScrollView>
        <StackLayout>
          <!-- Vehicle Images -->
          <Image :src="vehicle.image" stretch="aspectFill" height="250" />

          <!-- Vehicle Details -->
          <StackLayout padding="20">
            <Label :text="vehicle.name" class="h1" />
            <Label :text="'₦' + vehicle.price + '/day'" class="price" />
            <Label :text="vehicle.location" class="location" />

            <!-- Features -->
            <GridLayout columns="auto, *" rows="auto, auto, auto" class="features">
              <Label col="0" row="0" text="Driver" class="feature-label" />
              <Label col="1" row="0" text="Included" class="feature-value" />
              
              <Label col="0" row="1" text="Security" class="feature-label" />
              <Label col="1" row="1" text="Optional (₦30,000/day)" class="feature-value" />
              
              <Label col="0" row="2" text="Cancellation" class="feature-label" />
              <Label col="1" row="2" text="10% fee applies" class="feature-value" />
            </GridLayout>

            <!-- Booking Form -->
            <StackLayout class="booking-form">
              <Label text="Select Dates" class="section-title" />
              <DatePicker v-model="startDate" />
              <DatePicker v-model="endDate" />

              <Label text="Pickup Location" class="section-title" />
              <TextField v-model="pickupLocation" hint="Enter pickup address" />

              <Label text="Drop-off Location" class="section-title" />
              <TextField v-model="dropoffLocation" hint="Enter drop-off address" />

              <CheckBox v-model="securityEscort" text="Add Security Escort" />

              <!-- Total Amount -->
              <StackLayout class="total-section">
                <Label text="Total Amount" class="section-title" />
                <Label :text="'₦' + totalAmount" class="total-amount" />
                <Label :text="totalBreakdown" class="total-breakdown" textWrap="true" />
              </StackLayout>

              <Button text="Proceed to Payment" @tap="onBookNow" class="book-button" />
            </StackLayout>
          </StackLayout>
        </StackLayout>
      </ScrollView>
    </Page>
  </template>

  <script lang="ts">
  export default {
    props: {
      vehicle: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        startDate: new Date(),
        endDate: new Date(),
        pickupLocation: '',
        dropoffLocation: '',
        securityEscort: false
      };
    },
    computed: {
      totalAmount() {
        const days = this.calculateDays();
        const baseAmount = days * parseInt(this.vehicle.price.replace(/,/g, ''));
        const securityAmount = this.securityEscort ? days * 30000 : 0;
        return (baseAmount + securityAmount).toLocaleString();
      },
      totalBreakdown() {
        const days = this.calculateDays();
        return `${days} day${days > 1 ? 's' : ''} rental${this.securityEscort ? ' + Security Escort' : ''}`;
      }
    },
    methods: {
      calculateDays() {
        const diffTime = Math.abs(this.endDate - this.startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      },
      async onBookNow() {
        try {
          const booking = {
            vehicleId: this.vehicle.id,
            startDate: this.startDate,
            endDate: this.endDate,
            pickupLocation: this.pickupLocation,
            dropoffLocation: this.dropoffLocation,
            securityEscort: this.securityEscort,
            totalAmount: parseInt(this.totalAmount.replace(/,/g, ''))
          };

          // Navigate to payment page
          this.$navigateTo(require('./Payment').default, {
            props: { booking }
          });
        } catch (error) {
          alert('Failed to process booking. Please try again.');
        }
      }
    }
  };
  </script>

  <style scoped>
  .h1 {
    font-size: 24;
    font-weight: bold;
    margin-bottom: 10;
  }
  .price {
    font-size: 20;
    color: #2563eb;
    font-weight: bold;
    margin-bottom: 5;
  }
  .location {
    color: #666;
    margin-bottom: 20;
  }
  .features {
    margin: 20 0;
    border-top-width: 1;
    border-bottom-width: 1;
    border-color: #e5e5e5;
    padding: 20 0;
  }
  .feature-label {
    color: #666;
    font-size: 14;
    margin: 5 0;
  }
  .feature-value {
    font-size: 14;
    margin: 5 0;
  }
  .section-title {
    font-weight: bold;
    margin: 10 0;
  }
  .booking-form {
    margin-top: 20;
  }
  .total-section {
    margin: 20 0;
    padding: 20;
    background-color: #f8fafc;
    border-radius: 5;
  }
  .total-amount {
    font-size: 24;
    font-weight: bold;
    color: #2563eb;
  }
  .total-breakdown {
    color: #666;
    font-size: 14;
  }
  .book-button {
    background-color: #2563eb;
    color: white;
    margin-top: 20;
  }
  </style>
}