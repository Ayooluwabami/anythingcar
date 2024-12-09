{
  <template>
    <Page>
      <ActionBar title="Payment">
        <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
      </ActionBar>

      <ScrollView>
        <StackLayout padding="20">
          <!-- Payment Summary -->
          <StackLayout class="summary-card">
            <Label text="Booking Summary" class="summary-title" />
            <Label :text="'Total Amount: ₦' + booking.totalAmount.toLocaleString()" class="amount" />
            <Label text="Select Payment Method" class="section-title" />
          </StackLayout>

          <!-- Payment Methods -->
          <StackLayout class="payment-methods">
            <StackLayout class="payment-option" @tap="selectPayment('card')">
              <Label text="Pay with Card" />
              <Label text="Visa, Mastercard, Verve" class="payment-subtitle" />
            </StackLayout>

            <StackLayout class="payment-option" @tap="selectPayment('paystack')">
              <Label text="Pay with Paystack" />
              <Label text="Fast and secure payment" class="payment-subtitle" />
            </StackLayout>

            <StackLayout class="payment-option" @tap="selectPayment('flutterwave')">
              <Label text="Pay with Flutterwave" />
              <Label text="Multiple payment options" class="payment-subtitle" />
            </StackLayout>
          </StackLayout>

          <!-- Card Form (shown when card payment is selected) -->
          <StackLayout v-if="selectedPayment === 'card'" class="card-form">
            <TextField v-model="cardNumber" hint="Card Number" keyboardType="number" maxLength="16" />
            <GridLayout columns="*, *" rows="auto">
              <TextField col="0" v-model="expiryDate" hint="MM/YY" maxLength="5" />
              <TextField col="1" v-model="cvv" hint="CVV" keyboardType="number" maxLength="4" secure="true" />
            </GridLayout>
          </StackLayout>

          <!-- Payment Button -->
          <Button text="Pay Now" @tap="processPayment" class="pay-button" :isEnabled="canPay" />

          <!-- Cancellation Policy -->
          <Label text="Cancellation Policy" class="policy-title" />
          <Label text="Cancellation after payment will incur a 10% fee." class="policy-text" textWrap="true" />
        </StackLayout>
      </ScrollView>
    </Page>
  </template>

  <script lang="ts">
  export default {
    props: {
      booking: {
        type: Object,
        required: true
      }
    },
    data(): { selectedPayment: string; cardNumber: string; expiryDate: string; cvv: string; processing: boolean } {
      return {
        selectedPayment: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        processing: false
      };
    },
    computed: {
      canPay() {
        if (this.processing) return false;
        if (this.selectedPayment === 'card') {
          return this.cardNumber.length === 16 &&
                 this.expiryDate.length === 5 &&
                 this.cvv.length >= 3;
        }
        return this.selectedPayment !== '';
      }
    },
    methods: {
      selectPayment(method) {
        this.selectedPayment = method;
      },
      $navigateBack() {
        this.$router.go(-1);
      },
      async processPayment() {
        if (!this.canPay || this.processing) return;

        this.processing = true;
        try {
          // Implement payment processing based on selected method
          switch (this.selectedPayment) {
            case 'card':
              // Process card payment
              break;
            case 'paystack':
              // Process Paystack payment
              break;
            case 'flutterwave':
              // Process Flutterwave payment
              break;
          }

          // Show success and navigate to confirmation
          this.$navigateTo(require('./BookingConfirmation').default, {
            props: { booking: this.booking }
          });
        } catch (error) {
          alert('Payment failed. Please try again.');
        } finally {
          this.processing = false;
        }
      }
    }
  };
  </script>

  <style scoped>
  .summary-card {
    background-color: #f8fafc;
    padding: 20;
    border-radius: 10;
    margin-bottom: 20;
  }
  .summary-title {
    font-size: 18;
    font-weight: bold;
    margin-bottom: 10;
  }
  .amount {
    font-size: 24;
    color: #2563eb;
    font-weight: bold;
    margin-bottom: 10;
  }
  .section-title {
    font-size: 16;
    font-weight: bold;
    margin: 10 0;
  }
  .payment-methods {
    margin: 20 0;
  }
  .payment-option {
    padding: 15;
    border-width: 1;
    border-color: #e5e5e5;
    border-radius: 5;
    margin-bottom: 10;
  }
  .payment-subtitle {
    font-size: 12;
    color: #666;
  }
  .card-form {
    margin: 20 0;
  }
  .pay-button {
    background-color: #2563eb;
    color: white;
    margin: 20 0;
  }
  .policy-title {
    font-weight: bold;
    margin: 20 0 10 0;
  }
  .policy-text {
    color: #666;
    font-size: 14;
  }
  </style>
}