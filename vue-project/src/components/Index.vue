<script setup lang="ts">
import Form from '../components/Form.vue'
import { ref, watch, onMounted } from 'vue';
import Axios from 'axios';

const baseURL = "http://localhost:9000"
const axios = Axios.create({ baseURL });
// const axios = Axios.create({ baseURL: "http://localhost:9000" });
const items = ref([])
const categories = ref([])

const form = ref(null)

// watch(selected, (name) => {
//   // ;[last.value, first.value] = name.split(', ')
// })

const fetchItems = async () => {
  const { data } = await axios.get("/items");
  items.value = data
  console.log(items.value);
}

const fetchCategories = async () => {
  const { data } = await axios.get("/categories");
  categories.value = data
  // console.log(categories.value);
}


onMounted(async () => {
  await fetchItems();
  await fetchCategories()
})


const getImageLink = (filename: String) => {
  if (!filename) {
    return '';
  }
  const path = `/images/${filename}`;
  const url = new URL(path, baseURL);
  return url.href;
}

const log = (data) => {
  console.log(data);
}
</script>

<template >
  <Form :items="items" :categories="categories" @fetchItems="fetchItems()" ref="form" />

  <section class="d-flex flex-column-reverse">
    <div v-for="{ id, name, description, categories, image = {} } in items"
      class="card mb-3 w-100 shadow x-shadow-fade-in">
      <div class="row g-0 h-100">
        <div class="col-md-2 h-100">
          <img :src="getImageLink(image?.filename)" class="h-100 img-fluid img-thumb rounded-start" alt="...">
        </div>
        <div class="col-md-10 ">
          <div class="card-body d-flex justify-content-between">
            <h5 class="card-title">{{ name }}</h5>
            <p class="card-text">{{ description }}</p>
            <p class="card-categories">
              <span v-for="{ name } in categories" class="badge text-bg-primary">{{ name }}</span>
            </p>
            <button @click="form.fillFormWithItemData(id)" class="btn btn-success">Редактировать</button>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<style>
.card {
  height: 100px !important;
}
</style>


