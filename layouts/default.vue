<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary width="256">
      <v-list nav dense>
        <v-list-item class="px-4 py-2" title="Menu" />

        <v-divider></v-divider>
        <v-list-item to="/dashboard" link @click="closeDrawerOnMobile" prepend-icon="mdi-view-dashboard"
          title="Dashboard" color="primary" />
        <v-list-item to="/fornecedores/fornecedores" link @click="closeDrawerOnMobile" prepend-icon="mdi-truck"
          title="Fornecedores" color="primary" />
        <v-list-item to="/suppliers/suppliers" link @click="closeDrawerOnMobile" prepend-icon="mdi-account-group"
          title="Suppliers" color="primary" />
        <v-list-item to="/insumos/insumos" link @click="closeDrawerOnMobile" prepend-icon="mdi-package-variant"
          title="Insumos" color="primary" />
        <v-list-item to="/supplyitem/supplyitem" link @click="closeDrawerOnMobile" prepend-icon="mdi-package-variant"
          title="Supply Item" color="primary" />
        <v-list-item to="/estoque/movimentacao_estoque" link @click="closeDrawerOnMobile" prepend-icon="mdi-package-variant-closed"
          title="Estoque" color="primary" />
          <v-list-item to="/users/users" link @click="closeDrawerOnMobile" prepend-icon="mdi-account-group"
          title="Users" color="primary" />
        
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout" prepend-icon="mdi-logout" variant="outlined" block color="primary">
            Sair
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="background" class="text-accent" style="border-bottom: 2px solid;">
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title @click="navigateTo('/dashboard')" class="font-weight-bold">FlowData</v-toolbar-title>
      <template v-slot:append>
        <div class="d-flex align-center ga-3 px-2" id="user-info">
          <UserDetails />
          <v-select
            v-model="localeValue"
            :items="locales"
            item-title="label"
            item-value="code"
            hide-details
            variant="underlined"
            density="compact"
            style="max-width: 140px;"
            class="text-caption"
          />
          <v-btn icon="mdi-logout" color="accent" @click="logout"></v-btn>
        </div>
      </template>
    </v-app-bar>

    <v-main>
      <v-container class="pa-4">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useDisplay } from 'vuetify';
import { navigateTo } from 'nuxt/app';
import UserDetails from '~/components/UserDetails.vue'

const router = useRouter();
const { logout: doLogout } = useAuth();
const { mobile } = useDisplay();

const drawer = ref(false); 
const { locale, setLocale } = useI18n();
const localeValue = ref(locale.value);

const locales = [
  { code: 'pt-BR', label: '🇧🇷 Português' },
  { code: 'en', label: '🇺🇸 English' }
];

watch(localeValue, async (newLocale) => {
  if (typeof newLocale === 'string' && newLocale && newLocale !== locale.value) {
    await setLocale(newLocale);
  }
});

watch(locale, (newLocale) => {
  if (newLocale !== localeValue.value) {
    localeValue.value = newLocale;
  }
});

function toggleDrawer() {
  drawer.value = !drawer.value;
}

function closeDrawerOnMobile() {
  if (mobile.value) {
    drawer.value = false;
  }
}

function logout() {
  doLogout();
  router.push('/login');
}
</script>

<style scoped>
</style>