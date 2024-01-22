<template>
  <b-container>
    <b-row class="gutters-sm">
      <b-col class="col-md-5 col-lg-6 mb-3">
        <ProfileCardComponent />
        <b-card no-body class="mt-3">
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
                <b-img width="24px" :src="logoIconCDN(data.item.logo_url)"></b-img>
                {{ data.item.name }}
              </div>
            </template>
            <template #head(name)>
              {{ localT('headGroupNameGroupTable') }}
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
                {{ localT('headWebsiteGroupTable') }}
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
        </b-card>
        <ListGrupAlertComponent v-if="$route.params.personId === $store.state.userId" />
      </b-col>
      <b-col v-if="$route.params.personId === $store.state.userId" class="col-md-7 col-lg-6 mb-3">
        <transition name="fade" mode="out-in">
          <b-card-body v-if="isLoading">
            <div class="d-flex justify-content-center">
              <div>
                <b-spinner variant="warning"/>
              </div>
            </div>
          </b-card-body>
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
                      :icon-url="iconUrl(person)">
                  </l-icon>
                  <l-tooltip>{{ person.name }}</l-tooltip>
                </l-marker>
                <l-polyline
                    v-for="(line, i) in lines"
                    :key="i+'line'"
                    :lat-lngs="line"
                    :color="lineColor"
                />
              </l-map>
            </div>
            <b-card class="mt-3">
              <RangeInputClosestPointsComponent
                  :closestPoints="closestPoints"
                  @changeClosestPoints="closestPoints = $event"
              />
            </b-card>
            <b-card no-body class="mt-3">
              <b-table striped hover :items="closest" :fields="fields2">
                <template #head(profile_picture)>
                  <ButtonGroupMessageModalComponent :closest="closest"/>
                </template>
                <template #cell(profile_picture)="data">
                  <b-avatar
                      :src="profilePictureCDN(data.value)"
                      class="user_img"
                  />
                </template>
              </b-table>
            </b-card>
          </div>
        </transition>
      </b-col>
      <b-col v-else class="col-md-7 col-lg-6 mb-3">
        <b-img style="width: 100%; opacity: 20%" :src="CDN('/logo.png')"></b-img>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {LIcon, LMap, LMarker, LPolyline, LTileLayer, LTooltip} from "vue2-leaflet";
import 'leaflet/dist/leaflet.css';
import ButtonAddGroupModalComponent from "@/components/ProfileView/ButtonAddGroupModalComponent.vue";
import ButtonDelGroupModalComponent from "@/components/ProfileView/ButtonLeaveGroupModalComponent.vue";
import ButtonGroupMessageModalComponent from "@/components/ProfileView/ButtonGroupMessageModalComponent.vue";
import ListGrupAlertComponent from "@/components/ProfileView/ListGrupAlertComponent.vue";
import ProfileCardComponent from "@/components/ProfileView/ProfileCardComponent.vue";
import RangeInputClosestPointsComponent from "@/components/ProfileView/RangeInputClosestPointsComponent.vue";

export default {
  name: "ProfileView",
  components: {
    RangeInputClosestPointsComponent,
    ProfileCardComponent,
    ListGrupAlertComponent,
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
          label: this.localT('profilePictureLabelCloseUsers'),
        },
        {
          key: 'name',
          label: this.localT('nameLabelCloseUsers'),
          sortable: true
        },
        {
          key: 'distance',
          label: this.localT('distanceLabelCloseUsers'),
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
    iconUrl(person){
      return this.profilePictureCDN(person.profile_picture) === `${process.env.VUE_APP_CDN_URL}/media/photos/` ? this.profilePictureCDN('avatar.png') : this.profilePictureCDN(person.profile_picture)
    },
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
  },
  async created() {
    await this.getPerson();
    await this.getGroupMembers(this.$store.state.person.groups[0].id);
  },

}
</script>

<style scoped>
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



.disabled {
  pointer-events: none;
}

.pointer {
  cursor: pointer;
}

</style>