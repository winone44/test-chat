<template>
  <div>
    <b-button
        :disabled="closest.length === 0"
        v-b-popover.hover.top="'Wyślij wiadomość do wszystkich'"
        v-b-modal.modal-prevent-closing
        size="sm"
        variant="primary"
    >
      <b-icon icon="envelope"/>
    </b-button>

    <b-modal
        id="modal-prevent-closing"
        ref="modal"
        title="Wyślij wiadomości do podgrupy"
        @show="resetModal"
        @hidden="resetModal"
        @ok.prevent="sendMessage"
    >
      <form ref="form" @submit.stop.prevent="sendMessage">
        <b-form-group
            label="Treść wiadomości"
            label-for="name-input"
        >
          <b-form-input
              id="name-input"
              v-model="newGroupMessage"
              required
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox
              id="checkbox-others"
              v-model="isPeopleListIncluded"
              name="checkbox-others"
          >
            Dodaj listę osób do wiadomości
          </b-form-checkbox>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>

export default {
  name: "ButtonGroupMessageModalComponent",
  props: {
    closest: [Array]
  },
  data() {
    return {
      isPeopleListIncluded: false,
      newGroupMessage: null,
    }
  },

  methods: {
    resetModal() {
      this.newGroupMessage = ''
    },
    async sendMessage() {
      if (this.newGroupMessage) {
        this.$store.state.waitForCreateSuccess = true;
        let prepareGroupMessage = '';

        if (this.isPeopleListIncluded) {
          let attendees = [];
          let separator = '\n-------------------------------\n';
          for (const person of this.closest) {
            attendees.push(person.name);
          }
          prepareGroupMessage = `Wiadomość grupowa:${separator}Do:${attendees.join(', ')}${separator}${this.newGroupMessage}`;
        }

        for (const person of this.closest) {
          await this.$store.dispatch('sendMessages', {
            receiver: person.id,
            text: prepareGroupMessage
          })
        }
      }
      console.log(this.newMessageText);
      this.newMessageText = '';
    },
  }
}

</script>


<style scoped>

</style>