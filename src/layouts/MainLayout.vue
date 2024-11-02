<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Document Organizer</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
};
</script>