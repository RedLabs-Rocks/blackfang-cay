<template>
  <div class="content-navigation-wrapper">
    <v-list class="content-navigation" nav dense>
      <v-list-item clickable :to="'/red/email-management'">
        <v-list-item-icon>
          <v-icon name="alternate_email" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-text-overflow text="Email Management" />
        </v-list-item-content>
      </v-list-item>

    </v-list>
  </div>
</template>

<style lang="scss" scoped>
.content-navigation-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.content-navigation {
  --v-list-min-height: calc(100% - 64px);

  flex-grow: 1;
}
</style>
