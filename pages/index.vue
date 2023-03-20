<template>
  <main>
    <section class="checkout">
      <div class="checkout-steps">
        <div class="checkout-steps--inner">
          <Logo class="checkout-logo--desc" title="GeekEx logo" />
          <Form />
        </div>
      </div>
      <div class="checkout-sidebar">
        <Logo class="checkout-logo--mob" title="GeekEx logo" />
        <h2>YOUR ORDER</h2>
        <!-- <Cart v-if="product" :data="product" /> -->
        <Coupon  v-if="product" />
        <Total  v-if="product" :data="product" />
      </div>
    </section>
    <Loader v-if="loader" />
    <Covid v-if="covid" />
    <Thankyou v-if="thankyou" />
  </main>
</template>
<script>
export default {
  head() {
    return {
      script: [
        {
          ssr: false,
          defer: true,
          hid: 'everflow',
          src: 'https://www.bls29trk.com/scripts/sdk/everflow.js',
          callback: () => {
            EF.click({
              offer_id: EF.urlParameter('ef_oid'),
              affiliate_id: EF.urlParameter('affid'),
              sub1: EF.urlParameter('sub1'),
              sub2: EF.urlParameter('sub2'),
              sub3: EF.urlParameter('sub3'),
              sub4: EF.urlParameter('sub4'),
              sub5: EF.urlParameter('sub5'),
              uid: EF.urlParameter('uid'),
              source_id: EF.urlParameter('source_id'),
              transaction_id: EF.urlParameter('_ef_transaction_id')
            })
              .then(res => {
                return EF.conversion({
                  offer_id: EF.urlParameter('ef_oid'),
                  event_id: EF.urlParameter('ef_pv')
                })
              })
              .then(res => {
                EF.conversion({
                  offer_id: EF.urlParameter('ef_oid'),
                  event_id: EF.urlParameter('ef_ic')
                })
              })
          }
        }
      ]
    }
  },
  computed: {
    covid(){ return this.$store.getters['global/getCovid'] },
    thankyou(){ return this.$store.getters['payment/getThankyou'] },
    step(){ return this.$store.getters['global/getStep'] },
    loader(){ return this.$store.getters['global/getLoader'] },
    campaign(){ return this.$store.getters['campaign/getCampaign'] },
    product(){ return this.$store.getters['campaign/getProduct'] },
  },
  beforeCreate(){
    if (this.$route.query.paypalAccept == '1' && localStorage.paypalConfirmed == 'false') {
      localStorage.paypalConfirmed = true;
      localStorage.token = this.$route.query.token;
      localStorage.payerId = this.$route.query.PayerID;
      this.$store.dispatch("payment/ppConfirm")
    } else if(this.$route.query.id && this.$route.query.pid){
      this.$store.dispatch("campaign/requestCrypto", this.$route.query.id)
      this.$store.commit('campaign/setCampaignId', this.$route.query.id)
      this.$store.commit('campaign/setPid', this.$route.query.pid)
    } else {
      alert('Visit our event page')
      window.location.href = "https://geekex.com/"
    }
    if(this.$route.query.affid) localStorage.affid = this.$route.query.affid
    if(this.$route.query.c1) localStorage.sourceValue1 = this.$route.query.c1
    if(this.$route.query.c2) localStorage.sourceValue2 = this.$route.query.c2
    if(this.$route.query.c3) localStorage.sourceValue3 = this.$route.query.c3
    if(this.$route.query.httpReferer) localStorage.httpReferer = this.$route.query.httpReferer
    if(this.$route.query.utm_source) localStorage.utm_source = this.$route.query.utm_source
    if(this.$route.query.utm_medium) localStorage.utm_medium = this.$route.query.utm_medium
    if(this.$route.query.utm_campaign) localStorage.utm_campaign = this.$route.query.utm_campaign
    if(this.$route.query.utm_content) localStorage.utm_content = this.$route.query.utm_content
    if(this.$route.query.utm_term) localStorage.utm_term = this.$route.query.utm_term
  }
}
</script>
<style lang="scss" scoped>
.checkout{
  @media(max-width:991px){
    display: flex;
    flex-direction: column;
  }
  @media(min-width:992px){
    display: grid;
    grid-template-columns: minmax(0,6fr) minmax(0,4fr);
  }
  &-steps{
    background: #fff;
    min-height: 100vh;
    color: #000;
    @media(max-width:991px){
      order: 2;
    }
    &--inner{
      padding: 20px 10px;
      @media(min-width:768px){
        padding: 20px 15px 30px;
      }
      @media(min-width:992px){
        max-width: 860px;
        margin-left: auto;
        padding: 20px 30px 30px;
      }
      @media(min-width:1200px){
        padding: 30px 50px 50px;
      }
    }
  }
  &-sidebar{
    padding: 20px 10px;
    @media(min-width:768px){
      padding: 25px 15px;
    }
    @media(min-width:992px){
      max-width: 574px;
      padding: 40px 30px;
    }
    @media(min-width:1200px){
      padding: 60px 50px;
    }
    h2{
      color: #5e4020;
      padding-bottom: 0.1em;
      border-bottom: 1px solid #73583e;
      margin-bottom: 24px;
      font-size: 18px;
      text-transform: uppercase;
    }
  }
}
</style>