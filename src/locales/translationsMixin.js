export default {
    methods: {
        localT(key) {
            const componentName = this.$options.name; // Nazwa komponentu
            return this.$t(`${componentName}.${key}`);
        }
    }
};