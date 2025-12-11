// compass-switch.js
class CompassSwitch extends HTMLElement {
    constructor() {
        super();
        this._active = false;
        this._svgLoaded = false;
    }

    static get observedAttributes() {
        return ['active'];
    }

    async connectedCallback() {
        await this.loadSVG();
        this.attachEventListeners();

        // Устанавливаем начальное состояние
        if (this.hasAttribute('active')) {
            this._active = this.getAttribute('active') === 'true';
            this.updateState();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active' && oldValue !== newValue) {
            const newValueBool = newValue === 'true';
            if (this._active !== newValueBool) {
                this._active = newValueBool;
                this.updateState();
            }
        }
    }

    // Загружаем SVG из файла
    async loadSVG() {
        try {
            const response = await fetch('compass-icon.svg');
            const svgText = await response.text();

            // Создаем обертку
            this.innerHTML = `<div class="base">${svgText}</div>`;

            // Добавляем класс к SVG
            const svg = this.querySelector('svg');
            if (svg) {
                svg.classList.add('compass-icon');
            }

            this._svgLoaded = true;
        } catch (error) {
            console.error('Ошибка загрузки SVG:', error);
            this.innerHTML = '<div class="base">⚠️ SVG не загружен</div>';
        }
    }

    attachEventListeners() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const icon = this.querySelector('.compass-icon');
                    if (icon) {
                        icon.addEventListener('click', () => {
                            this.toggle();
                        });
                        observer.disconnect();
                    }
                }
            }
        });

        observer.observe(this, { childList: true });
    }

    toggle() {
        this._active = !this._active;
        this.setAttribute('active', this._active.toString());
        this.updateState();

        // Генерируем событие
        this.dispatchEvent(new CustomEvent('change', {
            detail: { active: this._active },
            bubbles: true
        }));
    }

    updateState() {
        const icon = this.querySelector('.compass-icon');
        if (icon) {
            icon.classList.toggle('active', this._active);
        }

        // Обновление класса для самого элемента
        this.classList.toggle('active', this._active);

        // Обновление класса для body
        document.body.classList.toggle('active', this._active);
    }


    // Публичные методы и свойства
    get active() {
        return this._active;
    }

    set active(value) {
        this._active = Boolean(value);
        this.setAttribute('active', this._active.toString());
        this.updateState();
    }
}

// Регистрируем компонент
customElements.define('compass-switch', CompassSwitch);
