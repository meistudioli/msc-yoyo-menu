import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';
import Mustache from './mustache.js';

const defaults = {
  menu: []
};

const booleanAttrs = []; // booleanAttrs default should be false
const objectAttrs = ['menu'];
const custumEvents = {
  click: 'msc-yoyo-memu-click',
  toggle: 'msc-yoyo-memu-toggle'
};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host {
  position: relative;
  inline-size: fit-content;
  block-size: fit-content;
  display: block;
}

.main {
  --ON: initial;
  --OFF: ;

  /* Quadrant */
  --Quadrant-I: var(--ON);
  --Quadrant-II: var(--OFF);
  --Quadrant-III: var(--OFF);
  --Quadrant-IV: var(--OFF);

  --multiplier:
    var(
      --Quadrant-I,
      -1
    )
    var(
      --Quadrant-II,
      1
    )
    var(
      --Quadrant-III,
      -1
    )
    var(
      --Quadrant-IV,
      1
    );

  --initial-degree:
    var(
      --Quadrant-I,
      0deg
    )
    var(
      --Quadrant-II,
      180deg
    )
    var(
      --Quadrant-III,
      180deg
    )
    var(
      --Quadrant-IV,
      0deg
    );

  --size: var(--msc-yoyo-menu-button-size, 40);
  --size-with-unit: calc(var(--size) * 1px);

  --distance-ratio: var(--msc-yoyo-menu-expand-distance-ratio, 5);
  --duration: var(--msc-yoyo-menu-transition-duration, .35s);
  --basis-transition-delay: .05s;
  --timing-function--normal: cubic-bezier(.43,-0.23,.9,.87);
  --timing-function--active: cubic-bezier(.6,-0.06,.76,1.36);
  --timing-function: var(--timing-function--normal);

  --distance-normal: 0%;
  --distance-active: calc(100% * var(--distance-ratio));
  --distance: var(--distance-normal);

  /* button */
  --basis-button-icon: path('M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z');
  --button-icon-scale: calc((var(--size) * .63) / 24);

  --button-trigger-background: var(--msc-yoyo-menu-button-trigger-background, rgba(255 255 255));
  --button-trigger-border: var(--msc-yoyo-menu-button-trigger-border, 0px solid transparent);
  --button-trigger-box-shadow: var(--msc-yoyo-menu-button-trigger-box-shadow, 0 0 1px rgba(0 0 0/.1), 0 2px 4px rgba(0 0 0/.08));
  --button-trigger-icon-color: var(--msc-yoyo-menu-button-trigger-icon-color, rgba(35 42 49));
  --button-trigger-overlay: var(--msc-yoyo-menu-button-trigger-overlay, rgba(29 34 40/.2));

  --button-unit-background: var(--msc-yoyo-menu-button-unit-background, rgba(255 255 255));
  --button-unit-border: var(--msc-yoyo-menu-button-unit-border, 0px solid transparent);
  --button-unit-box-shadow-normal: unset;
  --button-unit-box-shadow-active: var(--msc-yoyo-menu-button-unit-box-shadow, 0 0 1px rgba(0 0 0/.1), 0 2px 4px rgba(0 0 0/.08));
  --button-unit-box-shadow: var(--button-unit-box-shadow-normal);
  --button-unit-icon-color: var(--msc-yoyo-menu-button-unit-icon-color, rgba(35 42 49));
  --button-unit-overlay: var(--msc-yoyo-menu-button-unit-overlay, rgba(29 34 40/.2));

  --count: 1;
  --delta-deg: calc(90deg / (var(--count) - 1));
${
Array(100)
  .fill()
  .map(
    (I, idx) => {
      const key = idx + 1;

      return `
  &:has(:nth-child(${key} of .msc-yoyo-menu__unit)) {
    --count: ${key};
  }`;
    }
  ).join('\n')
}  

  position: relative;
  inline-size: var(--size-with-unit);
  aspect-ratio: 1/1;
  outline: 0 none;

  &.main--active {
    --distance: var(--distance-active);
    --timing-function: var(--timing-function--active);
    --button-unit-box-shadow: var(--button-unit-box-shadow-active);

    .msc-yoyo-menu__trigger {
      --rotate: var(--rotate-active);
    }

    .msc-yoyo-menu__unit {
      --delay: calc(var(--basis-transition-delay) * (var(--order) - 1));
      --button-rotate: var(--button-rotate-active);
      --button-scale: var(--button-scale-active);
    }
  }

  &:not(.main--active) {
    .msc-yoyo-menu__trigger:active ~ .msc-yoyo-menu__unit {
      opacity: 0;
    }
  }

  button {
    --overlay-opacity-normal: 0;
    --overlay-opacity-active: 1;
    --overlay-opacity: var(--overlay-opacity-normal);

    flex-shrink: 0;
    font-size: 0;
    appearance: none;
    box-shadow: unset;
    border: unset;
    background: transparent;
    -webkit-user-select: none;
    user-select: none;
    pointer-events: auto;
    margin: 0;
    padding: 0;
    outline: 0 none;

    position: relative;
    overflow: hidden;
    box-sizing: border-box;

    &:active {
      scale: .9;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      margin: auto;
      background: var(--overlay);
      opacity: var(--overlay-opacity);
      transition: opacity .15s ease; 
      will-change: opacity;
    }

    &:focus-visible {
      --overlay-opacity: var(--overlay-opacity-active);
    }

    @media (hover: hover) {
      &:hover {
        --overlay-opacity: var(--overlay-opacity-active);
      }
    }
  }

  .msc-yoyo-menu__trigger {
    --rotate-normal: 0deg;
    --rotate-active: 45deg;
    --rotate: var(--rotate-normal);
    --overlay: var(--button-trigger-overlay);

    position: absolute;
    inset: 0;
    margin: auto;

    font-size: inherit;
    border-radius: 100%;
    background: var(--button-trigger-background);
    border: var(--button-trigger-border);
    box-shadow: var(--button-trigger-box-shadow);

    z-index: 1;
    display: grid;
    place-content: center;

    &::before {
      content: '';
      inline-size: 24px;
      aspect-ratio: 1/1;
      background-color: var(--button-trigger-icon-color);
      clip-path: path('M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z');
      display: block;
      scale: var(--button-icon-scale);

      rotate: var(--rotate);
      transition: rotate var(--duration) ease;
      will-change: rotate;
    }
  }

  .msc-yoyo-menu__unit {
    --order: 1;
    --basis-rotate: calc(var(--initial-degree) + var(--delta-deg) * (var(--order) - 1) * var(--multiplier));
    --delay: calc(var(--basis-transition-delay) * (var(--count) - var(--order)));

    --button-rotate-active: calc(var(--basis-rotate) * -1);
    --button-rotate-normal: calc(var(--button-rotate-active) - 360deg * 2);
    --button-rotate: var(--button-rotate-normal);

    --button-scale-active: 1;
    --button-scale-normal: .6;
    --button-scale: var(--button-scale-normal);

    --button-icon: var(--basis-button-icon);
    --button-background: var(--button-unit-background);
    --button-border: var(--button-unit-border);
    --button-box-shadow: var(--button-unit-box-shadow);
    --button-icon-color: var(--button-unit-icon-color);
    --overlay: var(--button-unit-overlay);

    position: absolute;
    inset: 0;
    margin: auto;
    rotate: var(--basis-rotate);

    .msc-yoyo-menu__unit__button {
      inline-size: 100%;
      block-size: 100%;
      border-radius: 100%;
      font-size: 0;
      box-sizing: border-box;

      background: var(--button-background);
      border: var(--button-border);
      box-shadow: var(--button-box-shadow);

      transform-origin: center;
      translate: var(--distance) 0%;
      rotate: var(--button-rotate);
      scale: var(--button-scale);
      transition:
        translate var(--duration) var(--timing-function) var(--delay),
        rotate var(--duration) var(--timing-function) var(--delay),
        scale var(--duration) var(--timing-function) var(--delay);
      will-change: translate, scale, rotate;

      display: grid;
      place-content: center;

      &::before {
        content: '';
        inline-size: 24px;
        aspect-ratio: 1/1;
        background: var(--button-icon-color);
        clip-path: var(--button-icon);
        display: block;
        scale: var(--button-icon-scale);
      }
    }
  }
${
Array(100)
  .fill()
  .map(
    (I, idx) => {
      const key = idx + 1;

      return `
  :nth-child(${key} of .msc-yoyo-menu__unit) {
    --order: ${key};
    --button-icon: var(--msc-yoyo-menu-button${key}-icon, var(--basis-button-icon));
    --button-icon-color: var(--msc-yoyo-menu-button${key}-icon-color, var(--button-unit-icon-color));
    --button-background: var(--msc-yoyo-menu-button${key}-background, var(--button-unit-background));
    --button-border: var(--msc-yoyo-menu-button${key}-border, var(--button-unit-border));
    --button-box-shadow: var(--msc-yoyo-menu-button${key}-box-shadow, var(--button-unit-box-shadow));
    --overlay: var(--msc-yoyo-menu-button${key}-overlay, var(--button-unit-overlay));
  }`;
    }
  ).join('\n')
}
}

:host([data-quadrant='1']) .main {
  --Quadrant-I: var(--ON);
  --Quadrant-II: var(--OFF);
  --Quadrant-III: var(--OFF);
  --Quadrant-IV: var(--OFF);
}

:host([data-quadrant='2']) .main {
  --Quadrant-I: var(--OFF);
  --Quadrant-II: var(--ON);
  --Quadrant-III: var(--OFF);
  --Quadrant-IV: var(--OFF);
}

:host([data-quadrant='3']) .main {
  --Quadrant-I: var(--OFF);
  --Quadrant-II: var(--OFF);
  --Quadrant-III: var(--ON);
  --Quadrant-IV: var(--OFF);
}

:host([data-quadrant='4']) .main {
  --Quadrant-I: var(--OFF);
  --Quadrant-II: var(--OFF);
  --Quadrant-III: var(--OFF);
  --Quadrant-IV: var(--ON);
}
</style>

<div class="main" ontouchstart="">
  <button
    type="button"
    class="msc-yoyo-menu__trigger"
  >
  </button>
</div>
`;

const templateMenuUnit = document.createElement('template');
templateMenuUnit.innerHTML = `
{{#menu}}
  <div class="msc-yoyo-menu__unit">
    <button class="msc-yoyo-menu__unit__button" title="{{title}}" data-key="{{key}}">
      button {{sn}}
    </button>
  </div>
{{/menu}}
`;

/*
 Houdini Props and Vals
 - https://web.dev/at-property/
 - https://drafts.css-houdini.org/css-properties-values-api/#syntax-strings
 */
if (CSS?.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--msc-yoyo-menu-button-size',
      syntax: '<number>',
      inherits: true,
      initialValue: 44
    });

    CSS.registerProperty({
      name: '--msc-yoyo-menu-expand-distance-ratio',
      syntax: '<number>',
      inherits: true,
      initialValue: 5
    });

    CSS.registerProperty({
      name: '--msc-yoyo-menu-transition-duration',
      syntax: '<time>',
      inherits: true,
      initialValue: '.35s'
    });
  } catch(err) {
    console.warn(`msc-collage: ${err.message}`);
  }
}

export class MscYoyoMenu extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      main: this.shadowRoot.querySelector('.main'),
      trigger: this.shadowRoot.querySelector('.msc-yoyo-menu__trigger')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscYoyoMenu(config)
    };

    // evts
    this._onClick = this._onClick.bind(this);
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    this.#nodes.main.addEventListener('click', this._onClick, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  #format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'menu': {
          let values;

          try {
            values = JSON.parse(newValue);
          } catch(err) {
            console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
            values = Array.isArray(defaults[attrName]) ? [ ...defaults[attrName] ] : { ...defaults[attrName] };
          }

          values = values.map(
            (unit = {}, idx) => {
              const sn = idx + 1;
              const { key = `key-${sn}`, title = `title-${sn}` } = unit;

              return { key, title, sn };
            }
          );

          this.#config[attrName] = values;
          break;
        }
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscYoyoMenu.observedAttributes.includes(attrName)) {
      return;
    }

    this.#format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'menu': {
        const { main } = this.#nodes;

        Array.from(main.querySelectorAll('.msc-yoyo-menu__unit'))
          .forEach(
            (unit) => unit.remove()
          );

        const menuTemplateString = Mustache.render(templateMenuUnit.innerHTML, { menu: this.menu });
        main.insertAdjacentHTML('beforeend', menuTemplateString);
        break;
      }
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscYoyoMenu.observedAttributes
  }

  static get supportedEvents() {
    return Object.keys(custumEvents).map(
      (key) => {
        return custumEvents[key];
      }
    );
  }

  #upgradeProperty(prop) {
    let value;

    if (MscYoyoMenu.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  get open() {
    return this.#nodes.main.classList.contains('main--active');
  }

  set menu(value) {
    if (value) {
      const newValue = [
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      ];
      this.setAttribute('menu', JSON.stringify(newValue));
    } else {
      this.removeAttribute('menu');
    }
  }

  get menu() {
    return this.#config.menu;
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  _onClick(evt) {
    const button = evt.target.closest('button');

    if (!button) {
      return;
    }
    
    const { main, trigger } = this.#nodes;

    if (button === trigger) {
      // trigger
      const force = !this.open;

      main.classList.toggle('main--active', force);

      this.#fireEvent(custumEvents.toggle, {
        oldState: force ? 'closed' : 'open',
        newState: force ? 'open' : 'closed'
      });
    } else {
      // menu
      main.classList.toggle('main--active', false);

      this.#fireEvent(custumEvents.click, {
        key: button.dataset.key,
        title: button.title
      });
    }
  }

  toggle(force = !this.open) {
    force = Boolean(force);

    if (force !== this.open) {
      this.#nodes.trigger.click();
    }
  }

  click() {
    this.#nodes.trigger.click();
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscYoyoMenu');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscYoyoMenu'), MscYoyoMenu);
}