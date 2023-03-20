<template>
  <div class="field">
    <div class="country">
      <label class="required">Country code</label>
      <div class="country-code" id="countryButton" @click="openCountries">
        <img width="30" :src="countries[$parent.formData.country].flag" alt="">
        {{ countries[$parent.formData.country].code }}
      </div>
      <div class="country-list" ref="countryList">
        <button
          type="button"
          v-for="(item, i) in countries"
          :key="item.iso"
          @click="chooseCountry(i)"
          :title="item.name" >
          <span>{{ item.iso }}</span>
          {{ item.code }}
        </button>
      </div>
    </div>
    <div class="phone">
      <label for="phone" class="required">Phone Number</label>
      <input type="tel"
        v-model="$parent.formData.phone"
        @input="phoneInput"
        id="phone"
        :placeholder="countries[$parent.formData.country].mask"
        :minlength="countries[$parent.formData.country].mask.length"
        :maxlength="countries[$parent.formData.country].mask.length"
        autocomplete="off"
        required />
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    countries(){ return this.$store.getters['global/getCountries'] },
  },
  methods: {
    openCountries(e){
      e.preventDefault()
      this.$refs.countryList.classList.toggle('active')
    },
    chooseCountry(index){
      this.$parent.formData.country = index
      this.$refs.countryList.classList.remove('active')
    },
    phoneInput(e){
      const phoneNumber = this.$parent.formData.phone.replace(/[^\dA-Z]/g, '').replace(/[\s]/g, '').split('')
      const mask = this.countries[this.$parent.formData.country].mask.split('')
      phoneNumber.forEach(l => {
        if(mask.some((m,i) => m === '#')){
          const index = mask.findIndex((m,i) => m === '#')
          mask[index] = l
        }
      })

      let i = 0, newNumber = ''
      do {
        if(mask[i] !== '#'){
          newNumber += mask[i]
        } else {
          break;
        }
        i = i + 1;
      } while (i < mask.length)

      this.$parent.formData.phone = newNumber
    },
  }
}
</script>
<style lang="scss" scoped>
.phone{
  position: relative;
}
.country{
  position: relative;
  &-code{
    width: 90px;
    height: 48px;
    border: 1px solid #767676;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 8px 8px;
    font-size: 16px;
    color: #000;
    cursor: pointer;
    img{
      display: block;
      width: 30px;
      height: auto;
      border: 1px solid #767676;
    }
    *{
      pointer-events: none;
    }
  }
  &-list{
    border: 1px solid #767676;
    border-radius: 0 0 2px 2px;
    width: 90px;
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 100;
    background: #fff;
    max-height: 0px;
    transition: max-height 1s ease, opacity .5s ease;
    overflow-y: auto;
    opacity: 0;
    padding-bottom: 10px;
    &.active{
      max-height: 200px;
      opacity: 1;
    }
    button{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 4px 8px;
      border: none;
      background: none;
      font-size: 16px;
      color: #000;
      transition: .25s ease;
      cursor: pointer;
      span{
        font-size: 14px;
        font-weight: 600;
      }
      &:hover{
        background: #775A35;
        color: #fff;
      }
      *{
        pointer-events: none;
      }
    }
    img{
      display: block;
      width: 30px;
      height: auto;
      border: 1px solid #767676;
    }
  }
}
</style>