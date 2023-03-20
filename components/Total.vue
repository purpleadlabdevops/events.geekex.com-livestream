<template>
  <table class="total-table">
    <tbody>
      <tr class="product">
        <td>
          <h4>{{ data.productName }}</h4>
          <p v-if="data.baseProductName === 'livestream'">
            Live Stream <br>
            Slides <br>
            1 Month Membership to Geekhub
          </p>
          <p v-else>
            Live Stream <br>
            Replays <br>
            Notes From Event <br>
            Slides <br>
            3 Month Membership to Geekhub
          </p>
        </td>
        <td>${{ data.price }}</td>
      </tr>
      <tr v-if="discount !== 0">
        <td>Discount:</td>
        <td>-{{ (discount * 100).toFixed(2) }}%</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>Total: </td>
        <td v-if="discount !== 0">${{ (price - (price * discount)).toFixed(2) }}</td>
        <td v-else >${{ price.toFixed(2) }}</td>
      </tr>
    </tfoot>
  </table>
</template>
<script>
export default{
  props: ['data'],
  computed: {
    discount(){ return this.$store.getters['global/getDiscount'] },
    price(){ return this.$store.getters['global/getPrice'] },
  },
  methods: {
    saveTotal(){
      localStorage.total = this.discount !== 0 ? (this.price - (this.price * this.discount)).toFixed(2) : this.price.toFixed(2)
    }
  },
  updated(){
    this.saveTotal()
  },
  mounted(){
    this.saveTotal()
  }
}
</script>
<style lang="scss" scoped>
.total{
  &-table{
    width: 100%;
    margin-top: 30px;
    td{
      font-size: 16px;
      padding: 5px 0;
      & + td {
        width: 75px;
        text-align: right;
        border-left: 1px solid #73583e;
        padding-left: 10px;
      }
    }
    tbody {
      border-bottom: 1px solid #73583e;
    }
    tfoot{
      font-weight: 700;
      text-transform: uppercase;
      td{
        padding-top: 5px;
      }
    }
  }
}
.product{
  td{
    font-weight: 700;
    border-bottom: 1px solid #73583e;
  }
  h4{
    font-size: 18px;
    border-bottom: .5px solid #73583e;
    padding-bottom: 5px;
    margin-bottom: 5px;
    margin-right: 10px;
  }
  p{
    font-size: 14px;
    padding-bottom: 10px;
  }
}
</style>