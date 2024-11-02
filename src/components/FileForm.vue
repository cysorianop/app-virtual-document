<template>
  <q-form @submit.prevent="submitFile">
    <h2 class="form-title">Subir Documento</h2>
    <q-input v-model="fileInfo.userId" label="Document ID" disabled class="form-item" />
    <q-input v-model="fileInfo.firstName" label="First Name" required class="form-item" />
    <q-input v-model="fileInfo.lastName" label="Last Name" required class="form-item" />
    <q-input v-model="fileInfo.fileName" label="File Name" required class="form-item" />
    <q-input v-model="fileInfo.pageCount" label="Page Count" type="number" required class="form-item" />
    <q-input v-model="fileInfo.elementNumber" label="Element Number" disabled class="form-item" />
    <q-file v-model="fileInfo.file" label="Upload File" @added="onFileAdded" class="form-item" />
    <div class="button-container">
      <q-btn label="Add File" type="submit" color="primary" class="add-file-btn" />
    </div>
  </q-form>
</template>

<script>
import { ref } from 'vue';
import { useFiles } from '../composables/useFiles';

export default {
  setup() {
    const { addFile } = useFiles();
    const fileInfo = ref({
      userId: '',
      firstName: '',
      lastName: '',
      fileName: '',
      pageCount: 0,
      elementNumber: Math.random().toString(36).substr(2, 10),
      file: null,
    });

    const submitFile = async () => {
      await addFile(fileInfo.value);
      // Reinicia el formulario después de agregar el archivo
      resetForm();
    };

    const resetForm = () => {
      fileInfo.value = {
        userId: '',
        firstName: '',
        lastName: '',
        fileName: '',
        pageCount: 0,
        elementNumber: Math.random().toString(36).substr(2, 10),
        file: null,
      };
    };

    return { fileInfo, submitFile };
  },
};
</script>

<style lang="scss" scoped>
/* Estilos del título */
.form-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 20px;
}

/* Espaciado entre elementos del formulario */
.form-item {
  margin-bottom: 24px;
}

/* Estilos base */
.button-container {
  display: flex;
  justify-content: center;
}

.add-file-btn {
  font-weight: bold;
  font-size: 1rem;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1976d2;
    color: white;
  }
}

/* Estilos de formulario */
q-form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f4f6f8;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  input,
  .q-file {
    font-size: 0.9rem;
  }
}

/* Responsividad para dispositivos */
@media (min-width: 768px) {
  q-form {
    padding: 30px;
    max-width: 700px;
  }
}

@media (min-width: 1024px) {
  q-form {
    padding: 40px;
    max-width: 800px;
  }
}

/* Tipografía y colores */
q-input,
.q-file {
  .q-field__label {
    font-weight: 600;
    font-size: 1rem;
    color: #37474f;
  }

  .q-field__native {
    color: #263238;
  }
}

/* Botones y otros elementos */
q-btn {
  background-color: #42a5f5;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>