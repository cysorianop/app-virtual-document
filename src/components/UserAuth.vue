<template>
  <div class="user-auth common-container">
    <h2 class="auth-title card-title">Bienvenido</h2>

    <!-- Formulario de inicio de sesión -->
    <form @submit.prevent="handleLogin" class="auth-form">
      <input type="email" v-model="loginEmail" placeholder="Correo Electrónico" required />
      <input type="password" v-model="loginPassword" placeholder="Contraseña" required />
      <div class="button-container">
        <button class="login-button" type="submit">Iniciar Sesión</button>
      </div>
      <p v-if="loginError" class="error">{{ loginError }}</p>
    </form>

    <!-- Botón para abrir el modal de registro -->
    <div class="button-container">
      <button class="register-button" @click="openRegisterModal">Registrar</button>
    </div>

    <!-- Modal para registro -->
    <q-dialog v-model="registerModal" persistent>
      <q-card class="modal-card">
        <q-card-section>
          <h3 class="modal-title">Registrarse</h3>
          <form @submit.prevent="handleRegister" class="auth-form">
            <input type="email" v-model="registerEmail" placeholder="Correo Electrónico" required />
            <input type="password" v-model="registerPassword" placeholder="Contraseña" required />
            <div class="button-container">
              <button type="submit" class="modal-register-button">Registrar</button>
            </div>
            <p v-if="registrationError" class="error">{{ registrationError }}</p>
          </form>
          <div class="button-container">
            <q-btn @click="closeRegisterModal" class="close-button" color="red" label="Cerrar" flat />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de confirmación de registro -->
    <q-dialog v-model="showLogoutModal" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">¿Registro exitoso! ¿Deseas iniciar sesión?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="No" color="negative" @click="showLogoutModal = false" />
          <q-btn flat label="Iniciar Sesión" color="primary" @click="confirmLogout" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import { useRouter } from 'vue-router'; 

export default {
  data() {
    return {
      registerEmail: '',
      registerPassword: '',
      loginEmail: '',
      loginPassword: '',
      registrationError: null,
      loginError: null,
      registerModal: false, // Estado del modal de registro
      showLogoutModal: false,
    };
  },
  setup() {
    const router = useRouter(); 
    return { router };
    
  },
  methods: {
    async handleRegister() {
      this.registrationError = null; // Reiniciar mensaje de error
      try {
        await createUserWithEmailAndPassword(auth, this.registerEmail, this.registerPassword);
        this.registerEmail = '';
        this.registerPassword = '';
        this.showLogoutModal = true; // Abrir el modal de confirmación
      } catch (error) {
        this.registrationError = "Usuario ya registrado en el sistema"; // Mensaje de error personalizado
      }
    },
    async handleLogin() {
      this.loginError = null; 
      try {
        await signInWithEmailAndPassword(auth, this.loginEmail, this.loginPassword);
        this.loginEmail = '';
        this.loginPassword = '';
        this.router.push('/dashboard'); 
      } catch (error) {
        this.loginError = "Los datos introducidos no corresponden"; // Mensaje de error personalizado
      }
    },
    openRegisterModal() {
      // Limpiar los campos y errores al abrir el modal
      this.registerEmail = ''; // Limpiar el correo electrónico
      this.registerPassword = ''; // Limpiar la contraseña
      this.registrationError = null; // Reiniciar mensaje de error al abrir el modal
      this.registerModal = true; // Abrir el modal de registro
    },
    closeRegisterModal() {
      this.registerModal = false; // Cerrar el modal
      this.registrationError = null; // Reiniciar mensaje de error al cerrar
    },
    confirmLogout() {
      this.showLogoutModal = false; // Cierra el modal de confirmación de registro
      this.registerModal = false; // Cierra el modal de registro
      this.router.push('/'); // Redirige a la página de inicio de sesión original
    },
  },
};
</script>

<style scoped lang="scss">
.common-container {
  max-width: 400px; /* Ancho máximo */
  width: 90%; /* Ancho responsivo para tabletas y móviles */
  margin: auto;
  padding: 20px;
  border-radius: 10px; /* Bordes redondeados */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra */
  background-color: rgba(255, 255, 255, 0.9); /* Fondo semitransparente */
}

.auth-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
  color: #333; /* Color del título */
}

.auth-form {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff; /* Color de borde al hacer foco */
}

.button-container {
  display: flex;
  justify-content: center; /* Centrar los botones */
  margin-top: 10px;
}

.login-button {
  width: 200px; /* Ancho reducido del botón de inicio de sesión */
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3; /* Color al pasar el ratón */
}

.register-button {
  width: 200px; /* Ancho reducido del botón de registrar */
  padding: 10px;
  background-color: transparent;
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.register-button:hover {
  background-color: #007bff; /* Color de fondo al pasar el ratón */
  color: white; /* Cambiar el color del texto al pasar el ratón */
}

.modal-card {
  width: 350px; /* Tamaño más pequeño del modal */
}

.modal-title {
  text-align: center;
  margin-bottom: 20px;
}

.modal-register-button {
  width: 200px; /* Ancho reducido del botón de registrar en el modal */
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-register-button:hover {
  background-color: #0056b3; /* Color al pasar el ratón */
}

.close-button {
  width: 100px; /* Ancho reducido del botón cerrar */
  margin-top: 10px; /* Separación del botón cerrar */
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  text-align: center; /* Centrar el mensaje de error */
  background-color: #ffe6e6; /* Fondo claro para destacar el mensaje */
  border: 1px solid red; /* Borde rojo para el mensaje de error */
  padding: 5px; /* Espaciado interno para el mensaje */
  border-radius: 5px; /* Bordes redondeados para el mensaje */
}

/* Responsividad */
@media (max-width: 768px) {
  .common-container {
    width: 90%; /* Más ancho en tabletas */
  }
}

@media (max-width: 480px) {
  .common-container {
    width: 100%; /* Ocupa todo el ancho en móviles */
    margin: 10px; /* Margen para no pegar a los bordes */
  }
}
</style>