import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router";
import qs from "qs";
import axios from "axios";

Vue.use(Vuex)

const API_URL = "http://127.0.0.1:8000/api/";

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
});

async function onRequestFailure(error, store) {
    const { config } = error;
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
            if(router.currentRoute.name !== 'LoginView') {
                router.push({ name: 'LoginView' });
            }
        }
    }
    return Promise.reject(error);
}

const store = new Vuex.Store({
    state: {
        accessToken: null,
        refreshToken: null,
        userId: null,
        username: null,
        profilePicture: '',

        messages: null,
        person: null,
        groupMembers: null,
        people: [],
        backendSerwerResponse: null,
        data: {
            people: [
                {
                    id: '23',
                    username: 'Khalid Charif',
                    distance: '348m',
                    avatarUrl: 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'
                },
                {
                    id: '34',
                    username: 'Chaymae Naim',
                    distance: '548m',
                    avatarUrl: 'https://2.bp.blogspot.com/-8ytYF7cfPkQ/WkPe1-rtrcI/AAAAAAAAGqU/FGfTDVgkcIwmOTtjLka51vineFBExJuSACLcBGAs/s320/31.jpg'
                },
                {
                    id: '3',
                    username: 'Sami Rafi',
                    distance: '1388m',
                    avatarUrl: 'https://i.pinimg.com/originals/ac/b9/90/acb990190ca1ddbb9b20db303375bb58.jpg'
                },
                {
                    id: '21',
                    username: 'Hassan Agmirf',
                    distance: '2228m',
                    avatarUrl: 'https://avatars.hsoubcdn.com/ed57f9e6329993084a436b89498b6088?s=256'
                },
                {
                    id: '8',
                    username: 'Abdou Chatabi',
                    distance: '2848m',
                    avatarUrl: 'https://static.turbosquid.com/Preview/001214/650/2V/boy-cartoon-3D-model_D.jpg'
                },
            ],
            messages: [
                {
                    id: '1',
                    created_at: '2023-06-08T13:47:19.112807Z',
                    receiver: {
                        id: '1',
                        username: 'Hassan Agmir',
                        userImg: 'https://avatars.hsoubcdn.com/ed57f9e6329993084a436b89498b6088?s=256'
                    },
                    sender: {
                        id: '2',
                        username: 'Khalid Charif',
                        userImg: 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'
                    },
                    text: 'Hi, how are you samim?'
                },
                {
                    id: '2',
                    created_at: '2023-06-08T13:47:19.112807Z',
                    receiver: {
                        id: '2',
                        username: 'Khalid Charif',
                        userImg: 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'
                    },
                    sender: {
                        id: '1',
                        username: 'Hassan Agmir',
                        userImg: 'https://avatars.hsoubcdn.com/ed57f9e6329993084a436b89498b6088?s=256'
                    },
                    text: 'Hi Khalid i am good tnx how about you?'
                },
                {
                    id: '3',
                    created_at: '2023-06-08T13:47:19.112807Z',
                    receiver: {
                        id: '1',
                        username: 'Hassan Agmir',
                        userImg: 'https://avatars.hsoubcdn.com/ed57f9e6329993084a436b89498b6088?s=256'
                    },
                    sender: {
                        id: '2',
                        username: 'Khalid Charif',
                        userImg: 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'
                    },
                    text: 'I am good too, thank you for your chat template'
                },
                {
                    id: '4',
                    created_at: '2023-06-08T13:47:19.112807Z',
                    receiver: {
                        id: '2',
                        username: 'Khalid Charif',
                        userImg: 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'
                    },
                    sender: {
                        id: '1',
                        username: 'Hassan Agmir',
                        userImg: 'https://avatars.hsoubcdn.com/ed57f9e6329993084a436b89498b6088?s=256'
                    },
                    text: 'You are welcome'
                },
                {
                    id: '5',
                    created_at: '2023-06-08T13:47:19.112807Z',
                    receiver: {
                        id: '1',
                        username: 'Hassan Agmir',
                        userImg: 'https://avatars.hsoubcdn.com/ed57f9e6329993084a436b89498b6088?s=256'
                    },
                    sender: {
                        id: '2',
                        username: 'Khalid Charif',
                        userImg: 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'
                    },
                    text: 'I am looking for your next templates'
                },
                {
                    id: '6',
                    created_at: '2023-06-08T13:47:19.112807Z',
                    receiver: {
                        id: '2',
                        username: 'Khalid Charif',
                        userImg: 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'
                    },
                    sender: {
                        id: '1',
                        username: 'Hassan Agmir',
                        userImg: 'https://avatars.hsoubcdn.com/ed57f9e6329993084a436b89498b6088?s=256'
                    },
                    text: 'Ok, thank you have a good day'
                },
                {
                    id: '7',
                    created_at: '2023-06-08T13:47:19.112807Z',
                    receiver: {
                        id: '1',
                        username: 'Hassan Agmir',
                        userImg: 'https://avatars.hsoubcdn.com/ed57f9e6329993084a436b89498b6088?s=256'
                    },
                    sender: {
                        id: '2',
                        username: 'Khalid Charif',
                        userImg: 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'
                    },
                    text: 'Bye, see you'
                },
            ]
        }
    },
    getters: {
        isAuth: state => {
            return state.accessToken !== null && state.accessToken !== undefined
        },
        nearestUser: state => {
            console.log(state.people)
            return state.people.length === 0 ? 1 : state.people[0].id
        }
    },
    mutations: {
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
        setBackendSerwerResponse(state, payload) {
            state.backendSerwerResponse =  payload;
        },
        setPerson(state, payload) {
            console.log(payload)
            state.person = payload;
        },
        setPeople(state, payload) {
            state.people = payload;
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
        }
    },
    actions: {
        async login({commit, dispatch}, payload) {
            try {
                console.log(payload);
                let response = await apiClient.post(`${API_URL}accounts/login`, qs.stringify(payload))
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
                if (e.response && e.response.status === 400) {
                    commit('setBackendSerwerResponse', {
                        response: e.response.data.msg
                    });
                }
                console.log(e)


            }
        },
        async refreshTokens({ state, commit }) {
            try {
                let response = await apiClient.post(`${API_URL}accounts/token-refresh/`, {
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
            if(router.currentRoute.name !== 'LoginView') {
                router.push({ name: 'LoginView' });
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
            },expirationDate.getTime() - now.getTime())
        },
        async register({commit}, payload) {
            try {
                let response = await apiClient.post(`${API_URL}accounts/register`, qs.stringify(payload))
                console.log(response);
                router.push({name: 'login'})

            } catch (e) {
                commit('setResponse', {
                    // response: e.response.data.error.message
                    response: e
                });
                console.log(e)
            }
        },
        async changePassword({commit}, payload) {
            try {
                let {data} = await apiClient.post(`${API_URL}change-password`, payload)
                console.log(data.msg);
                commit('setBackendSerwerResponse', data.msg)
            } catch (e) {
                console.log(e.response.data)
                if (e.response.data.current_password.current_password) {
                    commit('setBackendSerwerResponse', e.response.data.current_password.current_password)
                }

            }
        },
        async addFriend({state}, payload) {
            try {
                let {data} = await apiClient.post(`${API_URL}accounts/friend/`, payload)
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
                let {data} = await apiClient.get(`${API_URL}accounts/friend/` + payload.id + '/');
                console.log('zrobione')
                commit('setFriends', Object.values(data))
            } catch(e) {
                console.log(e)
            }
        },
        async delFriend({state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                await apiClient.delete(`${API_URL}accounts/friend/`, { data: payload });
            } catch(e) {
                console.log(e)
            }
        },
        async getPeople({commit, state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.get(`${API_URL}list_users_with_distance/` + payload.id + '/');
                commit('setPeople', Object.values(data))
            } catch(e) {
                console.log(e)
            }
        },
        async getPerson({commit, state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.get(`${API_URL}accounts/person/` + payload.id + '/');
                console.log(data)
                commit('setPerson', data)
            } catch(e) {
                console.log(e)
            }
        },
        async patchPersonDescription({commit, state}, {id, newData}) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.patch(`${API_URL}accounts/person/${id}/patch/`, newData);
                console.log(data)
                commit('setPerson', data)
            } catch(e) {
                console.log(e)
            }
        },
        async getMessages({commit, state}, payload) {
            if (state.userId == null) {
                return;
            }
            try {
                let {data} = await apiClient.get(`${API_URL}messages/`, {params: payload});
                console.log(data)
                commit('setMessages', Object.values(data))
            } catch(e) {
                console.log(e)
            }
        },
        async sendMessages({commit}, payload) {
            try {
                let {data} = await apiClient.post(`${API_URL}messages/`, payload)
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
                let {data} = await apiClient.get(`${API_URL}groups/${payload.id}/users/`);
                console.log(data)
                commit('setGroupMembers', data)
            } catch(e) {
                console.log(e)
            }
        },
    },
    modules: {}
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => onRequestFailure(error, store)
);

export default store;