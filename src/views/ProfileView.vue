<template>
  <b-container>
    <div class="row gutters-sm">
      <div class="col-md-5 col-lg-6 mb-3">
        <div class="card">
          <div class="card-body">
            <div class="d-flex flex-column align-items-center text-center">
              <b-avatar :src="$store.getters.profilePicture"
                        class="rounded-circle user_img" width="150"/>
              <div class="mt-3">
                <h4>{{ $store.getters.person.firstName }} {{ $store.getters.person.lastName }}</h4>
                <p class="text-secondary mb-1">Full Stack Developer</p>
                <p class="text-muted font-size-sm">Bay Area, San Francisco, CA</p>
                <button class="btn btn-primary">Follow</button>
                <button class="btn btn-outline-primary">Message</button>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-3">
          <b-table
              :per-page="perPage"
              :current-page="currentPage"
              hover
              :items="$store.getters.person.groups"
              :fields="fields"
              :tbody-tr-class="rowClass"

          >
            <template #cell(name)="data">
              <div
                  :class="{pointer: $route.params.personId === $store.state.userId, disabled: $route.params.personId !== $store.state.userId}"
                  @click="getGroupMembers(data.item.id)"
              >
                <b-img width="24px" :src="logoIcon(data.item.logo_url)"></b-img>
                {{ data.item.name }}
              </div>
            </template>
            <template #head(name)>
              Nazwa organizacji
            </template>
            <template #cell(group_site_url)="data">
              <a :href="data.item.group_site_url">{{ data.item.group_site_url | normalizeUrl }}</a>
            </template>
            <template #head(group_site_url)>
              <div v-if="$route.params.personId === $store.state.userId" class="d-flex justify-content-between">
                <div>
                  <ButtonAddGroupModalComponent/>
                </div>
                <div @click="unLockDelButtons()">
                  <div v-if="isUnlockDelButtons">
                    <b-icon icon="unlock-fill"></b-icon>
                  </div>
                  <div v-else>
                    <b-icon icon="lock-fill"></b-icon>
                  </div>
                </div>
              </div>
              <div v-else>
                Strona internetowa
              </div>
            </template>
            <template v-if="isUnlockDelButtons" #cell(del)="row">
              <ButtonDelGroupModalComponent :row="row"/>
            </template>
          </b-table>
          <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
          ></b-pagination>
        </div>
        <ListGrupAlertComponent v-if="$route.params.personId === $store.state.userId" />
      </div>
      <div v-if="$route.params.personId === $store.state.userId" class="col-md-7 col-lg-6 mb-3">
        <transition name="fade" mode="out-in">
          <div v-if="isLoading" class="card-body">
            <div class="d-flex justify-content-center">
              <div>
                <b-spinner variant="warning"/>
              </div>
            </div>
          </div>
          <div v-else>
            <div id="map-container">
              <l-map :zoom="zoom" :center="center">
                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                <l-marker
                    v-for="(person, index) in people"
                    :key="index"
                    :lat-lng="[person.latitude, person.longitude]"
                    @mouseover="blockDetails ? null : showDetails(person)"
                    @click="blockHideDetails"
                    @mouseout="hideDetails"
                >
                  <l-icon
                      :icon-size="[32, 32]"
                      :icon-anchor="[16, 32]"
                      :icon-url="profilePicture(person.profile_picture) === '/media/photos/' ? '/media/photos/avatar.png' : profilePicture(person.profile_picture)">
                  </l-icon>
                  <l-tooltip>{{ person.name }}</l-tooltip>
                </l-marker>
                <l-polyline
                    v-for="(line, i) in lines"
                    :key="i+'line'"
                    :lat-lngs="line"
                    :color="lineColor"
                ></l-polyline>
              </l-map>
            </div>
            <div class="card mt-3">
              <RangeInputClosestPoints
                  :closestPoints="closestPoints"
                  @changeClosestPoints="closestPoints = $event"
              />
            </div>
            <div class="card mt-3">
              <b-table striped hover :items="closest" :fields="fields2">
                <template #head(profile_picture)>
                  <ButtonGroupMessageModalComponent :closest="closest"/>
                </template>
                <template #cell(profile_picture)="data">
                  <b-avatar :src="profilePicture(data.value)"
                            class="rounded-circle user_img"/>
                </template>
              </b-table>
            </div>
          </div>
        </transition>
      </div>
      <div v-else class="col-md-7 col-lg-6 mb-3">
        <b-img style="width: 100%; opacity: 20%" src="/logo.png"></b-img>
      </div>
    </div>
  </b-container>
</template>

<script>
import {LIcon, LMap, LMarker, LPolyline, LTileLayer, LTooltip} from "vue2-leaflet";
import 'leaflet/dist/leaflet.css';
import ButtonAddGroupModalComponent from "@/components/ProfileView/ButtonAddGroupModalComponent.vue";
import ButtonDelGroupModalComponent from "@/components/ProfileView/ButtonLeaveGroupModalComponent.vue";
import ButtonGroupMessageModalComponent from "@/components/ProfileView/ButtonGroupMessageModalComponent.vue";
import RangeInputClosestPoints from "@/components/ProfileView/RangeInputClosestPoints.vue";
import ListGrupAlertComponent from "@/components/ProfileView/ListGrupAlertComponent.vue";

export default {
  name: "ProfileView",
  components: {
    ListGrupAlertComponent,
    RangeInputClosestPoints,
    ButtonGroupMessageModalComponent,
    ButtonAddGroupModalComponent,
    ButtonDelGroupModalComponent,
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LPolyline,
    LIcon
  },
  props: {
    personId: [String, Number]
  },
  data() {
    return {
      activeGroupIndex: 0,

      blockDetails: false,
      isLoading: true,
      isUnlockDelButtons: false,

      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 6,
      center: [51.9194, 19.1451],
      markerLatLng: [51.504, -0.159],
      people: [],
      closest: [],
      lineColor: 'green',
      closestPoints: 5,

      fields: [
        {
          key: 'name',
        },
        {
          key: 'group_site_url',
        }
      ],
      fields2: [
        {
          key: 'profile_picture',
          label: 'Awatar',
        },
        {
          key: 'name',
          label: 'Nazwa',
          sortable: true
        },
        {
          key: 'distance',
          label: 'Dystans (w km)',
          sortable: true
        }
      ],
      lines: [],
      activePerson: null,

      currentPage: 1,
      perPage: 5,

      newMessageText: ''
    };
  },
  computed: {
    totalRows() {
      return this.$store.getters.person.groups.length;
    }
  },
  methods: {
    unLockDelButtons() {
      if (this.isUnlockDelButtons) {
        this.fields = this.fields.filter(field => field.key !== 'del');
      } else {
        this.fields.push({key: 'del'});
      }
      this.isUnlockDelButtons = !this.isUnlockDelButtons;
    },

    async getPerson() {
      await this.$store.dispatch("getPerson", {
        id: this.personId
      })
    },
    async getGroupMembers(id) {
      this.isLoading = true;
      this.activeGroupIndex = id;
      await this.$store.dispatch("getGroupMembers", {
        id: id
      })
      await this.start();
      this.isLoading = false;
    },
    showDetails(person) {
      this.activePerson = person;
      this.calculateLines(person);
    },
    hideDetails() {
      if (!this.blockDetails) {
        this.lines = [];
      }
    },
    blockHideDetails() {
      this.blockDetails = !this.blockDetails;
      if (this.blockDetails) {
        this.lineColor = 'blue'
      } else {
        this.lineColor = 'green'
      }
    },
    calculateLines(selectedPerson) {
      // Funkcja oblicza odległości od wybranego punktu do wszystkich innych
      let distances = this.people.map(person => {
        let {latitude, longitude, ...restOfProperties} = person;
        let distance = this.calculateDistance(latitude, longitude,
            selectedPerson.latitude, selectedPerson.longitude)
        return {...restOfProperties, latitude, longitude, distance};
      });
      console.log(distances);
      // Sortowanie ludzi według odległości od wybranego punktu
      distances.sort((a, b) => a.distance - b.distance);
      // Wybieranie najbliższych punktów (oprócz samego siebie, który jest pierwszy)
      this.closest = distances.slice(1, Number(this.closestPoints) + 1);
      console.log(this.closestPoints)
      console.log(this.closest);
      // Tworzenie linii między wybranym punktem a najbliższymi punktami
      this.lines = this.closest.map(p => ([
        [selectedPerson.latitude, selectedPerson.longitude],
        [p.latitude, p.longitude]
      ]));
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      // Konwersja stopni na radiany
      function toRadians(degrees) {
        return degrees * Math.PI / 180;
      }

      // Promień Ziemi w kilometrach
      let R = 6371;

      // Konwersja współrzędnych na radiany
      let lat1Rad = toRadians(lat1);
      let lat2Rad = toRadians(lat2);
      let deltaLatRad = toRadians(lat2 - lat1);
      let deltaLonRad = toRadians(lon2 - lon1);

      // Formuła Haversine
      let a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
          Math.cos(lat1Rad) * Math.cos(lat2Rad) *
          Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Obliczenie odległości
      let distance = R * c;

      return Math.round(distance);
    },
    start() {
      this.people = [];
      for (let member of this.$store.state.groupMembers) {
        let person = {
          id: member.id,
          name: `${member.firstName} ${member.lastName}`,
          latitude: member.latitude,
          longitude: member.longitude,
          profile_picture: member.profile_picture
        };
        this.people.push(person);
      }
    },
    rowClass(item, type) {
      if (type === 'row') {
        if (!item || type !== 'row') return
        if (item.id === this.activeGroupIndex) return 'table-active'
      }
    },
    logoIcon(logoIcon) {
      if (logoIcon.startsWith('http://') || logoIcon.startsWith('https://')) {
        // Jeśli zmienna profile_picture zawiera pełny URL
        return logoIcon;
      } else {
        // Jeśli zmienna profile_picture zawiera tylko nazwę pliku
        return '/media/photos/' + logoIcon;
      }
    },
    profilePicture(profilePicture) {
      if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
        // Jeśli zmienna profile_picture zawiera pełny URL
        return profilePicture;
      } else {
        // Jeśli zmienna profile_picture zawiera tylko nazwę pliku
        return '/media/photos/' + profilePicture;
      }
    }
  },
  async created() {
    await this.getPerson();
    await this.getGroupMembers(this.$store.state.person.groups[0].id);
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

#map-container {
  height: 400px;
}

.li-group:hover {
  background-color: #acc3ec;
  cursor: pointer;
}

.li-group-active {
  background-color: #cbd6ea !important;
}

.user_img {
  height: 60px;
  width: 60px;
  border: 1.5px solid #f5f6fa;
}

.disabled {
  pointer-events: none;
}

.pointer {
  cursor: pointer;
}

</style>