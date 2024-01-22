<template>
  <div class="home">
    <b-container fluid class="h-100">
      <b-row v-if="$store.getters.nearestUser === 0" class="justify-content-center h-100">
        {{ localT('reload') }}
      </b-row>
      <b-row v-else class="justify-content-center h-100">
        <b-col class="col-md-4 col-xl-3 chat">
          <b-card no-body class="mb-sm-3 mb-md-0 contacts_card">
            <b-card-header>
              <b-input-group>
                <b-input v-model="filter" type="text" :placeholder="localT('search')" name="" class="search" />
                <b-input-group-prepend>
                  <b-input-group-text class="search_btn"><b-icon icon="search"></b-icon></b-input-group-text>
                </b-input-group-prepend>
              </b-input-group>
            </b-card-header>
            <b-card-body class="contacts_body">
              <swiper
                  :slides-per-view="1"
                  @slideChange="onSlideChange">
                <swiper-slide>
                  <ul class="contacts">
                    <router-link
                        custom v-slot="{ navigate }"
                        :to="{name:'ChatView', params:{personId: person.id}}"
                        :class="{active: person.username === $store.state.username, disabled: isLoading }"
                        v-for="(person, index) in filteredPeople"
                        :key="index"
                    >
                      <li @click="navigate">
                        <div class="d-flex bd-highlight">
                          <div class="img_cont">
                            <b-avatar :src="profilePictureCDN(person.profile_picture)"
                                      class="user_img"/>
                          </div>
                          <div class="user_info">
                            <span>{{ person.firstName }} {{ person.lastName }}</span>
                            <b-row>
                              <b-col>
                                <p>{{ person.distance | formatDistance }}</p>
                              </b-col>
                              <b-col>
                                <img v-for="(group, index2) in person.groups" :key="index2" width="20px"
                                     :src="logoIconCDN(group.logo_url)">
                              </b-col>
                            </b-row>
                          </div>
                        </div>
                      </li>

                    </router-link>
                  </ul>
                </swiper-slide>
                <swiper-slide>
                  {{ localT('inbox') }}
                  <ul class="contacts">
                    <router-link
                        custom v-slot="{ navigate }"
                        :to="{name:'ChatView', params:{personId: person.id}}"
                        :class="{active: person.username === $store.state.username, disabled: isLoading }"
                        v-for="(person, index) in filteredPeopleInbox"
                        :key="index"
                    >
                      <li @click="navigate">
                        <div class="d-flex bd-highlight">
                          <div class="img_cont">
                            <b-avatar :src="profilePictureCDN(person.profile_picture)"
                                      class="user_img"/>
                            <span
                                class="online_icon"
                                :class="{offline: !filteredPeopleInbox.online}"
                            ></span>
                          </div>
                          <div class="user_info">
                            <span>{{ person.firstName }} {{ person.lastName }}</span>
                            <b-row>
                              <b-col>
                                <p>{{ person.distance | formatDistance }}</p>
                              </b-col>
                              <b-col>
                                <img v-for="(group, index2) in person.groups" :key="index2" width="20px"
                                     :src="CDN('/media/photos/' + group.logo_url)">
                              </b-col>
                            </b-row>
                          </div>
                        </div>
                      </li>

                    </router-link>
                  </ul>
                </swiper-slide>
              </swiper>
            </b-card-body>
            <b-card-footer>
              <b-button variant="primary" :to="{name: 'ChatView', params: {personId: this.$store.state.userId}}">
                {{ localT('notebook') }}
              </b-button>
            </b-card-footer>
          </b-card>
        </b-col>
        <b-col class="col-md-8 col-xl-6 chat">
          <b-card no-body>
            <b-card-header class="msg_head">
              <div class="d-flex bd-highlight">
                <router-link :to="{ name: 'ProfileView', params: { personId: this.personId }}">
                  <div class="img_cont">
                    <b-avatar
                        :src="profilePictureCDN($store.getters.person.profile_picture)"
                        class="user_img"
                    />
                    <span
                        class="online_icon"
                        :class="{offline: !$store.getters.person.online}"
                    ></span>
                  </div>
                </router-link>
                <div class="user_info">
                  <span>{{ $store.getters.person.firstName }} {{ $store.getters.person.lastName }}</span>
                  <p>{{ $store.state.messages === null ? 0 : $store.state.messages.length }} {{ localT('messages') }}</p>
                </div>
              </div>
              <span @click="showActionMenu =! showActionMenu" id="action_menu_btn">
                <b-icon icon="three-dots-vertical" />
              </span>
              <div v-show="showActionMenu" class="action_menu">
                <ul>
                  <router-link
                      custom v-slot="{ navigate }"
                      :to="{ name: 'ProfileView', params: { personId: this.personId }}"
                  >
                    <li @click="navigate">
                      <b-icon icon="person-circle" />
                      {{ localT('viewProfile') }}
                    </li>
                  </router-link>
                  <li v-if="!$store.getters.person.blocked_user" @click="blockUser($store.getters.person.id)">
                    <b-icon icon="shield" />
                    {{ localT('block') }}
                  </li>
                  <li v-else @click="unblockUser($store.getters.person.id)">
                    <b-icon icon="shield-slash" />
                    {{ localT('unblock') }}
                  </li>
                </ul>
              </div>
            </b-card-header>
            <transition name="fade" mode="out-in">
              <b-card-body v-if="isLoading">
                <div class="d-flex justify-content-center">
                  <div>
                    <b-spinner variant="warning"/>
                  </div>
                </div>
              </b-card-body>
              <b-card-body v-else ref="messagesContainer" class="msg_card_body">
                <div
                    v-for="(message, index) in $store.state.messages"
                    :key="index"
                    class="d-flex mb-4"
                    :class="{'justify-content-start': String(message.receiver.id) === String($store.state.userId),
                            'justify-content-end': String(message.receiver.id) !== String($store.state.userId)
                  }"
                >
                  <div v-if="String(message.receiver.id) === String($store.state.userId)" class="img_cont_msg">
                    <b-avatar
                        :src="profilePictureCDN($store.getters.person.profile_picture)"
                        class="user_img_msg"
                    />
                  </div>
                  <div
                      :class="{'msg_cotainer': String(message.receiver.id) === String($store.state.userId),
                            'msg_cotainer_send': String(message.receiver.id) !== String($store.state.userId)
                  }"
                  >
                    <span>{{ message.text }}</span>
                    <span
                        :class="{'msg_time': String(message.receiver.id) === String($store.state.userId),
                            'msg_time_send': String(message.receiver.id) !== String($store.state.userId)
                  }"
                    >{{ message.created_at | formatDateMessages }}</span>
                  </div>
                  <div v-if="String(message.receiver.id) !== String($store.state.userId)" class="img_cont_msg">
                    <b-avatar
                        :src="profilePictureCDN($store.state.profilePicture)"
                        class="user_img_msg"
                    />
                  </div>
                </div>
              </b-card-body>
            </transition>
            <b-card-footer>
              <b-input-group>
                <b-form-textarea v-model="newMessageText" @keydown="handleKeydown" name="" class="type_msg"
                                 :placeholder="localT('newMessagePlaceholder')" />
                <b-input-group-append class="input-group-append">
                  <span @click="sendMessage" class="input-group-text send_btn">
                    <b-icon icon="cursor-fill" />
                  </span>
                </b-input-group-append>
              </b-input-group>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>

    </b-container>
  </div>
</template>

<script>
import { Navigation, Pagination } from 'swiper'
import { SwiperCore, Swiper, SwiperSlide } from 'swiper-vue2'
import 'swiper/swiper-bundle.css'
SwiperCore.use([Navigation, Pagination])

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  name: 'ChatView',
  props: {
    personId: [String, Number]
  },
  data() {
    return {
      chatPollingInterval: 10_000,
      showActionMenu: false,
      filter: '',
      intervalId: null,
      conversation: [],
      isLoading: true,
      newMessageText: '',
      shouldAnimate: false, // zmienna do śledzenia, czy powinna wystąpić animacja
      isFirstLoad: true, // zmienna do śledzenia, czy to pierwsze załadowanie
    }
  },
  computed: {
    filteredPeople() {
      return this.$store.state.people.filter(person => {
        const fullName = (person.firstName + ' ' + person.lastName).toLowerCase();
        return fullName.includes(this.filter.toLowerCase());
      });
    },
    filteredPeopleInbox() {
      return this.$store.state.peopleInbox.filter(person => {
        const fullName = (person.firstName + ' ' + person.lastName).toLowerCase();
        return fullName.includes(this.filter.toLowerCase());
      });
    }
  },
  watch: {
    $route(to, from) {
      // Reagowanie na zmianę parametru routera
      if (to.params.personId !== from.params.personId) {
        this.clearAllIntervals();
        this.isLoading = true;
        this.isFirstLoad = true;
        this.$store.state.person = [];
        this.$store.state.messages = [];
        // Wywołanie metody, która pobiera dane użytkownika
        this.getPerson();
        this.getMessage();
        let intervalId = setInterval(this.getMessage, this.chatPollingInterval);
        this.$store.state.intervalIds.push(intervalId)
      }
    },
    conversation: {
      immediate: false,
      handler() {
        if (this.isFirstLoad) {
          this.isFirstLoad = false; // Zresetuj flagę isFirstLoad na false
        } else {
          this.shouldAnimate = true; // ustaw flagę na true, gdy wykryto zmianę
        }
        this.scrollToBottom();
      }
    }
  },
  methods: {
    onSlideChange() {
      console.log('slide change');
    },
    async submitNewDescription() {
      try {
        const id = this.$store.state.userId
        const newData = {description: this.description}
        await this.$store.dispatch('patchPersonDescription', {
          id, newData
        })

        console.log(this.description);
        this.user.description = this.description;
        this.showTextArea = false;
      } catch (e) {
        console.log(e)
      }
    },

    async getPeople() {
      await this.$store.dispatch("getPeople",)
    },
    async getPeopleInbox() {
      await this.$store.dispatch("getPeopleInbox",)
    },
    async getPerson() {
      await this.$store.dispatch("getPerson", {
        id: this.personId
      })
    },
    async getMessage() {
      await this.$store.dispatch("getMessages", {
        receiver: this.personId
      });
      if (this.$store.state.messages && this.conversation.length !== this.$store.state.messages.length) {
        console.log(this.conversation.length)
        console.log(this.$store.state.messages.length)
        this.conversation = this.$store.state.messages;
        console.log(this.conversation);
      }
      this.isLoading = false;
    },
    async blockUser(id) {
      await this.$store.dispatch("addBlockUsers", {
        blocked_user: id
      });
    },
    async unblockUser(id) {
      await this.$store.dispatch("delBlockUsers", {
        blocked_user: id
      });
    },
    handleKeydown(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Zapobiega domyślnemu zachowaniu, czyli dodaniu nowej linii
        this.sendMessage();
      }
    },
    async sendMessage() {
      if (this.newMessageText) {
        await this.$store.dispatch('sendMessages', {
          receiver: this.personId,
          text: this.newMessageText
        })
        this.conversation = this.$store.state.messages
      }
      console.log(this.newMessageText);
      this.newMessageText = '';
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.shouldAnimate) {
          this.animateScroll(); // jeśli shouldAnimate jest true, użyj animacji
          this.shouldAnimate = false; // zresetuj flagę
        } else {
          this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
        }
      });
    },
    animateScroll() {
      const container = this.$refs.messagesContainer;
      const targetScrollTop = container.scrollHeight;
      const duration = 1500;
      const startPosition = container.scrollTop;
      let startTime = null;

      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        container.scrollTop = startPosition + (targetScrollTop - startPosition) * progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);

    },
    clearAllIntervals() {
      for (let i = 0; i < this.$store.state.intervalIds.length; i++) {
        clearInterval(this.$store.state.intervalIds[i]);
      }
      // Opróżnienie listy po zatrzymaniu wszystkich interwałów
      this.$store.state.intervalIds = [];
    },
  },
  created() {
    this.getPeople();
    this.getPeopleInbox();
    this.getPerson();
    this.getMessage();
    let intervalId = setInterval(this.getMessage, this.chatPollingInterval);
    this.$store.state.intervalIds.push(intervalId)
  },
  beforeRouteLeave(to, from, next) {
    this.clearAllIntervals();
    next();
  },
}
</script>

<style scoped>


.chat {
  margin-top: auto;
  margin-bottom: auto;
}

.card {
  height: 500px;
  border-radius: 15px !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
}

.contacts_body {
  padding: 0.75rem 0 !important;
  overflow-y: auto;
  white-space: nowrap;
}

.msg_card_body {
  overflow-y: auto;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
  border-bottom: 0 !important;
}

.card-footer {
  border-radius: 0 0 15px 15px !important;
  border-top: 0 !important;
}

.container {
  align-content: center;
}

.search {
  border-radius: 15px 0 0 15px !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
}

.search:focus {
  box-shadow: none !important;
  outline: 0px !important;
}

.type_msg {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  height: 60px !important;
  overflow-y: auto;
}

.type_msg:focus {
  box-shadow: none !important;
  outline: 0px !important;
}

.attach_btn {
  border-radius: 15px 0 0 15px !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  cursor: pointer;
}

.send_btn {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  cursor: pointer;
}

.search_btn {
  border-radius: 0 15px 15px 0 !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  cursor: pointer;
}

.contacts {
  list-style: none;
  padding: 0;
}

.contacts li {
  width: 100% !important;
  padding: 5px 10px;
  margin-bottom: 15px !important;
}

.contacts > li:hover {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.active {
  background-color: rgba(0, 0, 0, 0.3) !important;
}

.user_img {
  height: 60px;
  width: 60px;
  border: 1.5px solid #f5f6fa;
}

.user_img_msg {
  height: 40px;
  width: 40px;
  border: 1.5px solid #f5f6fa;
}

.img_cont {
  position: relative;
  height: 70px;
  width: 70px;
}

.img_cont_msg {
  height: 40px;
  width: 40px;
}

.online_icon {
  position: absolute;
  height: 15px;
  width: 15px;
  background-color: #4cd137;
  border-radius: 50%;
  bottom: 13px;
  right: 13px;
  border: 1.5px solid white;
}

.offline {
  background-color: #c23616 !important;
}

.user_info {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 15px;
}

.user_info span {
  font-size: 20px;
  color: white;
}

.user_info p {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.msg_cotainer {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
  border-radius: 25px;
  background-color: #82ccdd;
  padding: 10px;
  position: relative;
  white-space: pre-wrap;
}

.msg_cotainer_send {
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 10px;
  border-radius: 25px;
  background-color: #78e08f;
  padding: 10px;
  position: relative;
  white-space: pre-wrap;
}

.msg_time {
  min-width: 100px;
  position: absolute;
  left: 0;
  bottom: -15px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
}

.msg_time_send {
  min-width: 100px;
  position: absolute;
  right: 0;
  bottom: -15px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
}

.msg_head {
  position: relative;
}

#action_menu_btn {
  position: absolute;
  right: 10px;
  top: 10px;
  color: white;
  cursor: pointer;
  font-size: 20px;
}

.action_menu {
  z-index: 1;
  position: absolute;
  padding: 15px 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 15px;
  top: 30px;
  right: 15px;
}

.action_menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.action_menu ul li {
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 5px;
}

.action_menu ul li i {
  padding-right: 10px;
}

.action_menu ul li:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
}


/* width */

::-webkit-scrollbar {
  width: 10px;
}


/* Track */

::-webkit-scrollbar-track {
  background: #f1f1f1;
}


/* Handle */

::-webkit-scrollbar-thumb {
  background: #888;
}


/* Handle on hover */

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

@media (max-width: 576px) {
  .contacts_card {
    margin-bottom: 15px !important;
  }
}
</style>
