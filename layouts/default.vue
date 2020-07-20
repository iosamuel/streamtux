<template>
  <div class="main">
    <header>
      <h3><nuxt-link to="/">StreamTux</nuxt-link></h3>
      <div class="side-header">
        <template v-if="user">
          <span>
            <nuxt-link to="/profile">{{ user.display_name }}</nuxt-link>
          </span>
          <img :src="user.profile_image_url" :alt="user.display_name" />
        </template>
        <template v-else>
          <span><a href="/twitch/auth" to="/login">Login</a></span>
          <fa :icon="['fas', 'user-circle']"></fa>
        </template>
      </div>
    </header>
    <div class="main__container">
      <nuxt />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user']),
  },
}
</script>

<style lang="scss" src="@/assets/css/layouts/default.scss"></style>
