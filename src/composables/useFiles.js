import { ref } from 'vue';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/firebaseConfig';

const files = ref([]);
const storage = getStorage();

export const useFiles = () => {
  const addFile = async (fileInfo) => {
  if (!fileInfo.file) {
    console.error("No file provided");
    return;
  }

  const fileId = Math.random().toString(36).substr(2, 9);
  const storageReference = storageRef(storage, `files/${fileId}_${fileInfo.file.name}`);

  try {
    // Sube el archivo a Firebase Storage
    await uploadBytes(storageReference, fileInfo.file);
    const fileUrl = await getDownloadURL(storageReference);

    // Guarda la información en Firestore
    const { file, ...fileData } = fileInfo; // Extrae file y guarda el resto
    const docRef = await addDoc(collection(db, 'files'), {
      id: fileId,
      ...fileData,
      fileUrl,
      pinned: false,
    });

    // Agregar el ID del documento a la lista local
    files.value.push({
      id: docRef.id, // Usar el ID del documento generado
      ...fileInfo,
      fileUrl,
      pinned: false,
    });
    console.log("File added successfully:", docRef.id);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

  const updateFile = async (id, data) => {
  const fileRef = doc(db, 'files', id); // Asegúrate de que `id` es válido y que existe en Firestore
    try {
      await updateDoc(fileRef, data);
      const index = files.value.findIndex((file) => file.id === id);
      if (index !== -1) {
        files.value[index] = { ...files.value[index], ...data };
      }
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  async function removeFile(fileId) {
      if (!fileId) {
          console.error("ID de archivo no válido");
          throw new Error("ID de archivo no válido");
      }

      const fileDocRef = doc(db, "files", fileId); // Asegúrate de que "files" es el nombre de tu colección

      try {
          await deleteDoc(fileDocRef);
          console.log("Archivo eliminado exitosamente");
      } catch (error) {
          console.error("Error al eliminar el archivo:", error);
      }
  }

  const togglePin = (id) => {
    const file = files.value.find(file => file.id === id);
    if (file) {
      file.pinned = !file.pinned;
    }
  };

  return {
    files,
    addFile,
    updateFile,
    removeFile,
    togglePin,
  };
};