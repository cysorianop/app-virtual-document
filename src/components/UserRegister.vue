<template>
  <div class="user-register">
    <form @submit.prevent="handleRegister" class="auth-form">
      <input type="email" v-model="registerEmail" placeholder="Correo Electrónico" required />
      <input type="password" v-model="registerPassword" placeholder="Contraseña" required />
      <button type="submit">Registrar</button>
      <p v-if="registrationError" class="error">{{ registrationError }}</p>
    </form>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

export default {
  data() {
    return {
      registerEmail: '',
      registerPassword: '',
      registrationError: null,
    };
  },
  methods: {
    async handleRegister() {
      this.registrationError = null; 
      try {
        await createUserWithEmailAndPassword(auth, this.registerEmail, this.registerPassword);
        this.registerEmail = '';
        this.registerPassword = '';
        alert('Registro exitoso!'); // Puedes reemplazar esto por una lógica diferente si lo prefieres
        this.$emit('close'); // Cerrar el modal al registrarse correctamente
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          this.registrationError = 'Usuario ya registrado'; // Error específico para usuarios ya registrados
          this.$emit('registration-error'); // Emitir evento para mostrar alerta
        } else {
          this.registrationError = error.message;
        }
      }
    },
  },
};
</script>

<style scoped>
.user-register {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo semitransparente */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra para profundidad */
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

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3; /* Color al pasar el ratón */
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>