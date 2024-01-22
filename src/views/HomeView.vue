<template>
  <div>
    <div class="section">
      <div class="text">
        <h2 class="fade-in-left">{{ localT('title') }}</h2>
        <h3 class="fade-in-left">{{ localT('subtitle') }}</h3>
        <p class="fade-in-up">{{ localT('description') }}</p>
        <div class="fade-in-up">
          <b-button variant="primary" :to="{ name: 'LoginView' }">{{ localT('loginButton') }}</b-button>
          <b-button class="ml-2" variant="outline-success" :to="{ name: 'RegisterView' }">{{ localT('registerButton') }}</b-button>
        </div>
      </div>

      <div class="video-container">
        <div class="color-overlay"></div>
        <video :src="CDN('/media/video/people_walking.mp4')" loop muted autoplay></video>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'HomeView'
}
</script>

<style scoped>
.fade-in-left {
  animation: fade-in-left 2s ease;
}
@keyframes fade-in-left {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}


.fade-in-up {
  animation: fade-in-up 2s ease;
}
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}


.section {
  position: relative;
  width: 100%;
  height: calc(100vh - 76px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 100px 100px 0;
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.color-overlay {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #0053ad;
  width: 100%;
  height: 100vh;
  opacity: 0.5;
  z-index: 1;
}

.text {
  position: relative;
  z-index: 10;
}

.text h2 {
  color: white;
  font-size: 5em;
  font-weight: 800;
  line-height: 1em;
  text-transform: uppercase;
}

.text h3 {
  color: white;
  font-size: 7em;
  font-weight: 700;
  line-height: 1em;
  text-transform: uppercase;
}

.text p {
  color: white;
  font-size: 1.1em;
  margin:  20px 0;
  font-weight: 400;
  max-width: 700px;
}

@media(max-width: 798px) {
  .section {
    padding: 100px 30px 30px;
  }

  .text h2 {
    font-size: 3em;
  }

  .text h3 {
    font-size: 4em;

  }

}

</style>
