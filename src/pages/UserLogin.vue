<template>
  <div class="login-container">
    <div class="auth-wrapper common-container">
      <q-card class="auth-card" bordered>
        <q-card-section>
          <h2 class="card-title">Iniciar Sesión</h2>
          <UserAuth @authenticated="handleAuthentication" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import UserAuth from '../components/UserAuth.vue';

export default {
  components: {
    UserAuth,
  },
  methods: {
    handleAuthentication() {
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style scoped lang="scss">
.login-container {
  height: 100vh; /* Ocupa toda la altura de la pantalla */
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('../assets/image1.jfif'); /* Cambia esta ruta */
  background-size: auto; /* La imagen de fondo ocupa toda la pantalla */
  background-position: center;
}

.card-title {
  text-align: center; /* Centrar el texto */
  margin-bottom: 16px; /* Espaciado inferior */
  font-size: 36px; /* Tamaño de fuente */
  font-weight: bold; /* Estilo negrita */
  color: #333; /* Color del título */
}
</style>