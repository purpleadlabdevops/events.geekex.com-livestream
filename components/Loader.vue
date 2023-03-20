<template>
  <div class="loader">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <rect x="0" y="13" width="4" height="5" fill="#73583e">
        <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>
        <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>
      </rect>
      <rect x="10" y="13" width="4" height="5" fill="#73583e">
        <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate>
        <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate>
      </rect>
      <rect x="20" y="13" width="4" height="5" fill="#73583e">
        <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate>
        <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate>
      </rect>
    </svg>
  </div>
</template>
<style lang="scss" scoped>
.loader{
  position: fixed;
  left: 0; top: 0;
  height: 100vh;
  width: 100%;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0, .7);
  svg{
    width: 60px;
    height: auto;
  }
}
</style>