{
  <template>
    <StackLayout>
      <Button text="Select Images" @tap="onSelectImages" class="btn btn-primary" />
      
      <GridLayout v-if="images.length > 0" columns="*, *" rows="auto">
        <StackLayout v-for="(image, index) in images" :key="index"
          :col="index % 2" :row="Math.floor(index / 2)"
          class="image-container m-1">
          <Image :src="image" stretch="aspectFill" height="150" />
          <Button text="Remove" @tap="() => onRemoveImage(index)" class="btn btn-danger" />
        </StackLayout>
      </GridLayout>
    </StackLayout>
  </template>

  <script lang="ts">
  import { ImagePicker } from '@nativescript/imagepicker';

  export default {
    methods: {
      onRemoveImage(index: number): void;
    };
    data() {
      return {
        images: [] as string[]
      };
    },
    methods: {
      async onSelectImages() {
        const imagePicker = new ImagePicker();
        const selection = await imagePicker.authorize();
        
        if (selection) {
          const selectedImages = await imagePicker.present({
            mode: 'multiple',
            maxNumberOfItems: 5,
          });

          this.images = [...this.images, ...selectedImages.map(img => img.path)];
          this.$emit('imagesSelected', this.images);
        }
      },
      onRemoveImage(index: number) {
        this.images.splice(index, 1);
        this.$emit('imagesSelected', this.images);
      }
    }
  };
  </script>

  <style scoped>
  .image-container {
    background-color: #ffffff;
    border-radius: 8;
    direction: 2;
    margin: 4;
  }
  </style>
}