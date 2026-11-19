<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: { type: Object, required: true },
  large: Boolean,
})

const style = computed(() => ({
  '--tone': props.product.tone,
  '--tone-deep': props.product.toneDeep,
  '--wash': props.product.wash,
  '--label': props.product.label,
}))

const tipStyle = (index) => ({
  background: props.product.tips[index] || props.product.tone,
})
</script>

<template>
  <div
    class="product-visual"
    :class="[`product-visual--${product.kind}`, { 'product-visual--large': large }]"
    :style="style"
    aria-hidden="true"
  >
    <span class="pv-orbit" />
    <span class="pv-grain" />
    <span class="pv-spark pv-spark--one" />
    <span class="pv-spark pv-spark--two" />
    <span class="pv-label">YOUGLOW · CASA</span>
    <span class="pv-edition">{{ product.categoryLabel }}</span>

    <div class="pv-stage">
      <template v-if="product.kind === 'box'">
        <div class="pv-carton pv-carton--back">
          <span class="pv-carton__brand">YOUGLOW</span>
        </div>
        <div class="pv-carton">
          <div class="pv-carton__top">
            <span class="pv-carton__brand">YOUGLOW</span>
            <span class="pv-carton__est">EST. 2024</span>
          </div>
          <span class="pv-carton__script">Nail Atelier</span>
          <div class="pv-window">
            <span v-for="(tip, index) in product.tips" :key="index" class="pv-tip" :style="tipStyle(index)" />
          </div>
          <div class="pv-carton__bottom">
            <span>{{ product.shade }}</span>
            <span>24 TIPS</span>
          </div>
        </div>
        <span class="pv-seal">HAND<br />FINISHED</span>
      </template>

      <template v-else-if="product.kind === 'serum'">
        <div class="pv-serum">
          <div class="pv-serum__top">
            <span class="pv-serum__cap" />
            <span class="pv-serum__neck" />
          </div>
          <div class="pv-serum__body">
            <span class="pv-serum__brand">YOUGLOW</span>
            <span class="pv-serum__rule" />
            <span class="pv-serum__name">NAIL<br />CARE<br /><em>Serum</em></span>
            <span class="pv-serum__size">15 ML</span>
          </div>
        </div>
        <span class="pv-note">olive leaf<br />+ jojoba</span>
      </template>

      <template v-else-if="product.kind === 'oil'">
        <div class="pv-tube">
          <span class="pv-tube__cap" />
          <div class="pv-tube__body">
            <span class="pv-tube__brand">YOUGLOW</span>
            <span class="pv-tube__leaf"><span /></span>
            <span class="pv-tube__name">CUTICLE<br />OIL</span>
            <span class="pv-tube__meta">OLIVE · ROSEHIP<br />10 ML</span>
          </div>
        </div>
        <span class="pv-note">roll on<br />& press in</span>
      </template>

      <template v-else>
        <div class="pv-set">
          <div class="pv-set__items">
            <span class="pv-mini pv-mini--one" />
            <span class="pv-mini pv-mini--two" />
            <span class="pv-mini pv-mini--three" />
          </div>
          <div class="pv-set__box">
            <span class="pv-set__brand">YOUGLOW</span>
            <span class="pv-set__name">{{ product.id === 'soft-buff' ? 'PREP & SHINE' : 'THE ATELIER SET' }}</span>
            <span class="pv-set__line" />
            <span class="pv-set__meta">MADE IN CASA · {{ product.id === 'soft-buff' ? '2 ESSENTIALS' : '3 ESSENTIALS' }}</span>
          </div>
          <span class="pv-set__ribbon" />
        </div>
        <span class="pv-seal pv-seal--rose">GIFT<br />WRAPPED</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.product-visual {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1 / 1.05;
  background:
    radial-gradient(circle at 72% 12%, rgba(255, 255, 255, 0.92), transparent 38%),
    linear-gradient(145deg, var(--wash) 0%, color-mix(in srgb, var(--wash) 76%, #fff) 100%);
  container-type: inline-size;
  color: var(--tone-deep);
}

.pv-grain {
  position: absolute;
  inset: 0;
  z-index: 4;
  background-image: radial-gradient(rgba(57, 71, 51, 0.11) 0.6px, transparent 0.6px);
  background-size: 5px 5px;
  opacity: 0.16;
  pointer-events: none;
  mix-blend-mode: multiply;
}

.pv-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 78%;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--tone) 25%, transparent);
  border-radius: 50%;
  transform: translate(-50%, -47%);
}

.pv-orbit::before,
.pv-orbit::after {
  position: absolute;
  border: 1px solid color-mix(in srgb, var(--tone) 16%, transparent);
  border-radius: 50%;
  content: '';
}

.pv-orbit::before {
  inset: 7%;
}

.pv-orbit::after {
  inset: 18%;
  border-style: dashed;
}

.pv-spark {
  position: absolute;
  width: 2.6cqw;
  aspect-ratio: 1;
  background: currentColor;
  clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%);
  color: var(--rose);
  opacity: 0.7;
}

.pv-spark--one {
  top: 17%;
  right: 13%;
}

.pv-spark--two {
  bottom: 22%;
  left: 9%;
  width: 1.5cqw;
  opacity: 0.5;
}

.pv-label,
.pv-edition {
  position: absolute;
  z-index: 5;
  top: 5.4%;
  font-size: 2.45cqw;
  font-weight: 600;
  letter-spacing: 0.17em;
  line-height: 1;
  text-transform: uppercase;
  opacity: 0.62;
}

.pv-label {
  left: 6%;
}

.pv-edition {
  right: 6%;
  color: var(--tone-deep);
  opacity: 0.48;
}

.pv-stage {
  position: absolute;
  z-index: 3;
  inset: 10% 7% 7%;
  display: grid;
  place-items: center;
}

/* Press-on carton */
.pv-carton {
  position: relative;
  z-index: 2;
  display: flex;
  width: 57%;
  height: 76%;
  flex-direction: column;
  padding: 4.8% 4.3% 4%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.2cqw;
  background:
    linear-gradient(155deg, rgba(255, 255, 255, 0.16), transparent 45%),
    linear-gradient(150deg, color-mix(in srgb, var(--tone) 86%, #fff) 0%, var(--tone) 48%, var(--tone-deep) 100%);
  box-shadow:
    0 7cqw 10cqw -8cqw rgba(38, 47, 33, 0.5),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  color: var(--label);
  transform: rotate(-5.5deg);
}

.pv-carton::after {
  position: absolute;
  top: 0;
  left: 6%;
  width: 1px;
  height: 100%;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.25), transparent);
  content: '';
}

.pv-carton--back {
  position: absolute;
  top: 11%;
  left: 20%;
  z-index: 1;
  width: 54%;
  height: 74%;
  align-items: flex-start;
  justify-content: flex-end;
  opacity: 0.55;
  transform: rotate(7deg) translateX(5%);
}

.pv-carton--back .pv-carton__brand {
  opacity: 0;
}

.pv-carton--back::before {
  position: absolute;
  inset: 5%;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 0.6cqw;
  content: '';
}

.pv-carton__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4%;
  padding-bottom: 2.2cqw;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.pv-carton__brand,
.pv-carton--back .pv-carton__brand {
  font-family: var(--font-display);
  font-size: 5.8cqw;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 0.8;
}

.pv-carton__est {
  font-size: 1.55cqw;
  letter-spacing: 0.12em;
  opacity: 0.8;
}

.pv-carton__script {
  margin-top: 1.4cqw;
  font-family: var(--font-display);
  font-size: 3.5cqw;
  font-style: italic;
  font-weight: 300;
  line-height: 1;
  opacity: 0.94;
}

.pv-window {
  position: relative;
  display: flex;
  flex: 1;
  align-items: flex-end;
  justify-content: center;
  gap: 2.5%;
  margin-top: 2.4cqw;
  padding: 7% 7% 6%;
  overflow: hidden;
  border-radius: 0.7cqw;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.7), transparent 55%),
    var(--label);
  box-shadow: inset 0 0 2cqw rgba(80, 64, 45, 0.08);
}

.pv-window::before {
  position: absolute;
  inset: 5%;
  border: 1px solid rgba(63, 74, 55, 0.1);
  border-radius: 0.4cqw;
  content: '';
}

.pv-tip {
  position: relative;
  display: block;
  width: 15.5%;
  height: 63%;
  flex: 0 1 auto;
  border-radius: 100% 100% 16% 16% / 36% 36% 8% 8%;
  box-shadow:
    0 1.2cqw 2.4cqw -1.6cqw rgba(48, 41, 32, 0.55),
    inset 0.35cqw 0.3cqw 0.5cqw rgba(255, 255, 255, 0.55),
    inset -0.3cqw -0.4cqw 0.5cqw rgba(0, 0, 0, 0.08);
  transform-origin: 50% 100%;
}

.pv-tip::after {
  position: absolute;
  top: 8%;
  left: 22%;
  width: 20%;
  height: 44%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.32);
  content: '';
  filter: blur(0.3px);
}

.pv-tip:nth-child(1) {
  transform: rotate(-13deg) translateY(5%);
}

.pv-tip:nth-child(2) {
  transform: rotate(-6deg) translateY(1%);
}

.pv-tip:nth-child(3) {
  transform: rotate(0) translateY(-2%);
}

.pv-tip:nth-child(4) {
  transform: rotate(6deg) translateY(1%);
}

.pv-tip:nth-child(5) {
  transform: rotate(13deg) translateY(5%);
}

.pv-carton__bottom {
  display: flex;
  justify-content: space-between;
  gap: 4%;
  margin-top: 2.2cqw;
  font-size: 1.75cqw;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
  opacity: 0.86;
}

.pv-carton__bottom span:first-child {
  max-width: 68%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pv-seal {
  position: absolute;
  right: 4%;
  bottom: 6%;
  z-index: 6;
  display: grid;
  width: 14.5%;
  aspect-ratio: 1;
  place-content: center;
  border: 1px solid color-mix(in srgb, var(--rose) 55%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--wash) 60%, #fff);
  color: var(--rose-deep);
  font-size: 1.7cqw;
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1.35;
  text-align: center;
  transform: rotate(9deg);
}

.pv-seal--rose {
  color: var(--rose-deep);
}

/* Serum bottle */
.pv-serum {
  position: relative;
  z-index: 2;
  display: flex;
  width: 42%;
  height: 83%;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 6cqw 6cqw rgba(62, 48, 33, 0.25));
  transform: rotate(-2deg);
}

.pv-serum__top {
  display: flex;
  height: 26%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.pv-serum__cap {
  width: 58%;
  height: 47%;
  border-radius: 1cqw 1cqw 0.5cqw 0.5cqw;
  background: linear-gradient(100deg, #4c3c2b, #8f7658 42%, #3a2e23 70%, #604a35);
  box-shadow: inset 0.7cqw 0.4cqw 0.6cqw rgba(255, 255, 255, 0.2);
}

.pv-serum__neck {
  width: 22%;
  height: 24%;
  background: linear-gradient(90deg, #6d5338, #bc9a6b 50%, #674a2f);
}

.pv-serum__body {
  position: relative;
  display: flex;
  width: 100%;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 13% 10% 11%;
  overflow: hidden;
  border-radius: 5cqw 5cqw 3.5cqw 3.5cqw;
  background:
    linear-gradient(100deg, rgba(255, 255, 255, 0.44), transparent 24%, transparent 72%, rgba(79, 51, 23, 0.25)),
    linear-gradient(180deg, #c79a5e 0%, #a7773f 48%, #755029 100%);
  color: #fbf1de;
  box-shadow:
    inset 0.9cqw 0.8cqw 1.6cqw rgba(255, 255, 255, 0.25),
    inset -1.2cqw -1.5cqw 2cqw rgba(54, 34, 15, 0.3);
}

.pv-serum__body::after {
  position: absolute;
  top: 4%;
  left: 22%;
  width: 9%;
  height: 70%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  content: '';
  filter: blur(0.5px);
}

.pv-serum__brand {
  font-family: var(--font-display);
  font-size: 4.3cqw;
  font-weight: 500;
  letter-spacing: 0.1em;
  line-height: 1;
}

.pv-serum__rule {
  width: 60%;
  height: 1px;
  margin: 7% 0 9%;
  background: rgba(250, 238, 218, 0.5);
}

.pv-serum__name {
  font-size: 2.4cqw;
  font-weight: 500;
  letter-spacing: 0.12em;
  line-height: 1.65;
  text-align: center;
}

.pv-serum__name em {
  font-family: var(--font-display);
  font-size: 1.65em;
  letter-spacing: 0.02em;
  text-transform: none;
}

.pv-serum__size {
  margin-top: auto;
  font-size: 1.7cqw;
  letter-spacing: 0.16em;
  opacity: 0.8;
}

.pv-note {
  position: absolute;
  right: 11%;
  bottom: 14%;
  color: var(--tone-deep);
  font-family: var(--font-display);
  font-size: 2.7cqw;
  font-style: italic;
  line-height: 1.2;
  opacity: 0.68;
  transform: rotate(-6deg);
}

/* Cuticle oil tube */
.pv-tube {
  position: relative;
  z-index: 2;
  display: flex;
  width: 38%;
  height: 80%;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 6cqw 6cqw rgba(62, 48, 33, 0.22));
  transform: rotate(3deg);
}

.pv-tube__cap {
  width: 64%;
  height: 11%;
  border-radius: 1.2cqw 1.2cqw 0.3cqw 0.3cqw;
  background: linear-gradient(100deg, #8f7360, #c8a790 42%, #8d6a54);
  box-shadow: inset 0.6cqw 0.4cqw 0.6cqw rgba(255, 255, 255, 0.28);
}

.pv-tube__body {
  display: flex;
  width: 100%;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 11% 9%;
  border-radius: 2cqw 2cqw 3.2cqw 3.2cqw;
  background:
    linear-gradient(105deg, rgba(255, 255, 255, 0.6), transparent 28%, transparent 78%, rgba(96, 85, 67, 0.14)),
    linear-gradient(180deg, #f3ebda 0%, #ddd2bd 100%);
  box-shadow:
    inset 0 0.9cqw 1.2cqw rgba(255, 255, 255, 0.7),
    inset -1cqw -1cqw 1.5cqw rgba(99, 86, 66, 0.14);
  color: #5b5b49;
}

.pv-tube__brand {
  font-family: var(--font-display);
  font-size: 4.4cqw;
  font-weight: 500;
  letter-spacing: 0.1em;
  line-height: 1;
}

.pv-tube__leaf {
  position: relative;
  width: 7.5cqw;
  height: 8.5cqw;
  margin: 12% 0 7%;
  color: var(--tone);
}

.pv-tube__leaf::before,
.pv-tube__leaf::after {
  position: absolute;
  width: 70%;
  height: 50%;
  border: 1px solid currentColor;
  border-radius: 100% 0 100% 0;
  content: '';
}

.pv-tube__leaf::before {
  top: 4%;
  left: 0;
  transform: rotate(-25deg);
}

.pv-tube__leaf::after {
  right: 0;
  bottom: 4%;
  transform: scaleX(-1) rotate(-25deg);
}

.pv-tube__leaf > span {
  position: absolute;
  top: 2%;
  left: 50%;
  width: 1px;
  height: 96%;
  background: currentColor;
  opacity: 0.55;
  transform: rotate(9deg);
}

.pv-tube__name {
  font-size: 2.8cqw;
  font-weight: 600;
  letter-spacing: 0.18em;
  line-height: 1.55;
  text-align: center;
}

.pv-tube__meta {
  margin-top: auto;
  font-size: 1.55cqw;
  letter-spacing: 0.12em;
  line-height: 1.6;
  text-align: center;
  opacity: 0.62;
}

/* Gift set */
.pv-set {
  position: relative;
  z-index: 2;
  display: flex;
  width: 70%;
  height: 68%;
  align-items: flex-end;
  justify-content: center;
  filter: drop-shadow(0 6cqw 8cqw rgba(62, 48, 33, 0.24));
}

.pv-set__items {
  position: absolute;
  z-index: 1;
  bottom: 34%;
  left: 50%;
  display: flex;
  align-items: flex-end;
  gap: 1.4cqw;
  transform: translateX(-50%);
}

.pv-mini {
  display: block;
  width: 7.8cqw;
  border-radius: 1cqw 1cqw 0.5cqw 0.5cqw;
  background: linear-gradient(100deg, #ede0cc, #fffaf0 38%, #cbbba2);
  box-shadow: inset -0.5cqw -0.6cqw 1cqw rgba(80, 64, 45, 0.2);
}

.pv-mini::before {
  display: block;
  width: 45%;
  height: 15%;
  margin: 0 auto;
  border-radius: 0.3cqw 0.3cqw 0 0;
  background: var(--tone-deep);
  content: '';
}

.pv-mini--one {
  height: 16cqw;
}

.pv-mini--two {
  height: 13cqw;
  background: linear-gradient(100deg, var(--tone), color-mix(in srgb, var(--tone) 65%, #fff) 44%, var(--tone-deep));
}

.pv-mini--three {
  height: 11cqw;
  background: linear-gradient(100deg, #c9a28e, #f1d8c8 40%, #b4866f);
}

.pv-set__box {
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  height: 58%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0.8cqw;
  background:
    linear-gradient(155deg, rgba(255, 255, 255, 0.12), transparent 50%),
    linear-gradient(150deg, color-mix(in srgb, var(--tone) 82%, #fff), var(--tone) 55%, var(--tone-deep));
  box-shadow: 0 3cqw 5cqw -3cqw rgba(47, 41, 31, 0.45);
  color: var(--label);
}

.pv-set__box::before {
  position: absolute;
  inset: 6%;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 0.35cqw;
  content: '';
}

.pv-set__brand {
  font-family: var(--font-display);
  font-size: 4.2cqw;
  font-weight: 500;
  letter-spacing: 0.12em;
  line-height: 1;
}

.pv-set__name {
  margin-top: 1.8cqw;
  font-size: 2.1cqw;
  font-weight: 500;
  letter-spacing: 0.14em;
  line-height: 1.5;
  text-align: center;
}

.pv-set__line {
  width: 24%;
  height: 1px;
  margin: 2cqw 0;
  background: currentColor;
  opacity: 0.45;
}

.pv-set__meta {
  font-size: 1.35cqw;
  letter-spacing: 0.12em;
  opacity: 0.7;
}

.pv-set__ribbon {
  position: absolute;
  z-index: 3;
  top: 37%;
  left: 50%;
  width: 2.2cqw;
  height: 58%;
  background: linear-gradient(90deg, var(--rose-deep), var(--rose-light), var(--rose-deep));
  opacity: 0.8;
  transform: translateX(-50%);
}

.product-visual--large .pv-carton {
  width: 53%;
  height: 70%;
}

.product-visual--large .pv-label,
.product-visual--large .pv-edition {
  font-size: 1.3cqw;
}

.product-visual--large .pv-seal {
  width: 12%;
  font-size: 1.2cqw;
}

.product-visual--large .pv-serum {
  width: 31%;
}

.product-visual--large .pv-tube {
  width: 28%;
}

.product-visual--large .pv-set {
  width: 62%;
  height: 62%;
}

@container (max-width: 240px) {
  .pv-carton {
    width: 62%;
  }

  .pv-label {
    display: none;
  }
}
</style>
