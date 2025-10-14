<template>
  <v-container :key="locale">
    <div class="mb-4">
      
      <p class="font-weight-black text-h4 text-accent">{{ $t('dashboard.welcome') }}</p>
      <p class="font-weight-black text-h2 text-secondary">FlowData</p>
<!--<p class="font-weight-medium text-accent">{{ t('dashboard.logged_as', { role: roleUserLabel }) }}</p>-->
    </div>
    <v-card>
      <v-card-title class="text-h5">{{ t('dashboard.admin_panel') }}</v-card-title>
      <v-card-text>
        <p class="text-body-1 text-grey-darken-1">
          {{ t('dashboard.description') }}
        </p>
      </v-card-text>
      <v-container>
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <TotalSuppliers />
          </v-col>
          <v-col cols="12" md="6">
            
          </v-col>
        </v-row>
        <p class="text-h5 mb-4 text-accent"></p>
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="4">
            <v-btn block color="accent" size="large" to="/suppliers/suppliers">
              <v-icon start>mdi-account-plus</v-icon>
              {{ t('dashboard.new_supplier') }}
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-btn block color="primary" size="large" to="/supplyitem/supplyitem">
              <v-icon start>mdi-package-variant-plus</v-icon>
              {{ t('dashboard.new_supply') }}
            </v-btn>
          </v-col>
          <!--<v-col cols="12" sm="6" md="4">
            <v-btn block color="accent" size="large" to="/compras/pedidos">
              <v-icon start>mdi-cart-plus</v-icon>
              {{ t('dashboard.manage_orders') }}
            </v-btn>
          </v-col>-->
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import TotalSuppliers from '~/components/TotalSuppliers.vue'
import InsumosContador from '~/components/InsumoContador.vue'
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { t, locale } = useI18n()

definePageMeta({
  layout: 'default',
  middleware: 'auth',
  i18n:true
})

const { user } = useAuth()

</script>

<style scoped>
.v-btn .v-icon {
  margin-right: 8px;
}
</style>