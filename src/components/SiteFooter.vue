<script setup>
import BrandLogo from './BrandLogo.vue'
import Icon from './Icon.vue'
import SunMark from './SunMark.vue'

const emit = defineEmits(['open-booking'])
</script>

<template>
  <footer id="footer" class="footer">
    <div class="footer__halo" aria-hidden="true">
      <SunMark :size="530" />
    </div>

    <div class="container footer__inner">
      <div class="footer__top">
        <div class="footer__brand-block">
          <a href="#top" class="footer__brand" aria-label="YOUGLOW — back to top">
            <BrandLogo light />
          </a>
          <p class="footer__tagline">
            Press-on nail rituals and slow studio care, hand-finished in Casablanca.
          </p>
          <p class="footer__arabic" lang="ar" dir="rtl">جمال مصنوع بعناية، لمعانك اليومي</p>

          <button type="button" class="footer__book" @click="emit('open-booking')">
            Book a studio visit
            <Icon name="arrowUpRight" :size="16" />
          </button>
        </div>

        <div class="footer__columns">
          <div class="footer__column">
            <h3>Shop</h3>
            <a href="#shop">Press-on sets</a>
            <a href="#shop">Nail care</a>
            <a href="#shop">Gift sets</a>
            <a href="#glow-club">The Glow Club</a>
          </div>

          <div class="footer__column">
            <h3>The atelier</h3>
            <a href="#studio">Our studio</a>
            <a href="#ritual">The ritual</a>
            <a href="#journal">Journal</a>
            <a href="#newsletter">Join the list</a>
          </div>

          <div class="footer__column footer__column--visit">
            <h3>Visit</h3>
            <address>
              127 Boulevard de la Corniche<br />
              Casablanca 20000, Morocco
            </address>
            <a href="mailto:hello@youglow.ma">hello@youglow.ma</a>
            <a href="tel:+212522000000">+212 5 22 00 00 00</a>
            <p class="footer__hours">Mon — Sun · 10:00 — 20:00</p>
          </div>
        </div>
      </div>

      <div class="footer__middlerow">
        <div class="footer__socials">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="YOUGLOW on Instagram">
            <Icon name="instagram" :size="18" />
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="YOUGLOW on Pinterest">
            <Icon name="pinterest" :size="18" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="YOUGLOW on Facebook">
            <Icon name="facebook" :size="18" />
          </a>
          <span>@youglow.casa</span>
        </div>

        <div class="footer__payments" aria-label="Accepted payment methods">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>CMI</span>
          <span>Cash on delivery</span>
        </div>
      </div>

      <div class="footer__bottom">
        <p>© 2026 YOUGLOW Nail &amp; Beauty Studio. All rights reserved.</p>
        <div class="footer__legal">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Shipping &amp; returns</span>
        </div>
        <p class="footer__credit">Casablanca · Morocco</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  background: var(--sage-dark);
  color: var(--cream);
}

.footer__halo {
  position: absolute;
  top: -170px;
  right: -110px;
  color: var(--rose-light);
  opacity: 0.07;
  pointer-events: none;
}

.footer__inner {
  position: relative;
  z-index: 1;
  padding-top: clamp(64px, 8vw, 108px);
  padding-bottom: 28px;
}

.footer__top {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.35fr);
  gap: clamp(44px, 8vw, 120px);
  padding-bottom: clamp(48px, 6vw, 78px);
}

.footer__brand {
  display: inline-flex;
  --logo-size: clamp(2.5rem, 3.8vw, 3.4rem);
  transition: opacity 200ms ease;
}

.footer__brand:hover {
  opacity: 0.75;
}

.footer__tagline {
  max-width: 340px;
  margin-top: 22px;
  color: rgba(247, 242, 233, 0.96);
  font-size: 12px;
  line-height: 1.8;
}

.footer__arabic {
  margin-top: 14px;
  color: rgba(247, 242, 233, 0.94);
  font-family: 'Segoe UI', Tahoma, sans-serif;
  font-size: 12px;
}

.footer__book {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 12px;
  margin-top: 26px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--line-light);
  color: var(--cream);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  transition:
    border-color 200ms ease,
    color 200ms ease,
    gap 200ms ease;
}

.footer__book:hover {
  gap: 18px;
  border-color: var(--cream);
  color: var(--white);
}

.footer__columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(24px, 4vw, 54px);
}

.footer__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
}

.footer__column h3 {
  margin-bottom: 9px;
  color: rgba(247, 242, 233, 0.94);
  font-family: var(--font-sans);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.16em;
  line-height: 1;
  text-transform: uppercase;
}

.footer__column a,
.footer__column address,
.footer__hours {
  color: rgba(247, 242, 233, 0.96);
  font-size: 11px;
  font-style: normal;
  line-height: 1.65;
  transition: color 200ms ease;
}

.footer__column a {
  position: relative;
}

.footer__column a:hover {
  color: var(--cream);
}

.footer__column--visit address {
  margin-bottom: 3px;
}

.footer__hours {
  margin-top: 4px;
  color: rgba(247, 242, 233, 0.94) !important;
  font-size: 9px !important;
}

.footer__middlerow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding-block: 22px;
  border-top: 1px solid var(--line-light);
}

.footer__socials {
  display: flex;
  align-items: center;
  gap: 7px;
}

.footer__socials a {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid var(--line-light);
  border-radius: 50%;
  color: var(--cream);
  transition:
    background-color 200ms ease,
    color 200ms ease;
}

.footer__socials a:hover {
  background: var(--cream);
  color: var(--sage-dark);
}

.footer__socials span {
  margin-left: 8px;
  color: rgba(247, 242, 233, 0.94);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.footer__payments {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.footer__payments span {
  padding: 5px 8px;
  border: 1px solid var(--line-light);
  border-radius: 3px;
  color: rgba(247, 242, 233, 0.94);
  font-size: 7px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--line-light);
  color: rgba(247, 242, 233, 0.94);
  font-size: 9px;
  letter-spacing: 0.03em;
}

.footer__legal {
  display: flex;
  gap: 18px;
}

.footer__credit {
  text-align: right;
}

@media (max-width: 940px) {
  .footer__top {
    grid-template-columns: 1fr;
    gap: 44px;
  }

  .footer__brand-block {
    padding-bottom: 36px;
    border-bottom: 1px solid var(--line-light);
  }
}

@media (max-width: 640px) {
  .footer__columns {
    grid-template-columns: 1fr 1fr;
    row-gap: 34px;
  }

  .footer__column--visit {
    grid-column: 1 / -1;
  }

  .footer__middlerow {
    align-items: flex-start;
    flex-direction: column;
  }

  .footer__bottom {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .footer__legal {
    flex-wrap: wrap;
  }

  .footer__credit {
    text-align: left;
  }
}
</style>
