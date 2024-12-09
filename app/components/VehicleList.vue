{
  <template>
    <Page>
      <ActionBar title="Available Vehicles">
        <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
      </ActionBar>
      
      <GridLayout rows="auto, *">
        <!-- Search Bar -->
        <GridLayout row="0" columns="*, auto" padding="10" class="search-bar">
          <TextField col="0" v-model="searchQuery" hint="Search vehicles..." />
          <Button col="1" text="Filter" @tap="showFilters" />
        </GridLayout>

        <!-- Vehicle List -->
        <ListView row="1" for="vehicle in filteredVehicles" @itemTap="onVehicleTap">
          <v-template>
            <GridLayout rows="auto" columns="100, *" padding="10" class="vehicle-item">
              <Image col="0" :src="vehicle.image" stretch="aspectFill" width="100" height="100" />
              <StackLayout col="1" padding="10">
                <Label :text="vehicle.name" class="vehicle-name" />
                <Label :text="'₦' + vehicle.price + '/day'" class="vehicle-price" />
                <Label :text="vehicle.location" class="vehicle-location" />
              </StackLayout>
            </GridLayout>
          </v-template>
        </ListView>
      </GridLayout>
    </Page>
  </template>

  <script lang="ts">
  export default {
    data() {
      return {
        searchQuery: '',
        vehicles: [
          {
            id: 1,
            name: 'Mercedes Benz S-Class',
            price: '150,000',
            location: 'Lagos, Nigeria',
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80'
          },
          {
            id: 2,
            name: 'BMW 7 Series',
            price: '140,000',
            location: 'Lagos, Nigeria',
            image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80'
          }
        ]
      };
    },
    computed: {
      filteredVehicles() {
        return this.vehicles.filter(vehicle =>
          vehicle.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          vehicle.location.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },
    methods: {
      showFilters() {
        // Implement filter modal
      },
      onVehicleTap(event) {
        const vehicle = this.vehicles[event.index];
        this.$navigateTo(require('./VehicleDetails').default, {
          props: { vehicle }
        });
      }
    }
  };
  </script>

  <style scoped>
  .search-bar {
    background-color: #fff;
    border-bottom-width: 1;
    border-bottom-color: #e5e5e5;
  }
  .vehicle-item {
    background-color: #fff;
    margin: 5 10;
    border-radius: 5;
  }
  .vehicle-name {
    font-size: 16;
    font-weight: bold;
  }
  .vehicle-price {
    color: #2563eb;
    font-weight: bold;
  }
  .vehicle-location {
    color: #666;
    font-size: 14;
  }
  </style>
}