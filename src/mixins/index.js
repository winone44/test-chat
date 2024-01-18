export default {
    methods: {
        localT(key) {
            const componentName = this.$options.name; // Nazwa komponentu
            return this.$t(`${componentName}.${key}`);
        },
        CDN(path) {
            return process.env.VUE_APP_CDN_URL + path;
        },
        profilePictureCDN(profilePicture) {
            if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
                // Jeśli zmienna profile_picture zawiera pełny URL
                return profilePicture;
            } else {
                // Jeśli zmienna profile_picture zawiera tylko nazwę pliku
                return this.CDN('/media/photos/') + profilePicture;
            }
        },
        logoIconCDN(logoIcon) {
            if (logoIcon.startsWith('http://') || logoIcon.startsWith('https://')) {
                // Jeśli zmienna profile_picture zawiera pełny URL
                return logoIcon;
            } else {
                // Jeśli zmienna profile_picture zawiera tylko nazwę pliku
                return this.CDN('/media/photos/' + logoIcon);
            }
        },
    }
};