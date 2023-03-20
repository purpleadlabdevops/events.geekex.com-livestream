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
        return campaign.products
      })
      .then(products =>{
        products.forEach(product => {
          if(product.campaignProductId == this.state.campaign.pid){
            this.commit('global/setPrice', product.price)
            commit('setProduct', product)
          }
        })
      })
      .catch(err => {
        console.log('err');
        console.dir(err)
      })
  }

}

export const getters = {
  getCampaignId: state => state.campaignId ? state.campaignId : localStorage.campaignId,
  getCampaign: state => state.campaign,
  getPid: state => state.pid,
  getProduct: state => state.product,
}
