import { Component, Input } from '@angular/core';

@Component({
  selector: 'ion-passcode',
  template: `
    <div class="ion-passcode-container">
      <ion-grid class="header">
        <ion-row>
          <ion-col class="text" [innerHTML]="options.title"></ion-col>
        </ion-row>
        <ion-row class="passcode-indicator" [class.error]="hasError">
          <ion-col *ngFor="let i of getIndicatorArray();">
            <div class="circle" [class.selected]="passcode.length >= i"></div>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid class="keys-grid">
        <ion-row>
          <ion-col class="key">
            <button ion-button outline (click)="onKeyClick(1)">1</button>
          </ion-col>
          <ion-col class="key">
            <button ion-button outline (click)="onKeyClick(2)">2</button>
          </ion-col>
          <ion-col class="key">
            <button ion-button outline (click)="onKeyClick(3)">3</button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="key">
            <button ion-button outline (click)="onKeyClick(4)">4</button>
          </ion-col>
          <ion-col class="key">
            <button ion-button outline (click)="onKeyClick(5)">5</button>
          </ion-col>
          <ion-col class="key">
            <button ion-button outline (click)="onKeyClick(6)">6</button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="key">
            <button ion-button outline (click)="onKeyClick(7)">7</button>
          </ion-col>
          <ion-col class="key">
            <button ion-button outline (click)="onKeyClick(8)">8</button>
          </ion-col>
          <ion-col class="key">
            <button ion-button outline (click)="onKeyClick(9)">9</button>
          </ion-col>
        </ion-row>
        <ion-row class="row">
          <ion-col></ion-col>
          <ion-col class="key">
            <button ion-button outline (click)="onKeyClick(0)">0</button>
          </ion-col>
          <ion-col class="key col delete-key delete-key-{{getDeleteKeyType()}}">
            <button ion-button outline *ngIf="getDeleteKeyType() === 'text'" (click)="onDeleteKeyClick()" [innerHTML]="getDeleteKeyValue()"></button>
            <button ion-button outline *ngIf="getDeleteKeyType() === 'icon'" (click)="onDeleteKeyClick()"><ion-icon name="{{getDeleteKeyValue()}}"></ion-icon></button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  `,
  styles: [`
    .ion-passcode-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      background: linear-gradient(to bottom right, #0287f9 0%, #038fc3 85%);
      color: white;
      text-align: center;
    }
    .header {
      margin: 8rem auto 0 auto;
    }
    .header .text {
      font-size: 1.2em;
      font-weight: 500;
      text-shadow: 0px 0px 1px #333;
    }
    .header .passcode-indicator {
      width: 150px;
      margin: 3rem auto;
    }
    .header .passcode-indicator.error {
      animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
    }
    .header .passcode-indicator .circle {
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background-color: rgba(0,0,0,.4);
      margin: auto;
      transition: all 150ms ease-in-out;
    }
    .header .passcode-indicator .circle.selected {
      background-color: #fff;
      box-shadow: 0px 0px 8px 2px #fff;
    }
    .keys-grid {
      max-width: 300px;
      margin: auto;
    }
    .keys-grid .key button {
      border-radius: 50%;
      padding: 3rem 2.8rem;
      color: white;
      border-color: rgba(204, 204, 204, .6);
    }
    .keys-grid .key button.button-outline-ios.activated {
      background-color: rgba(204, 204, 204, .6);
    }
    :host >>> .keys-grid .key button div.button-effect {
      background-color: #ccc;
    }
    .keys-grid .key.delete-key button {
      text-transform: uppercase;
      color: rgba(255, 255, 255, .5);
      border-color: transparent;
      font-size: 90%;
      padding: 0;
      line-height: 62px;
      height: 62px;
      width: 66px;
    }
    .keys-grid .key.delete-key.delete-key-icon button {
      font-size: 200%;
    }
    @media (max-height: 480px) {
      .header {
        margin-top: 5rem;
      }
      .header .passcode-indicator {
        width: 150px;
        margin: 1.5rem auto;
      }
    }
    @media (min-height: 481px) and (max-height: 568px) {
      .header {
        margin-top: 6rem;
      }
    }
    @media (min-height: 569px) and (max-height: 667px) {
      .header {
        margin-top: 8rem;
      }
    }
    @media (min-height: 700px) {
      .header {
        margin-top: 12rem;
      }
    }

    @keyframes shake {
      10%, 90% {
        transform: translate3d(-1px, 0, 0);
      }

      20%, 80% {
        transform: translate3d(3px, 0, 0);
      }

      30%, 50%, 70% {
        transform: translate3d(-6px, 0, 0);
      }

      40%, 60% {
        transform: translate3d(6px, 0, 0);
      }
    }
  `]
})
export class IonPasscode {
  @Input() options: IonPasscodeOptions;

  private passcode: string = '';
  private defaultMaxLength: number = 4;
  private hasError: boolean = false;

  constructor() { }

  ngOnInit() {
    if (this.options === undefined || this.options === null) {
      console.error('[IonPasscode] options are not defined.');
      return;
    }
  }

  onDeleteKeyClick() {
    this.passcode = this.passcode.substr(0, this.passcode.length - 1);
  }

  onKeyClick(key: number) {
    if (this.passcode.length < this.getPassCodeMaxLength() && !this.hasError) {
      this.passcode += key;
    }
    if (this.passcode.length == this.getPassCodeMaxLength() && this.options.onComplete) {
      setTimeout(() => {
        let promise = this.options.onComplete(this.passcode);
        if (promise) {
          promise.then(() => {
            this.passcode = '';
          }, () => {
            this.passcode = '';
            this.hasError = true;
            setTimeout(() => { this.hasError = false; }, 1000);
          });
        }
      }, 250);
    }
  }

  getDeleteKeyValue() {
    return this.options.deleteKeyValue ? this.options.deleteKeyValue : 'DELETE';
  }

  getDeleteKeyType() {
    return this.options.deleteKeyType === 'icon' ? 'icon' : 'text';
  }

  getPassCodeMaxLength() {
    return this.options.length > 0 ? this.options.length : this.defaultMaxLength;
  }

  getIndicatorArray() {
    let i = 0;
    return Array(this.getPassCodeMaxLength()).fill(1).map((x) => { i = i + 1; return i; });
  }
}

export interface IonPasscodeOptions {
  title: string,
  length?: number,
  deleteKeyValue?: string,
  deleteKeyType?: string,
  onComplete?: Function
}
