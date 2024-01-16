import Vue from "vue";

Vue.filter("formatDateMessages", function (value) {
    const now = new Date();
    const inputDate = new Date(value);

    const diffInSeconds = Math.floor((now - inputDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInSeconds < 60) {
        return 'teraz';
    }

    if (diffInMinutes >= 1 && diffInMinutes <= 59) {
        return `${diffInMinutes}min`;
    }

    if (diffInHours >= 1 && diffInHours <= 24) {
        return `${diffInHours}godz`;
    }

    if (diffInHours >= 25 && diffInHours <= 48) {
        return `wczoraj, ${inputDate.toTimeString().split(" ")[0]}`;
    }

    if (diffInHours >= 49 && diffInHours <= 72) {
        return `przedwczoraj, ${inputDate.toTimeString().split(" ")[0]}`;
    }

    return inputDate.toISOString().split("T")[0] + " " + inputDate.toTimeString().split(" ")[0];
});

Vue.filter("formatDistance", function (distanceInKilometers) {
    if (distanceInKilometers > 1) {
        return `${distanceInKilometers}km`;
    } else {
        return `poniżej 1 km`;
    }
})

Vue.filter("normalizeUrl", function (url) {
    // Usuwa protokół (http://, https://)
    let stripped = url.replace(/(^\w+:|^)\/\//, '');
    // Usuwa ścieżki po domenie (wszystko po '/')
    stripped = stripped.split('/')[0];
    // Usuwa 'www.' jeśli istnieje
    return stripped.replace('www.', '');
})

Vue.filter('declineUser', function (number) {
    if (number === 1) {
        return `Grupa ma ${number} użytkownika`;
    } else {
        return `Grupa ma ${number} użytkowników`;
    }
})

Vue.filter('formatDateAlerts', function (inputDate) {
    const dateObj = new Date(inputDate);

    // Format the date depending on the year
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    if (year === 2024) {
        return `${hours}:${minutes} ${day}.${month}`;
    } else {
        return `${hours}:${minutes} ${day}.${month}.${year}`;
    }
})
