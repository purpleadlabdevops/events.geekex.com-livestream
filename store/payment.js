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
  actionThankyou({commit, state, dispatch}, orderId){
    commit('setThankyou', true)
    EF.conversion({
      offer_id: EF.urlParameter('ef_oid'),
      amount: localStorage.total
    })
      .then(res => {
        console.log('EF.conversion '+localStorage.total);
        console.dir(res)
      })
    if(orderId) {
      this.$axios.post(`${process.env.API}/konnektive?endpoint=/order/confirm`, {
        headers: {'Content-Type': 'application/json'},
        params: {orderId: orderId}
      })
      .then(() => {
        setTimeout(()=> window.location.href = 'https://geekex.com', 3000);
      })
    } else {
      setTimeout(()=> window.location.href = 'https://geekex.com', 3000);
    }
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

    this.$axios.post(`${process.env.API}/konnektive?endpoint=/order/import`, {
      headers: {'Content-Type': 'application/json'},
      params: ccImportData
    })
      .then(response => {
        if(response.data.result === "SUCCESS"){
          this.$axios.post(`${process.env.API}/konnektive?endpoint=/order/confirm`, {
            headers: {'Content-Type': 'application/json'},
            params: {orderId: localStorage.orderId}
          })
            if(this.state.campaign.product.descriptor !== "livestream_nothing_else") {
              dispatch('addSubscriber')
            } else {
              dispatch('actionThankyou')
            }
        } else if(response.data.result === "ERROR"){
          throw response.data.message
        } else {
          console.dir('importCC response else');
          throw response.data.message
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
  addSubscriber({commit, state, dispatch}){
    this.commit('global/setLoader', true)
    const sub = {
      campaignId: 10,
      product1_qty: 1,
      url: localStorage.httpReferer ? localStorage.httpReferer : window.location.href
    }
    const product = this.state.campaign.product
    sub.product1_id = product.baseProductName === 'livestream' ? 81 : 82
    const billing = this.state.billing.data
    const payment = state.data
    const country = this.state.global.countries[billing.country].iso
    const phone = billing.phone.replace(/[^\dA-Z]/g, '').replace(/[\s]/g, '')
    this.$axios.post(`${process.env.API}/konnektive?endpoint=/landers/clicks/import`, {
      headers: {'Content-Type': 'application/json'},
      params: {
        campaignId: sub.campaignId,
        pageType: "checkoutPage",
        requestUri: sub.url,
        httpReferer: sub.url
      }
    })
      .then(lander => {
        if(lander.data.result === 'SUCCESS') {
          sub.sessionId = lander.data.message.sessionId
          const dataLeads = {
            campaignId: sub.campaignId,
            pageType: 'leadPage',
            billShipSame: 1,
            firstName: billing.firstName,
            lastName: billing.lastName,
            emailAddress: billing.email,
            phoneNumber: phone,
            address1: 'undefined',
            city: 'test',
            country: country,
            postalCode: '90210',
            state: 'test',
            sessionId: lander.data.message.sessionId
          }
          if(localStorage.affId)        dataLeads.affId   = localStorage.affId
          if(localStorage.utm_source)   dataLeads.custom1 = localStorage.utm_source
          if(localStorage.utm_medium)   dataLeads.custom2 = localStorage.utm_medium
          if(localStorage.utm_campaign) dataLeads.custom3 = localStorage.utm_campaign
          if(localStorage.utm_content)  dataLeads.custom4 = localStorage.utm_content
          if(localStorage.utm_term)     dataLeads.custom5 = localStorage.utm_term
          return this.$axios.post(`${process.env.API}/konnektive?endpoint=/leads/import`, { params: dataLeads })
        } else if(lander.data.result === "ERROR"){
          throw lander.data.message
        }
      })
      .then(lead => {
        sub.orderId = lead.data.message.orderId
        const subImportData = {
          orderId: sub.orderId,
          sessionId: sub.sessionId,
          campaignId: sub.campaignId,
          cardNumber: payment.cardNumber,
          cardMonth: payment.cardMonth,
          cardYear: payment.cardYear,
          cardSecurityCode: payment.cardSecurityCode,
          paySource: 'CREDITCARD',
          product1_id: sub.product1_id,
          product1_qty: sub.product1_qty,
          httpReferer: sub.url
        }
        if(this.state.global.couponCode) subImportData.couponCode = this.state.global.couponCode
        return this.$axios.post(`${process.env.API}/konnektive?endpoint=/order/import`, { params: subImportData })
      })
      .then(response => {
        if(response.data.result === "SUCCESS"){
          dispatch('actionThankyou', sub.orderId)
        } else if(response.data.result === "ERROR"){
          console.log('subscription ERROR');
          throw response.data.message
        } else {
          console.log('subscription ELSE');
          throw response.data.message
        }
      })
      .catch(err => {
        console.dir(err);
        dispatch('showError', err)
      })
      .finally(() => {
        this.commit('global/setLoader', false)
      })
  }
}

export const getters = {
  getCardData: state => state.data,
  getError: state => state.error,
  getThankyou: state => state.thankyou,
  getSubscription: state => state.subscription,
  getData: state => state.data,
}
