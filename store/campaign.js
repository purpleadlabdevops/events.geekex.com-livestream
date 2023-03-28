const api = process.env.API

const crypto = require('crypto')
const algorithm = process.env.crypto_algorithm
const secretKey = process.env.crypto_secretKey
const decrypt = hash => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])
  return decrpyted.toString()
}

export const state = () => ({
  pid: null,
  product: 0,
  campaignId: null,
  campaign: null
})

export const mutations = {
  setCampaignId(state, campaignId){
    state.campaignId = campaignId
    localStorage.campaignId = campaignId
  },
  setCampaign(state, campaign){
    state.campaign = campaign
  },
  setPid(state, id){
    state.pid = id
  },
  setProduct(state, obj){
    state.product = obj
  },
}

export const actions = {
  requestCrypto({commit, state, dispatch, getters}, id){
    this.commit('global/setLoader', true)
    let price = null
    this.$axios.post(`${api}/konnektive/crypto?endpoint=/campaign/query`, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: { campaignId: id }
    })
      .then(response => {
        const result = JSON.parse(decrypt(response.data))
        const campaign = result.message.data[id]
        commit('setCampaign', campaign)
        return dispatch('dynamicPrice', {id, pid: this.state.campaign.pid})
      })
      .then(schedulePrice =>{
        console.log(schedulePrice)
        const products = getters.getCampaign.products
        products.forEach(product => {
          if(product.campaignProductId == this.state.campaign.pid){
            this.commit('global/setPrice', schedulePrice || product.price)
            commit('setProduct', product)
          }
        })
      })
      .catch(err => {
        console.log('err');
        console.dir(err)
      })
      .finally(() => {
        this.commit('global/setLoader', false)
      })
  },
  dynamicPrice(state, {id, pid}){

    return fetch('/sp&dl.json').then(res=>res.json()).then(data=>{

      const pricesSchedule = data[id]?.[pid]
      if(!pricesSchedule) return false

      const getTimeFormat = (pare)=>{
        const dateInArray = pare[1].split('.')
        const timeInArray = pare[0].split(':')
        return new Date(+dateInArray[2],+dateInArray[1] - 1, +dateInArray[0], timeInArray[0], timeInArray[1], timeInArray[2]).getTime()
      }

      const today = Date.now()
      for(let key in pricesSchedule) {
        const start = getTimeFormat(pricesSchedule[key].start.split(', '))
        const end = getTimeFormat(pricesSchedule[key].end.split(', '))
        if (today >= start && today <= end) {
          return key
          break
        }
      }
      return false
    })
  }

}

export const getters = {
  getCampaignId: state => state.campaignId ? state.campaignId : localStorage.campaignId,
  getCampaign: state => state.campaign,
  getPid: state => state.pid,
  getProduct: state => state.product,
}
