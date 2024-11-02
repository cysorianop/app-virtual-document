<template>
  <div class="file-table">
    <div v-for="file in files" :key="file.id" class="file-card">
      <div class="file-image">
        <img v-if="file.fileUrl" :src="file.fileUrl" alt="Archivo" />
      </div>
      <h4>{{ file.name }}</h4>
      <div class="file-actions">
        <button @click="togglePin(file.id)" :disabled="file.pinned && !file.pinned"> 
          {{ file.pinned ? 'Desanclar' : 'Anclar' }}
        </button>
        <button @click="confirmRemove(file.id)" :disabled="file.pinned">Eliminar</button>
        <button @click="showInfo(file)">Información</button>
      <button @click="editDocument(file)">Editar</button>
        <button @click="openSendModal(file)">Enviar</button>
      </div>
    </div>

    <!-- Modal para mostrar información completa -->
    <div v-if="selectedFile" class="modal">
      <h3>Información del archivo</h3>
      <p><strong>ID:</strong> {{ selectedFile.id }}</p>
      <p><strong>Nombre:</strong> {{ selectedFile.firstName || 'No disponible' }}</p>
      <p><strong>Apellido:</strong> {{ selectedFile.lastName || 'No disponible' }}</p>
      <p><strong>Nombre del archivo:</strong> {{ selectedFile.name }}</p>
      <p><strong>Cantidad de páginas:</strong> {{ selectedFile.pageCount || 'No disponible' }}</p>
      <p><strong>Número de elemento:</strong> {{ selectedFile.elementNumber || 'No disponible' }}</p>
      <p><strong>URL:</strong> <a :href="selectedFile.fileUrl" target="_blank">{{ selectedFile.fileUrl }}</a></p>
      <p><strong>Fecha de subida:</strong> {{ selectedFile.uploadDate || 'No disponible' }}</p>
      <button class="close-button" @click="selectedFile = null">Cerrar</button>
    </div>

    <!-- Modal para confirmar eliminación -->
    <div v-if="showDeleteModal" class="modal">
      <h3>¿Estás seguro de eliminar este archivo?</h3>
      <button class="confirm-button" @click="deleteFile(fileToDelete)">Sí</button>
      <button class="cancel-button" @click="showDeleteModal = false">No</button>
    </div>

    <!-- Modal para editar el archivo -->
    <div v-if="editingFile" class="modal">
      <h3>Editar archivo</h3>
      <input v-model="editingFile.name" placeholder="Nombre" class="email-input"/>
      <input v-model="editingFile.firstName" placeholder="Nombre" class="email-input"/>
      <input v-model="editingFile.lastName" placeholder="Apellido" class="email-input" />
      <input v-model="editingFile.pageCount" placeholder="Cantidad de páginas" class="email-input"/>
      <button @click="updateFile" class="confirm-button">Actualizar</button>
      <button @click="cancelEdit" class="close-button">Cancelar</button>
    </div>

    <!-- Modal para enviar archivo con confirmación -->
    <div v-if="fileToSend" class="modal">
      <h3>Enviar archivo</h3>
      <input v-model="email" placeholder="Correo del destinatario" class="email-input" required />
      <button class="confirm-button" @click="confirmSend">Enviar</button>
      <button class="cancel-button" @click="fileToSend = null">Cancelar</button>
    </div>

    <div v-if="showSendConfirmModal" class="modal">
      <p>¿Seguro que deseas enviar el archivo a {{ email }}?</p>
      <button class="confirm-button" @click="sendFile">Sí</button>
      <button class="cancel-button" @click="showSendConfirmModal = false">No</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useFiles } from '../composables/useFiles';

export default {
  setup() {
    const { files, togglePin, removeFile: deleteFileFromDb, updateFile: updateFileInDb } = useFiles();
    const db = getFirestore();

    const selectedFile = ref(null);
    const editingFile = ref(null);
    const fileToSend = ref(null);
    const fileToDelete = ref(null);
    const showDeleteModal = ref(false);
    const showSendConfirmModal = ref(false);
    const email = ref('');
    
    const fetchFiles = async () => {
      const querySnapshot = await getDocs(collection(db, 'files'));
      files.value = []; // Limpiar la lista antes de añadir
      querySnapshot.forEach((doc) => {
        files.value.push({ id: doc.id, ...doc.data() });
      });
    };

    onMounted( async () => {
      await fetchFiles();
    });

    const showInfo = (file) => {
      selectedFile.value = file;
    };

    const editDocument = (file) => {
      editingFile.value = { ...file }; // Copiar el archivo para poder editar
    };

    const confirmRemove = (fileId) => {
      console.log('Archivos disponibles:', files.value);
      console.log('ID recibido para eliminación:', fileId);
      fileToDelete.value = fileId;
      showDeleteModal.value = true;
    };

    const deleteFile = async (fileId) => {
        console.log('ID recibido para eliminación:', fileId);
    const storage = getStorage();
    const fileRef = ref(storage, `files/${fileId}`);
    try {
        await deleteObject(fileRef);
        console.log(`Archivo con ID ${fileId} eliminado exitosamente.`);
    } catch (error) {
        console.error("Error al eliminar el archivo:", error);
        alert("Error al eliminar el archivo: " + error.message);
    }
    }

    const openSendModal = (file) => {
      fileToSend.value = file;
    };

    const confirmSend = () => {
      showSendConfirmModal.value = true;
    };

    const sendFile = async () => {
      // Implementación de envío de correo
      const response = await fetch('https://api.emailprovider.com/send', { // Reemplaza con tu API de envío de correo
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email.value,
          subject: 'Archivo enviado',
          body: `Has recibido el archivo: ${fileToSend.value.name}. Puedes verlo aquí: ${fileToSend.value.fileUrl}`,
        }),
      });

      if (response.ok) {
        // Manejar respuesta exitosa
        console.log('Correo enviado con éxito');
      } else {
        // Manejar error
        console.error('Error al enviar correo');
      }

      showSendConfirmModal.value = false;
      fileToSend.value = null;
    };

    const updateFile = async () => {
      try {
        const { id, elementNumber, fileUrl, ...data } = editingFile.value; // Excluir id, elementNumber y fileUrl
        await updateFileInDb(id, data); // Asegúrate de pasar el ID correcto
        editingFile.value = null; // Cerrar modal de edición
        await fetchFiles(); // Recargar archivos para mostrar cambios
      } catch (error) {
        console.error('Error al actualizar el archivo:', error);
      }
    };

    const cancelEdit = () => {
      editingFile.value = null;
    };

    return {
      files,
      togglePin,
      showInfo,
      editDocument,
      selectedFile,
      editingFile,
      fileToSend,
      email,
      confirmRemove,
      showDeleteModal,
      openSendModal,
      confirmSend,
      showSendConfirmModal,
      sendFile,
      deleteFile,
      updateFile,
      cancelEdit,
    };
  },
};
</script>

<style scoped lang="scss">
.file-table {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.file-card {
  background-color: #f4f6f8;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.file-image img {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
}

.file-actions button {
  margin: 4px;
  padding: 8px 12px;
  font-size: 0.9rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1565c0;
  }

  &:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 400px; /* Ancho máximo del modal */
  width: 90%; /* Ancho responsivo */
  overflow: auto; /* Permitir scroll si el contenido desborda */
  backdrop-filter: blur(10px);
}

.modal h3 {
  text-align: center; /* Centrar el título del modal */
  margin-bottom: 20px; /* Espaciado inferior */
  font-size: 24px; /* Tamaño del título */
  color: #333; /* Color del título */
}

.modal p {
  word-wrap: break-word; /* Permitir que las palabras largas se dividan */
  overflow-wrap: break-word; /* Compatibilidad con navegadores */
  text-align: left; /* Alinear texto a la izquierda */
  margin-bottom: 10px; /* Espaciado inferior entre párrafos */
}

.modal a {
  display: block; /* Hacer que el enlace ocupe todo el ancho */
  word-wrap: break-word; /* Permitir que la URL se ajuste */
  overflow-wrap: break-word; /* Compatibilidad con navegadores */
  text-overflow: ellipsis; /* Mostrar puntos suspensivos si la URL es demasiado larga */
  white-space: nowrap; /* Mantener la URL en una sola línea */
  overflow: hidden; /* Ocultar el desbordamiento */
}

.confirm-button, .cancel-button {
  display: block; /* Mostrar como bloques */
  width: 100%; /* Hacer que los botones ocupen todo el ancho */
  margin-top: 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-button:hover, .cancel-button:hover {
  background-color: #1565c0;
}

.cancel-button {
  display: block; /* Mostrar como bloques */
  width: 100%; /* Hacer que los botones ocupen todo el ancho */
  margin-top: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: red;
}

.close-button {
  display: block; /* Mostrar como bloques */
  width: 100%; /* Hacer que los botones ocupen todo el ancho */
  margin-top: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background-color: red;
}

.email-input {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
</style>