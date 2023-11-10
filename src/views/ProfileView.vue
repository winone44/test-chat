<template>
  <b-container>
    <div class="row gutters-sm">
      <div class="col-md-5 col-lg-6 mb-3">
        <div class="card">
          <div class="card-body">
            <div class="d-flex flex-column align-items-center text-center">
              <img :src="'/media/photos/' + $store.state.person.profile_picture"
                   class="rounded-circle user_img" width="150">
              <div class="mt-3">
                <h4>{{ $store.state.person.firstName }} {{ $store.state.person.lastName }}</h4>
                <p class="text-secondary mb-1">Full Stack Developer</p>
                <p class="text-muted font-size-sm">Bay Area, San Francisco, CA</p>
                <button class="btn btn-primary">Follow</button>
                <button class="btn btn-outline-primary">Message</button>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-3">
          <ul class="list-group list-group-flush">
            <li v-for="(group, index) in $store.state.person.groups" :key="index" class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
              <h6 class="mb-0">
                <b-img width="24px" :src="'/media/photos/' + group.logo_url"></b-img>
                {{ group.name }}
              </h6>
              <span class="text-secondary">{{ group.group_site_url }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  name: "ProfileView",
  props: {
    personId: [String, Number]
  },
  methods: {
    async getPerson() {
      await this.$store.dispatch("getPerson", {
        id: this.personId
      })
    },
  },
  created() {
    this.getPerson();
  }
}
</script>

<style scoped>
.main-body {
  padding: 15px;
}

.card {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06);
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 0 solid rgba(0, 0, 0, .125);
  border-radius: .25rem;
}

.card-body {
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1rem;
}

.gutters-sm {
  margin-right: -8px;
  margin-left: -8px;
}

.gutters-sm > .col, .gutters-sm > [class*=col-] {
  padding-right: 8px;
  padding-left: 8px;
}

.mb-3, .my-3 {
  margin-bottom: 1rem !important;
}

.bg-gray-300 {
  background-color: #e2e8f0;
}

.h-100 {
  height: 100% !important;
}

.shadow-none {
  box-shadow: none !important;
}
</style>