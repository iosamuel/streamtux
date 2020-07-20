<template>
  <div class="profile">
    <h2>@{{ user.display_name }}</h2>
    <hr />
    <div class="twitch-card__data">
      <div class="twitch-card__data--left">
        <img :src="user.profile_image_url" :alt="user.display_name" />
      </div>
      <div class="twitch-card__data--right">
        <p><span>Nombre:</span> {{ user.display_name }}</p>
        <p><span>Descripcion:</span> {{ user }}</p>
      </div>
    </div>

    <div class="profile__permissions">
      <h2>Permisos</h2>
      <hr />
      <div class="profile__permissions--data">
        <!-- <MSwitch
          :checked="permissions.retweet"
          label="Retweet"
          @switch-change="setUserPermission($event)"
        /> -->
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import MSwitch from '@/components/MSwitch'

export default {
  components: {
    // MSwitch,
  },
  middleware: ['authenticated'],
  data() {
    return {
      permissions: {},
    }
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>

<style lang="scss" src="@/assets/css/pages/profile.scss"></style>
