const api = 'https://api.geekex.com'

export const state = () => ({
  data: [],
  error: false,
  thankyou: false,
})

export const mutations = {
  setCardData(state, data) {
    state.data = data
  },
  setError(state, error) {
    state.error = error
  },
  setThankyou(state, thankyou) {
    state.thankyou = thankyou
  },
}

export const actions = {
  actionThankyou({commit, state, dispatch}){
    commit('setThankyou', true)
    EF.conversion({
      offer_id: EF.urlParameter('ef_oid'),
      amount: localStorage.total
    })
      .then(res => {
        console.log('EF.conversion '+localStorage.total);
        console.dir(res)
      })
    this.$axios.post(`${api}/konnektive?endpoint=/order/confirm`, {
      headers: {'Content-Type': 'application/json'},
      params: {orderId: localStorage.orderId}
    })
      .then(() => {
        window.location.href = 'https://geekex.com';
      })
  },
  showError({commit}, msg){
    commit('setError', msg)
    setTimeout(()=>{
      commit('setError', false)
    }, 5000);
  },
  importCC({commit, state, dispatch}, cardData){
    const ccImportData = {
      orderId: localStorage.orderId,
      sessionId: localStorage.sessionId,
      campaignId: localStorage.campaignId,
      cardNumber: state.data.cardNumber,
      cardMonth: state.data.cardMonth,
      cardYear: state.data.cardYear,
      cardSecurityCode: state.data.cardSecurityCode,
      paySource: 'CREDITCARD',
      product1_id: this.state.campaign.pid,
      httpReferer: localStorage.httpReferer ? localStorage.httpReferer : window.location.href,
      product1_price: this.state.global.price ? this.state.global.price : this.state.campaign.campaign.products[0].price
    }

    if(this.state.global.couponCode) ccImportData.couponCode = this.state.global.couponCode
    if(localStorage.affid) ccImportData.affid = localStorage.affid
    if(localStorage.sourceValue1) ccImportData.sourceValue1 = localStorage.sourceValue1
    if(localStorage.sourceValue2) ccImportData.sourceValue2 = localStorage.sourceValue2
    if(localStorage.sourceValue3) ccImportData.sourceValue3 = localStorage.sourceValue3

    this.$axios.post(`${api}/konnektive?endpoint=/order/import`, {
      headers: {'Content-Type': 'application/json'},
      params: ccImportData
    })
      .then(response => {
        console.log('response');
        console.dir(response)
        if(response.data.result === "SUCCESS"){
          dispatch('actionThankyou')
        } else if(response.data.result === "ERROR"){
          dispatch('showError', response.data.message)
          alert(response.data.message)
        } else {
          console.dir('importCC response else');
          console.dir(response);
        }
      })
      .catch(err => {
        console.log('err');
        dispatch('showError', err)
      })
      .finally(() => {
        this.commit('global/setLoader', false)
      })
  },
}

export const getters = {
  getCardData: state => state.data,
  getError: state => state.error,
  getThankyou: state => state.thankyou,
  getSubscription: state => state.subscription,
}
