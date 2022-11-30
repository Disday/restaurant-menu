<script setup lang="ts">
import { normalizeClass, reactive, ref, toRefs } from 'vue';
import Axios from 'axios'

const props = defineProps({
  categories: Array,
  items: Array
});

const { items, categories } = toRefs(props)
const emit = defineEmits(['fetchItems'])

const baseURL = 'http://localhost:9000';
const axios = Axios.create({ baseURL });
let newItem: Object;
let formState: Object;

const clearFormState = () => {
  newItem = reactive({
    categories: [],
  });
  formState = reactive({
    mode: 'create',
    header: 'Создание позиции'
  })
}

clearFormState()

const postImage = async (itemId: string) => {
  const formData = new FormData();
  const { file } = newItem;
  formData.append('file', file);
  formData.append('itemId', itemId);
  const headers = {
    'Content-Type': 'multipart/form-data'
  };
  await axios.post('/item/image', formData, { headers });
  clearFormState();
}
const normalizeErrors = (errors) => {
  return errors.reduce((acc, error) => {
    acc[error.param] = error.msg;
    return acc;
  }, {});
}

const createItem = async () => {
  const { name, description, categories = [] } = newItem;
  const postItemResponse = await axios.post('/item', { name, description, categoryIds: categories });

  newItem.errors = [];
  const errors = postItemResponse.data?.errors;
  if (errors) {
    newItem.errors = normalizeErrors(errors);
    return;
  }
  if (newItem.file) {
    const { id } = postItemResponse.data;
    await postImage(id);
  }
  clearFormState()

  emit('fetchItems');
};
const editItem = async () => {
  const { id, name, description, categories = [] } = newItem;
  const route = `/item/${id}`;
  const editItemResponse = await axios.patch(
    route,
    { name, description, categoryIds: categories },
  );

  newItem.errors = [];
  const errors = editItemResponse.data?.errors;
  
  if (errors) {
    newItem.errors = normalizeErrors(errors);
    return;
  }

  if (newItem.file) {
    const { id } = editItemResponse.data;
    console.log(id);
    await postImage(id);
  }
  clearFormState()
  emit('fetchItems');
};

const fillFormWithItemData = async (itemId = null) => {
  const item = items.value.find(({ id }) => id === itemId);
  const { id, name, description, categories, image } = item;

  const categoryIds = categories.map(({ id }) => id);
  Object.assign(newItem, { id, name, description, categories: categoryIds, image });
  Object.assign(formState, { mode: 'edit', header: 'Редактирование позиции' });
};

defineExpose({
  fillFormWithItemData
});
</script>

<template>

  <section class="me-2">
    <!-- i18n -->
    <h2>
      {{ formState.header }} {{ newItem.name }}
    </h2>
    <div class="mb-3">
      <label>Название позиции:
        <input v-model="newItem.name" class="form-control">
      </label>
      <div class="invalid-feedback d-block" v-if="newItem.errors">{{ newItem.errors.name }}</div>
    </div>

    <div class="mb-3">
      <label>Описание:
        <input v-model="newItem.description" class="form-control">
      </label>
      <div class="invalid-feedback d-block" v-if="newItem.errors">{{ newItem.errors.description }}</div>
    </div>

    <div class="mb-3">
      <label>Фото:
        <input @change="newItem.file = $event.target.files[0]" type="file">
      </label>
    </div>
    <input v-model="newItem.id" class="form-control">

    <div>Категории:</div>
    <div class="btn-group mb-3" role="group" aria-label="Basic checkbox toggle button group">
      <div v-for="{ id, name } in categories">
        <input @change="" v-model="newItem.categories" :id=id :value=id type="checkbox" class="btn-check"
          autocomplete="off">
        <label class="btn btn-outline-primary me-1" :for=id>{{ name }}</label>
      </div>
    </div>

    <div>
      <button v-if="formState.mode === 'create'" @click="createItem" class="btn btn-success">Создать</button>
      <button v-if="formState.mode === 'edit'" @click="editItem" class="btn btn-success">Сохранить</button>
    </div>
    <!-- </form> -->
  </section>
</template>