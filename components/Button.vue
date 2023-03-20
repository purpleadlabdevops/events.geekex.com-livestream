<template>
  <button class="btn" :type="type" @click="onClick" :class="arrow === 'left' ? 'btn__left':'' ">
    <svg v-if="arrow === 'left'" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H8V8H6V6Z" fill="white"/><path d="M4 8H6V10H4V8Z" fill="white"/><path d="M2 10H4V12H2V10Z" fill="white"/><path d="M0 12H2V14H0V12Z" fill="white"/><path d="M4 4H6V6H4V4Z" fill="white"/><path d="M2 2H4.00032L4 4H2V2Z" fill="white"/><path d="M0 0H1.99998L2 2H0V0Z" fill="white"/></svg>
    {{ value }}
    <svg v-if="arrow === 'right'" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H8V8H6V6Z" fill="white"/><path d="M4 8H6V10H4V8Z" fill="white"/><path d="M2 10H4V12H2V10Z" fill="white"/><path d="M0 12H2V14H0V12Z" fill="white"/><path d="M4 4H6V6H4V4Z" fill="white"/><path d="M2 2H4.00032L4 4H2V2Z" fill="white"/><path d="M0 0H1.99998L2 2H0V0Z" fill="white"/></svg>
  </button>
</template>
<script>
export default{
  props: {
    value: {
      type: String,
      default: 'SUBMIT'
    },
    type: {
      type: String,
      default: 'button'
    },
    arrow: {
      type: String,
      default: 'right'
    }
  },
  methods: {
    onClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>
<style lang="scss" scoped>
.btn{
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.04em;
  color: #fff;
  width: 100%;
  height: 60px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: url(@/assets/img/btn-default.png) no-repeat 0 0/100% 100%;
  @media(min-width:992px){
    font-size: 14px;
  }
  @media(min-width:992px){
    font-size: 18px;
  }
  svg{
    pointer-events: none;
    transform: translateX(8px);
    @media(min-width:992px){
      transform: translateX(12px);
    }
  }
  &:hover{
    svg{
      animation: 1s arrowAnim infinite;
    }
  }
  &__disable{
    background-image: url(@/assets/img/btn-disable.png);
    cursor: default;
    pointer-events: none;
    &:hover{
      svg{
        animation: none;
      }
    }
  }
  &__link{
    color: #000;
    background-image: url(@/assets/img/btn-link.png);
    svg{
      path{
        fill: #000;
      }
    }
  }
  &__left{
    svg{
      transform: rotate(180deg) translateX(8px);
      @media(min-width:992px){
        transform: rotate(180deg) translateX(12px);
      }
    }
    &:hover{
      svg{
        animation-name: arrowAnimLeft;
      }
    }
  }
}
@keyframes arrowAnim {
  50%{
    transform: translateX(16px);
    @media(min-width:992px){
      transform: translateX(24px);
    }
  }
}
@keyframes arrowAnimLeft {
  50%{
    transform: rotate(180deg) translateX(16px);
    @media(min-width:992px){
      transform: rotate(180deg) translateX(24px);
    }
  }
}
</style>
