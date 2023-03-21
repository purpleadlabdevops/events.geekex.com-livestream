const api = 'https://api.geekex.com'

export const state = () => ({
  error: false,
  data: []
})

export const mutations = {
  setBilling(state, data) {
    state.data = data
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  requestBilling({commit, state}, billingData){
    commit('setBilling', billingData)
    this.commit('global/setLoader', true)
    const phone = billingData.phone.replace(/[^\dA-Z]/g, '').replace(/[\s]/g, '')
    this.$axios.post(`${api}/konnektive?endpoint=/landers/clicks/import`, {
      headers: {'Content-Type': 'application/json'},
      params: {
        campaignId: localStorage.campaignId,
        pageType: "checkoutPage",
        requestUri: window.location.href,
        httpReferer: (localStorage.httpReferer) ? localStorage.httpReferer : window.location.href
      }
    })
      .then(lander => {
        if (lander.data.result === 'SUCCESS') {
          this.commit('global/setSessionId', lander.data.message.sessionId)
          const data = {
            campaignId: localStorage.campaignId,
            pageType: 'leadPage',
            billShipSame: 1,
            firstName: billingData.firstName,
            lastName: billingData.lastName,
            emailAddress: billingData.email,
            phoneNumber: phone,
            address1: 'undefined',
            city: 'test',
            country: this.state.global.countries[billingData.country].iso,
            postalCode: '90210',
            state: 'test',
            sessionId: lander.data.message.sessionId,
          }
          if(localStorage.affid)        data.affid   = localStorage.affid
          if(localStorage.utm_source)   data.custom1 = localStorage.utm_source
          if(localStorage.utm_medium)   data.custom2 = localStorage.utm_medium
          if(localStorage.utm_campaign) data.custom3 = localStorage.utm_campaign
          if(localStorage.utm_content)  data.custom4 = localStorage.utm_content
          if(localStorage.utm_term)     data.custom5 = localStorage.utm_term
          return this.$axios.post(`${api}/konnektive?endpoint=/leads/import`, { headers: {'Content-Type': 'application/json'}, params: data })
        } else if(lander.data.result === "ERROR"){
          throw lander.data.message
        }
      })
      .then(lead => {
        if (lead.data.result === 'SUCCESS') {
          this.commit('global/setOrderId', lead.data.message.orderId)
          this.commit('global/setStep', 3)
        } else if(lead.data.result === "ERROR"){
          throw lead.data.message
        }
      })
      .catch(err => {
        const keys = Object.keys(err)
        commit('setError', err[keys[0]])
        setTimeout(()=>{
          commit('setError', false)
        }, 3000);
      })
      .finally(() => {
        this.dispatch('payment/importCC')
        // this.commit('global/setLoader', false)
      })

  }
}

export const getters = {
  getError: state => state.error,
  getBilling: state => state.data
}
