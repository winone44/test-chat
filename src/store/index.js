import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router";
import qs from "qs";
import axios from "axios";
import { i18n } from '@/locales/i18n';

Vue.use(Vuex)

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    // baseURL: "https://pksimpleweb.pythonanywhere.com/api/",
    // baseURL: "http://127.0.0.1:8000/api/",
});

function onInternetConnectionError(store) {
    store.dispatch('showToast', {
        message: i18n.t('Toasts.connectError'),
        variant: 'danger'
    });
}

function onAuthorizationError(error, store) {
    const message = error.response.data.error;
    const variant = 'danger';
    store.dispatch('showToast', {message, variant});
}

async function onRequestFailure(error, store) {
    const {config} = error;

    if (error.response && error.response.status !== 401) {
        const message = error.response.data.error || i18n.t('Toasts.unexpectedError');
        const variant = 'warning';
        store.dispatch('showToast', {message, variant});
    }

    if (error.response.status === 401 && config && !config.__isRetryRequest) {
        // Jeśli odpowiedź to 401 Unauthorized, spróbuj odświeżyć tokeny
        try {
            await store.dispatch('refreshTokens');
            // Jeśli odświeżanie się powiedzie, spróbuj ponownie wykonać żądanie z nowym tokenem
            config.__isRetryRequest = true;
            // Aktualizuj token w konfiguracji żądania
            config.headers['Authorization'] = `Bearer ${store.state.accessToken}`;
            const response = apiClient(config);
            console.log(response);
            return response;
        } catch (refreshError) {
            // Jeśli odświeżanie się nie powiedzie, wyloguj użytkownika
            store.dispatch('logout');
            // Przekieruj do strony logowania lub innego komponentu
            if (router.currentRoute.name !== 'LoginView') {
                router.push({name: 'LoginView'});
            }
        }
    }
    return Promise.reject(error);
}

function onRequestSuccess(response, store) {
    if (response.status === 200 && response.data.message) {
        const message = response.data.message
        store.dispatch('showToast', {message, variant: 'success'});
    }
    if (response.status === 201 && store.state.waitForCreateSuccess) {
        const message = response.data.message || i18n.t('Toasts.save')
        store.dispatch('showToast', {message, variant: 'success'});
        store.state.waitForCreateSuccess = false;
    }
}

const store = new Vuex.Store({
    state: {
        locale: 'pl',

        accessToken: null,
        refreshToken: null,
        userId: null,
        username: null,
        profilePicture: '',

        messages: null,
        intervalIds: [],
        waitForCreateSuccess: false,

        person: null,
        groupMembers: null,
        newGrupInfo: null,
        groupInfoDetail: null,
        people: [],
        peopleInbox: [],
        backendSerwerResponse: null,
        data: {
            people: [],
            messages: []
        },
        groupAlerts: null,
    },
    getters: {
        isAuth: state => {
            return state.accessToken !== null && state.accessToken !== undefined
        },
        nearestUser: state => {
            console.log(state.people)
            if (state.people.length === 0) {
                return state.userId
            } else {
                return state.people[0].id
            }
        },
        profilePicture: state => {
            if (state.person === null || state.person.profile_picture === undefined) {
                return ''
            } else if (state.person.profile_picture.startsWith('http://') || state.person.profile_picture.startsWith('https://')) {
                // Jeśli zmienna profile_picture zawiera pełny URL
                return state.person.profile_picture;
            } else {
                // Jeśli zmienna profile_picture zawiera tylko nazwę pliku
                return '/media/photos/' + state.person.profile_picture;
            }
        },
        person: state => {
            if (state.person === null) {
                return {
                    online: false,
                    firstName: '',
                    lastName: '',
                    date_of_birth: null,
                    age: null,
                    email: null,
                    latitude: null,
                    longitude: null,
                    username: null,
                    gender: '',
                    groups: [
                        {
                            group_site_url: '',
                            id: 0,
                            logo_url: '',
                            name: 'Wczytywanie...',
                        }
                    ]
                }
            } else {
                return state.person;
            }
        },
    },
    mutations: {
        SET_LOCALE(state, newLocale) {
            state.locale = newLocale;
            console.log(newLocale)
            apiClient.defaults.headers.common['Accept-Language'] = `${newLocale}`;
        },
        auth(state, payload) {
            state.accessToken = payload.accessToken;
            state.refreshToken = payload.refreshToken;
            state.userId = payload.userId;
            state.username = payload.username;
            state.profilePicture = payload.profile_picture;

            console.log('accessToken')
            console.log(payload.accessToken)
            console.log('refreshToken')
            console.log(payload.refreshToken)
            if (payload.accessToken) {
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${payload.accessToken}`;
            } else {
                delete apiClient.defaults.headers.common['Authorization'];
            }
        },
        updateTokens(state, payload) {
            state.accessToken = payload.accessToken;

            console.log('accessToken')
            console.log(payload.accessToken)
            if (payload.accessToken) {
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${payload.accessToken}`;
            } else {
                delete apiClient.defaults.headers.common['Authorization'];
            }
        },
        clearAuth(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.userId = null;
            state.username = null;
            state.profilePicture = null;
            delete apiClient.defaults.headers.common['Authorization'];
        },
        setPerson(state, payload) {
            console.log(payload)
            state.person = payload;
        },
        setPeople(state, payload) {
            state.people = payload;
        },
        setPeopleInbox(state, payload) {
            state.peopleInbox = payload;
        },
        setMessages(state, payload) {
            state.messages = payload;
        },
        addMessages(state, payload) {
            console.log(payload)
            state.messages.push(payload);
        },
        setGroupMembers(state, payload) {
            console.log(payload)
            state.groupMembers = payload;
        },
        addGroupToUser(state, payload) {
            state.person.group.push(payload);
        },
        setNewGroupInfo(state, payload) {
            state.newGrupInfo = payload;
        },
        setGroupInfoDetail(state, payload) {
            state.groupInfoDetail = payload;
        },
        setGroupAlerts(state, payload){
            state.groupAlerts = payload
            // state.groupAlerts.count = payload.count;
            // state.groupAlerts.next = payload.next;
            // state.groupAlerts.previous = payload.previous;
            // state.groupAlerts.results.push(payload.results);
        }
    },
    actions: {
        changeLocale({commit}, newLocale) {
            localStorage.setItem('language', newLocale);
            commit('SET_LOCALE', newLocale);
            i18n.locale = newLocale;
        },
        setLastLocale({commit}) {
            const language = localStorage.getItem('language')
            if (language) {
                commit('SET_LOCALE', language);
                i18n.locale = language;
            }
        },
        async login({commit, dispatch}, payload) {
            try {
                console.log(payload);
                let response = await apiClient.post(`accounts/login`, qs.stringify(payload))
                if (response === undefined) return;
                console.log(response);
                console.log(response.data.localId);
                commit('auth', {
                    accessToken: response.data.access,
                    refreshToken: response.data.refresh,
                    userId: response.data.localId,
                    username: response.data.username,
                    profile_picture: response.data.profile_picture
                });


                const now = new Date();
                const endDate = new Date(now.getTime() + response.data.refresh_token_lifetime * 1000)
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
                localStorage.setItem('userId', response.data.localId);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('profile_picture', response.data.profile_picture);
                localStorage.setItem('expires', endDate);


                console.log(response.data.refresh_token_lifetime)

                setTimeout(() => {
                    dispatch('logout');
                }, response.data.refresh_token_lifetime * 1000)

            } catch (e) {
                console.log(e)
            }
        },
        async refreshTokens({state, commit}) {
            try {
                let response = await apiClient.post(`accounts/token-refresh/`, {
                    refresh: state.refreshToken,
                });
                commit('updateTokens', {
                    accessToken: response.data.access,
                });
                console.log('refreshTokens Action')
                console.log(response.data.access)
                localStorage.setItem('accessToken', response.data.access);
            } catch (error) {
                console.error(error);
                throw false;
            }


        },
        logout({commit}) {
            commit('clearAuth');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('expires');
            localStorage.removeItem('username');
            localStorage.removeItem('profile_picture');
            if (router.currentRoute.name !== 'LoginView') {
                router.push({name: 'LoginView'});
            }

        },
        autologin({commit, dispatch}) {
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')
            if (!accessToken) {
                return;
            }
            const username = localStorage.getItem('username')
            const userId = localStorage.getItem('userId')
            if (!userId) {
                return;
            }
            const profile_picture = localStorage.getItem('profile_picture')
            const expirationDate = new Date(localStorage.getItem('expires'));
            const now = new Date();
            if (now >= expirationDate) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('expires');
                localStorage.removeItem('username');
                localStorage.removeItem('profilePicture');
                return;
            }

            commit('auth', {
                accessToken,
                refreshToken,
                userId,
                username,
                profile_picture
            });
            console.log("Pozostało tyle sekund: ", expirationDate.getTime() - now.getTime())
            setTimeout(() => {
                dispatch('logout');
            }, expirationDate.getTime() - now.getTime())
        },
        async register({commit}, payload) {
            try {
                let response = await apiClient.post(`accounts/register`, qs.stringify(payload))
                console.log(response);


            } catch (e) {
                commit('setResponse', {
                    // response: e.response.data.error.message
                    response: e
                });
                console.log(e)
            }
        },
        async changePassword({state}, payload) {
            try {
                let {data} = await apiClient.post(`accounts/change-password`, payload)
                console.log(data.msg);
                console.log(state.userId)
            } catch (e) {
                console.log(e.response.data)
            }
        },
        async delAccount({state}) {
            if (state.userId == null) {
                return;
            }
            try {
                await apiClient.delete(`accounts/delete-account/`);
            } catch (e) {
                console.log(e)
            }
        },
        async addFriend({state}, payload) {
            try {
                let {data} = await apiClient.post(`accounts/friend/`, payload)
                console.log(data);
                console.log(state.userId);
            } catch (e) {
                console.log(e)
            }
        },
        async getFriends({commit, state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.get(`accounts/friend/` + payload.id + '/');
                console.log('zrobione')
                commit('setFriends', Object.values(data))
            } catch (e) {
                console.log(e)
            }
        },
        async delFriend({state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                await apiClient.delete(`accounts/friend/`, {data: payload});
            } catch (e) {
                console.log(e)
            }
        },
        async getPeople({commit, state}) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.get(`list_users_with_distance/`);
                commit('setPeople', Object.values(data))
            } catch (e) {
                console.log(e)
            }
        },
        async getPeopleInbox({commit, state}) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.get(`list_users_by_recent_message/`);
                commit('setPeopleInbox', Object.values(data))
                console.log(data)
            } catch (e) {
                console.log(e)
            }
        },
        async getPerson({commit, state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.get(`accounts/person/` + payload.id + '/');
                console.log(data)
                commit('setPerson', data)
            } catch (e) {
                console.log(e)
            }
        },
        async patchPersonDescription({commit, state}, {id, newData}) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.patch(`accounts/person/${id}/patch/`, newData);
                console.log(data)
                commit('setPerson', data)
            } catch (e) {
                console.log(e)
            }
        },
        async patchLocation({commit, state}, {id, newData}) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.patch(`accounts/person/${id}/patch/`, newData);
                console.log(data)
                commit('setPerson', data)
            } catch (e) {
                console.log(e)
            }
        },
        async getMessages({commit, state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.get(`messages/`, {params: payload});
                console.log(data)
                commit('setMessages', Object.values(data))
            } catch (e) {
                console.log(e)
            }
        },
        async sendMessages({commit}, payload) {
            try {
                let {data} = await apiClient.post(`messages/`, payload)
                console.log(data);
                commit('addMessages', data)
                //console.log(state.userId);
            } catch (e) {
                console.log(e)
            }
        },
        async getGroupMembers({commit, state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.get(`groups/${payload.id}/users/`);
                console.log(data)
                commit('setGroupMembers', data)
            } catch (e) {
                console.log(e)
            }
        },
        async addMemberToGroup({commit}, payload) {
            try {
                let {data} = await apiClient.post(`group/join/`, payload)
                console.log(data);
                commit('addGroupToUser', payload)
            } catch (e) {
                console.log(e)
            }
        },
        async addGroup({commit}, payload) {
            try {
                let {data} = await apiClient.post(`group/create/`, payload)
                console.log(data);
                commit('setNewGroupInfo', data)
            } catch (e) {
                console.log(e)
            }
        },
        async delMemberFromGroup({state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.delete(`group/leave/`, {data: payload});
                console.log(data)
            } catch (e) {
                console.log(e)
            }
        },
        async getGroupDetail({commit, state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.get(`groups/${payload.id}`);
                commit('setGroupInfoDetail', data)
                console.log(data)
            } catch (e) {
                console.log(e)
            }
        },
        async sendGrupAlert({state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.post(`groups/alerts/`, payload)
                console.log(data);
            } catch (e) {
                console.log(e)
            }
        },
        async getGrupAlert({commit}, payload) {
            try {
                let {data} = await apiClient.get(`groups/alerts/?page=${payload}`);
                commit('setGroupAlerts', data)
                console.log(data)
            } catch (e) {
                console.log(e)
            }
        },
        showToast({state}, {message, variant}) {
            this._vm.$bvToast.toast(message, {
                title: variant === 'success' ? i18n.t('Toasts.titleSuccess') : i18n.t('Toasts.titleError'),
                variant: variant,
                solid: true,
            });
            console.log('User ID: ' + state.userId + ' ' + message)
        }
    },
    modules: {}
})

apiClient.interceptors.response.use(
    (response) => {
        onRequestSuccess(response, store)
        return response
    },
    (error) => {
        if (!error.response) {
            //Gdy błąd nie ma error.response
            onInternetConnectionError(store)
        } else {
            if (error.response && error.response.status === 401 && !store.state.userId) {
                onAuthorizationError(error, store);
            } else {
                return onRequestFailure(error, store)
            }
        }

    }
);

export default store;