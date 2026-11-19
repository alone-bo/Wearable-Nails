<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  label: { type: String, required: true },
  variant: { type: String, default: 'modal' },
  hideClose: Boolean,
})

const emit = defineEmits(['close', 'opened'])
const dialogEl = ref(null)
let returnFocus = null

function show() {
  if (!dialogEl.value || dialogEl.value.open) return
  returnFocus = document.activeElement
  dialogEl.value.showModal()
  document.body.classList.add('modal-open')
  emit('opened')
}

function hide() {
  if (!dialogEl.value?.open) return
  dialogEl.value.close()
}

function handleCancel(event) {
  event.preventDefault()
  emit('close')
}

function handleBackdrop(event) {
  if (event.target === dialogEl.value) emit('close')
}

function handleNativeClose() {
  document.body.classList.remove('modal-open')
  emit('close')
  nextTick(() => {
    if (returnFocus instanceof HTMLElement) returnFocus.focus({ preventScroll: true })
  })
}

watch(
  () => props.open,
  (isOpen) => {
    nextTick(() => {
      if (isOpen) show()
      else hide()
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (dialogEl.value?.open) dialogEl.value.close()
  document.body.classList.remove('modal-open')
})
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogEl"
      class="dialog"
      :class="`dialog--${variant}`"
      :aria-label="label"
      aria-modal="true"
      @cancel="handleCancel"
      @click="handleBackdrop"
      @close="handleNativeClose"
    >
      <div class="dialog__panel" @click.stop>
        <button
          v-if="!hideClose"
          type="button"
          class="dialog__close"
          aria-label="Close dialog"
          @click="emit('close')"
        >
          <Icon name="close" :size="18" />
        </button>
        <slot />
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.dialog {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
}

.dialog:not([open]) {
  display: none;
}

.dialog::backdrop {
  background: rgba(41, 50, 37, 0.48);
  backdrop-filter: blur(4px);
  animation: backdropIn 280ms ease both;
}

.dialog--drawer[open] {
  display: flex;
  justify-content: flex-end;
}

.dialog--search[open] {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(18px, 8vh, 100px) 20px 20px;
  overflow-y: auto;
}

.dialog--modal[open] {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(14px, 3vw, 32px);
  overflow-y: auto;
}

.dialog__panel {
  position: relative;
  background: var(--cream);
  box-shadow: 0 30px 90px -35px rgba(20, 27, 18, 0.6);
  animation: panelIn 420ms var(--ease-out) both;
}

.dialog--drawer .dialog__panel {
  width: min(468px, 100%);
  height: 100dvh;
  max-height: none;
  overflow-y: auto;
  border-radius: 0;
  animation: drawerIn 460ms var(--ease-out) both;
}

.dialog--search .dialog__panel {
  width: min(780px, 100%);
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  border-radius: 14px;
}

.dialog--modal .dialog__panel {
  width: min(1020px, 100%);
  max-height: calc(100dvh - 2 * clamp(14px, 3vw, 32px));
  overflow-y: auto;
  border-radius: 14px;
}

.dialog__close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: rgba(255, 253, 248, 0.9);
  color: var(--ink);
  backdrop-filter: blur(8px);
  transition:
    background-color 200ms ease,
    color 200ms ease,
    transform 200ms ease;
}

.dialog__close:hover {
  background: var(--sage-deep);
  color: var(--white);
  transform: rotate(6deg);
}

@keyframes backdropIn {
  from {
    opacity: 0;
  }
}

@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }
}

@keyframes drawerIn {
  from {
    transform: translateX(100%);
  }
}

@media (max-width: 640px) {
  .dialog--drawer .dialog__panel {
    width: 100%;
  }

  .dialog--modal[open] {
    padding: 0;
    align-items: flex-end;
  }

  .dialog--modal .dialog__panel {
    width: 100%;
    max-height: 94dvh;
    border-radius: 14px 14px 0 0;
  }

  .dialog__close {
    top: 12px;
    right: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dialog__panel,
  .dialog::backdrop {
    animation: none !important;
  }
}
</style>
