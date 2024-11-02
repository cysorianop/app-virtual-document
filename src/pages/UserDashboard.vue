<template>
  <div class="q-pa-md">

    <header class="header">
      <h1 class="header-title">Document Manager</h1>
      <button class="logout-button" @click="showLogoutModal = true">Cerrar Sesión</button>
    </header>

    <div class="centered-container">
      <q-card class="file-card" outlined>
        <q-card-section>
          <FileForm @fileAdded="fetchFiles" />
          <q-separator class="my-separator" />
          <FileGrid :files="files" />
        </q-card-section>
      </q-card>
    </div>

    <footer class="footer-centered">
      <p>&copy; {{ new Date().getFullYear() }} Document Manager. Todos los derechos reservados.</p>
    </footer>

    <!-- Modal de confirmación de cierre de sesión -->
    <q-dialog v-model="showLogoutModal" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">¿Estás seguro de que deseas cerrar sesión?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="showLogoutModal = false" />
          <q-btn flat label="Cerrar Sesión" color="negative" @click="confirmLogout" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import FileForm from '../components/FileForm.vue';
import FileGrid from '../components/FileGrid.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    FileForm,
    FileGrid,
  },
  setup(){
    const showLogoutModal = ref(false);
    const route = useRouter();

    const confirmLogout = () => {
      showLogoutModal.value = false;
      route.push('/');
    };

    return { showLogoutModal, confirmLogout };
  },
};
</script>

<style scoped lang="scss">
.footer-centered {
  text-align: center;
  padding: 12px 0;
  background-color: #e3f2fd;
  color: #1565c0;
  margin-top: 24px;
  border-top: 1px solid #ccc;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1565c0;
  padding: 16px;
  border-radius: 8px;
  color: white;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.logout-button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #d32f2f;
}

@media (min-width: 768px) {
  .main-container {
    padding: 24px;
  }
  
  .header-title {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .main-container {
    max-width: 900px;
    margin: 0 auto;
  }
}

.centered-container {
  display: flex;
  justify-content: center; 
  margin: 20px 0; 
}

.file-card {
  width: 80%; 
  max-width: 1200px; 
}

.my-separator {
  margin: 16px 0; 
}

@media (max-width: 768px) {
  .file-card {
    width: 95%; 
  }
}
</style>