<template>
  <div class="home">{{ user }}</div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    user: {
      query: gql`
        query get_user {
          user {
            login
            display_name
          }
        }
      `,
      variables() {
        return {
          myVar: this.myVar,
        }
      },
    },
  },
}
</script>
