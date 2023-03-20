<template>
  <form @submit="submit" class="coupon">
    <div class="field field-group">
      <label for="code">Discount code</label>
      <input type="text" id="code" v-model="code" placeholder="ex.XXXXXX" required>
      <input type="submit" value="Apply">
      <span class="msg msg-error" v-if="msg.error">Something goes wrong, check coupon code and try againe.</span>
      <span class="msg msg-success" v-if="msg.success">Success! Your discount was applied.</span>
    </div>
  </form>
</template>
<script>
export default {
  data(){
    return {
      code: null,
      msg: {
        error: false,
        success: false
      }
    }
  },
  computed: {
    coupons(){ return this.$store.getters['campaign/getCampaign'].coupons },
    paySource(){ return this.$store.getters['campaign/getPaySource'] },
    discountRules(){ return this.$store.getters['campaign/getDiscountRules'] },
  },
  methods: {
    msgSet(action){
      this.msg[action] = true
      setTimeout(()=>{
        this.msg[action] = false
      }, 4000)
    },
    submit(e){
      e.preventDefault()

      const coupon = this.coupons.find(coupon => coupon.couponCode === this.code)

      if(coupon){
        this.$store.commit('global/setDiscount', coupon.discountPerc)
        this.$store.commit('global/setCouponCode', coupon.couponCode)
        this.msgSet('success')
        if(coupon.rules.length > 0){
          this.$store.commit('global/setDiscountRules', true)
        }
        if(coupon.discountPerc == 1 && this.paySource === "pp"){
          alert('If you use a 100% discount you should use a Credit Card payment source.')
          this.$store.commit('global/setStep', 2)
        }
      } else {
        this.msgSet('error')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.coupon{
  width: 100%;
  border-bottom: 1px solid #73583e;
  // display: flex;
  padding: 0 0 30px;
  flex-wrap: wrap;
  position: relative;
  input{
    &:focus, &:active{
      outline: none;
      border-radius: 4px 0 0 4px;
    }
    &[type="text"]{
      width: calc(100% - 100px);
    }
    &[type="submit"]{
      width: 100px;
      background: #73583e;
      color: #fff;
      padding: 0;
      border: none;
      cursor: pointer;
      text-transform: uppercase;
      transition: .5s ease;
      &:hover{
        box-shadow: 0 0 10px #000 inset;
      }
    }
  }
  .msg{
    position: absolute;
    left: 0;
    top: 50px;
    width: 100%;
    font-weight: 400;
    font-size: 14px;
    line-height: 120%;
    &-error{color: #D50000}
    &-success{color: #5CB85C}
  }
}
</style>