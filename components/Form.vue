<template>
  <div class="checkout-step checkout-billing">
    <!-- <h3>Billing information</h3> -->

    <form @submit.prevent="submitbilling" class="field-wrap" >

      <h3 class="field-full">Billing information</h3>

      <div class="field">
        <label for="firstName" class="required">First name</label>
        <input type="text"
           v-model="formData.firstName"
           pattern="[a-zA-Z]*"
           id="firstName"
           placeholder="ex.Doe"
           minlength="2"
           maxlength="30"
           required />
      </div>

      <div class="field">
        <label for="lastName" class="required">Last name</label>
        <input type="text"
          v-model="formData.lastName"
          pattern="[a-zA-Z]*"
          id="lastName"
          placeholder="ex.Doe"
          minlength="2"
          maxlength="30"
          required />
      </div>

      <div class="field">
        <label for="email" class="required">Email address</label>
        <input type="email"
          v-model="formData.email"
          id="email"
          placeholder="ex.email@gmail.com"
          required />
      </div>

      <FieldPhone class="field field-group" />

      <h3 class="field-full">Payment information</h3>

      <div class="field">
        <label for="cardNumber">Card number</label>
        <input type="text"
          v-model="cardNumber"
          id="cardNumber"
          minlength="18"
          maxlength="19"
          @input="cardNumberInput"
          placeholder="0000 0000 0000 0000"
          inputmode="numeric"
          required />
      </div>

      <div class="field field-group">
        <div class="field field-third">
          <label for="cardMonth">Card month</label>
          <input type="number"
            v-model="cardMonth"
            id="cardMonth"
            min="1"
            max="12"
            minlength="2"
            maxlength="2"
            placeholder="MM"
            autocomplete="off"
            required />
        </div>
        <div class="field field-third">
          <label for="cardYear">Card year</label>
          <input type="number"
            v-model="cardYear"
            id="cardYear"
            :min="new Date().getFullYear()"
            :max="new Date().getFullYear() + 10"
            minlength="4"
            maxlength="4"
            placeholder="YYYY"
            autocomplete="off"
            required />
        </div>
        <div class="field field-third">
          <label for="cardSecurityCode">CVV</label>
          <input type="text"
            v-model="cardSecurityCode"
            minlength="3"
            maxlength="4"
            placeholder="***"
            autocomplete="off"
            inputmode="numeric"
            required />
        </div>
      </div>

      <div class="field">
        <Button
          value="Secure Payment"
          type="submit" />
        <div class="error" v-if="error">{{ error }}</div>
      </div>

    </form>
  </div>
</template>
<script>
export default{
  data(){
    return{
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: 0
      },
      cardNumber: null,
      cardMonth: null,
      cardYear: null,
      cardSecurityCode: null
    }
  },
  computed: {
    error(){ return this.$store.getters['payment/getError'] },
  },
  methods: {
    cardNumberInput() {
      let arr = this.cardNumber.replace(/[^\dA-Z]/g, '').replace(/[\s]/g, '').split('');
      if (arr.length > 4) arr.splice(4, 0, ' ');
      if (arr.length > 9) arr.splice(9, 0, ' ');
      if (arr.length > 14) arr.splice(14, 0, ' ');
      this.cardNumber = arr.toString().replace(/[,]/g, '');
    },
    submitbilling(e){
      e.preventDefault()
      this.$store.dispatch("billing/requestBilling", this.formData)
      localStorage.billing = JSON.stringify(this.formData)
      const data = {
        cardNumber: this.cardNumber.replace(/[^\dA-Z]/g, '').replace(/[\s]/g, ''),
        cardMonth: this.cardMonth,
        cardYear: this.cardYear,
        cardSecurityCode: this.cardSecurityCode,
      }
      this.$store.commit('payment/setCardData', data)
      localStorage.payment = JSON.stringify(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.error{
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  font-weight: 400;
  font-size: 14px;
  line-height: 120%;
  color: #D50000;
  padding-top: 4px;
}
</style>