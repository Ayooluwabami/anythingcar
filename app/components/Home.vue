{
  <template>
    <Page>
      <ActionBar title="Anything Cars" />
      <ScrollView>
        <StackLayout>
          <Image src="~/assets/banner.jpg" stretch="aspectFill" height="200" />
          <StackLayout padding="20">
            <Label text="Welcome to Anything Cars" class="h1" />
            <Label text="Your one-stop automotive solution" class="h2" textWrap="true" />
            
            <Button text="Hire a Car" @tap="onHireCar" class="btn btn-primary m-t-20" />
            <Button text="Browse Cars" @tap="onBrowseCars" class="btn btn-primary m-t-10" />
            <Button text="Auto Parts" @tap="onAutoParts" class="btn btn-primary m-t-10" />
          </StackLayout>

          <GridLayout columns="*, *" rows="auto" padding="10">
            <Label col="0" text="Available Cars" class="h3" />
            <Label col="1" text="View All" class="text-right text-primary" @tap="onViewAll" />
          </GridLayout>

          <ListView for="car in cars" height="300">
            <v-template>
              <StackLayout padding="10">
                <Image :src="car.image" stretch="aspectFill" height="150" />
                <Label :text="car.name" class="h4" />
                <Label :text="'₦' + car.price + '/day'" class="price" />
              </StackLayout>
            </v-template>
          </ListView>
        </StackLayout>
      </ScrollView>
    </Page>
  </template>

  <script lang="ts">
  export default {
    data() {
      return {
        cars: [
          {
            name: 'Mercedes Benz S-Class',
            price: '150,000',
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80'
          },
          {
            name: 'BMW 7 Series',
            price: '140,000',
            image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80'
          }
        ]
      };
    },
    methods: {
      onHireCar() {
        this.$navigateTo(require('./VehicleList').default);
      },
      onBrowseCars() {
        this.$navigateTo(require('./Marketplace').default);
      },
      onAutoParts() {
        this.$navigateTo(require('./AutoParts').default);
      },
      onViewAll() {
        this.$navigateTo(require('./VehicleList').default);
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
  .h2 {
    font-size: 18;
    color: #666;
    margin-bottom: 20;
  }
  .h3 {
    font-size: 16;
    font-weight: bold;
  }
  .h4 {
    font-size: 14;
    font-weight: bold;
  }
  .price {
    color: #2563eb;
    font-weight: bold;
  }
  .text-primary {
    color: #2563eb;
  }
  .text-right {
    text-align: right;
  }
  </style>
}