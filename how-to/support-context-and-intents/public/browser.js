class AddressBar extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
       //  this.shadowRoot.querySelector('h4').innerText = this.getAttribute('name');
       //  this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');   
    } 
    
    connectedCallback() {
      this.render();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }

    navigateToUrl = async (url) => {

        let currentWindow;
        if (fin.me.isWindow) {
            currentWindow = fin.me;
        } else if (fin.me.isView) {
            currentWindow = await fin.me.getCurrentWindow();
        } else {
            throw new Error('Not running in a platform View or Window');
        }
        console.log("currentWindow", currentWindow)
    
        const layout = fin.Platform.Layout.wrapSync(currentWindow.identity);
        const view = (await currentWindow.getCurrentViews())[0];
        view.navigate(url)
      }

    render() {
      this.shadowRoot.innerHTML = `
      <style>
        .container {
            display: flex;
            flex-direction: row;
            align-items: center;
            background-color: #404042;
            position: fixed;
            top: 0px;
            left: 0px;
            right: 0px;
            z-index: 999999;
        }

        .next-btn {
            margin-right: 10px;
        }

        </style>
      <div class="container"><button id="prevBtn">‚Üê</button><button id="nextBtn">‚Üí</button><input id="addressBar" value=${ window.location.href}></input></div>`;

      const inputEl = this.shadowRoot.querySelector("#addressBar");
      const prevButton = this.shadowRoot.querySelector("#prevBtn")
      const nextButton = this.shadowRoot.querySelector("#nextBtn")
      prevButton.addEventListener("click", () => {
        window.history.back()
      })
      nextButton.addEventListener("click", () => {
        window.history.forward()
      })
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            let url = e.target.value;
            if (!url.startsWith("http://") && !url.startsWith("https://"))
            {
                url = 'https://' + url;
            }
            this.navigateToUrl(url)
        }
      })
    }

    
    
  }

  customElements.define('address-bar', AddressBar);
  
  
window.addEventListener("DOMContentLoaded", async () => {
     // register component
    const wc = document.createElement('address-bar')
    document.body.prepend(wc)
    document.body.style.marginTop = '20px';
})
