class Modal extends HTMLElement {
    constructor() {
        super();
    }

    static ready(){return true;}

    static modalLock = false;

    static dataFront =
    html`<!-- centering with flex tends to overflow the parent scroll for some reason, so sometimes we have to use auto margins instead -->
    <div style="margin: auto;">
        <flex-column class="defaultMarginDouble defaultPadding defaultGapHalf themeBG roundedBorder themeBorder"
            style="word-wrap: break-word">
    `

    static dataBack =
    html`
        </flex-column>
    </div>
    `

    connectedCallback() {
        var innerData = this.innerHTML;
        this.innerHTML = Modal.dataFront + innerData + Modal.dataBack
        

        $(this).on("click", function(e){
            if (e.target != this && e.target != this.children[0]) {
                return;
            }
            this.hideModal();
        });
    }

    showModal(){
        if (Modal.modalLock || this.data_showAnimActive) {
            return;
        }
        this.data_showAnimActive = true;
        Modal.modalLock = true;

        $(this).css("display", "flex");
        $(this).animate({
            opacity: 1
        }, {
            duration: 500,
            complete: function(){
                this.data_showAnimActive = false;
            }
        });

        if(this.getElementsByTagName("input").length > 0){
            this.getElementsByTagName("input")[0].focus();
        }
    }

    hideModal(){
        if (this.data_hideAnimActive) {
            return;
        }
        this.data_hideAnimActive = true;
        
        // It's best we keep these animations queued (default) so they behave nicely if the user tries to exit immediately
        $(this).animate({
            opacity: 0
        }, {
            duration: 250,
            complete: function(){
                $(this).css('display', 'none');
                Modal.modalLock = false;
                this.data_hideAnimActive = false;
            }
        });
    }
}

customElements.define('modal-component', Modal);